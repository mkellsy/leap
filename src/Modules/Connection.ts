import Logger from "js-logger";

import { connect, SecureContext, TLSSocket } from "tls";
import { v4 } from "uuid";

import { BodyType } from "../Interfaces/BodyType";
import { BufferedResponse } from "../Interfaces/BufferedResponse";
import { ClientSettingDefinition } from "../Interfaces/ClientSettingDefinition";
import { ConnectionEvents } from "./ConnectionEvents";
import { ExceptionDetail } from "../Interfaces/ExceptionDetail";
import { Href } from "../Interfaces/Href";
import { InflightMessage } from "../Interfaces/InflightMessage";
import { OneClientSettingDefinition } from "../Interfaces/ClientSettingDefinition";
import { OnePingResponse } from "../Interfaces/PingResponseDefinition";
import { Message } from "../Interfaces/Message";
import { PingResponseDefinition } from "../Interfaces/PingResponseDefinition";
import { Response } from "../Interfaces/Response";
import { RequestType } from "../Interfaces/RequestType";
import { TaggedResponse } from "../Interfaces/TaggedResponse";

const log = Logger.get("Connection");

export class Connection extends BufferedResponse<ConnectionEvents> {
    private connection?: TLSSocket;

    private readonly host: string;
    private readonly port: number;
    private readonly secureContext: SecureContext;

    private requests: Map<string, InflightMessage> = new Map();
    private subscriptions: Map<string, (r: Response) => void> = new Map();

    constructor(host: string, port: number, secureContext: SecureContext) {
        super();

        this.host = host;
        this.port = port;
        this.secureContext = secureContext;
    }

    public connect(): Promise<void> {
        return new Promise((resolve, reject) => {
            if (this.connection != null) {
                return resolve();
            }

            const connection = connect(this.port, this.host, {
                secureContext: this.secureContext,
                secureProtocol: "TLSv1_2_method",
                rejectUnauthorized: false,
            });

            connection.once("secureConnect", this.onSecureConnect(resolve, reject, connection));
            connection.once("error", reject);
        });
    }

    public async ping(): Promise<PingResponseDefinition> {
        const response = await this.request("ReadRequest", "/server/1/status/ping");
        const body = response.Body as OnePingResponse;

        return body.PingResponse;
    }

    public close() {
        this.connection?.end();
        this.connection = undefined;
    }

    public drain() {
        this.off("Unsolicited");
        this.off("Response");
        this.off("Disconnected");

        for (const tag of this.requests.keys()) {
            const request = this.requests.get(tag)!;

            clearTimeout(request.timeout);
        }

        this.requests.clear();
        this.subscriptions.clear();

        this.close();
    }

    public async get<T extends BodyType>(href: Href, endpoint?: string): Promise<T> {
        const response = await this.request("ReadRequest", `${href.href}${endpoint !== undefined ? endpoint : ""}`);

        if (response.Body == null) {
            throw new Error(`${href.href} no body`);
        }

        if (response.Body instanceof ExceptionDetail) {
            throw new Error(response.Body.Message);
        }

        return response.Body as T;
    }

    public async request(requestType: RequestType, url: string, body?: Record<string, unknown>, tag?: string): Promise<Response> {
        await this.connect();

        if (tag === undefined) {
            tag = v4();
        }

        if (this.requests.has(tag!)) {
            const request = this.requests.get(tag!)!;

            request.reject(new Error(`tag "${tag}" reused`));
            clearTimeout(request.timeout);

            this.requests.delete(tag!);
        }

        return new Promise<Response>((resolve, reject) => {
            const message: Message = {
                CommuniqueType: requestType,
                Header: {
                    ClientTag: tag!,
                    Url: url,
                },
                Body: body,
            };

            this.connection?.write(`${JSON.stringify(message)}\n`, () => {
                this.requests.set(tag!, {
                    message,
                    resolve,
                    reject,
                    timeout: setTimeout(() => reject(new Error(`tag "${tag}" request timeout`)), 5000),
                });
            });
        });
    }

    public async subscribe(
        url: string,
        callback: (response: Response) => void,
        requestType?: RequestType,
        body?: Record<string, unknown>,
        tag?: string
    ): Promise<TaggedResponse> {
        const uuid = tag || v4();

        return await this.request(requestType || "SubscribeRequest", url, body, uuid).then((response: Response) => {
            if (response.Header.StatusCode !== undefined && response.Header.StatusCode.isSuccessful()) {
                this.subscriptions.set(uuid, callback);
            }

            return { response, tag: uuid };
        });
    }

    public async setVersion(): Promise<ExceptionDetail | ClientSettingDefinition> {
        const response = await this.request("UpdateRequest", "/clientsetting", {
            ClientSetting: {
                ClientMajorVersion: 1,
            },
        });

        switch (response.CommuniqueType) {
            case "ExceptionResponse":
                return response.Body! as ExceptionDetail;

            case "UpdateResponse":
                return (response.Body! as OneClientSettingDefinition).ClientSetting;

            default:
                throw new Error("bad communique type");
        }
    }

    private onResponse(): (response: Response) => void {
        return (response: Response): void => {
            const tag = response.Header.ClientTag;

            if (tag == null) {
                this.emit("Unsolicited", response);

                return;
            }

            const request = this.requests.get(tag)!;

            if (request != null) {
                clearTimeout(request.timeout);

                this.requests.delete(tag);
                request.resolve(response);
            }

            const subscription = this.subscriptions.get(tag);

            if (subscription == null) {
                return;
            }

            subscription(response);
        };
    }

    private onSecureConnect(resolve: (value: void | PromiseLike<void>) => void, reject: (reason?: any) => void, connection: TLSSocket): () => void {
        return (): void => {
            this.connection = connection;

            connection.off("error", reject);

            connection.on("error", this.onSocketError());
            connection.on("close", this.onSocketClose());
            connection.on("data", this.onSocketData());
            connection.on("end", this.onSocketEnd(connection));

            resolve();
        };
    }

    private onSocketData(): (data: Buffer) => void {
        return (data: Buffer): void => {
            this.parse(data, this.onResponse());
        };
    }

    private onSocketClose(): () => void {
        return (): void => {
            this.connection = undefined;

            this.requests.clear();
            this.subscriptions.clear();

            this.emit("Disconnected");
        };
    }

    private onSocketEnd(connection: TLSSocket): () => void {
        return (): void => {
            connection.end();
            connection.destroy();
        };
    }

    private onSocketError(): (error: Error) => void {
        return (error: Error): void => {
            log.error(error);
        };
    }
}
