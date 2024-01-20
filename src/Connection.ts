import { SecureContext } from "tls";
import { v4 } from "uuid";

import { BodyType } from "./Interfaces/BodyType";
import { BufferedResponse } from "./Interfaces/BufferedResponse";
import { ClientSettingDefinition } from "./Interfaces/ClientSettingDefinition";
import { ExceptionDetail } from "./Interfaces/ExceptionDetail";
import { Href } from "./Interfaces/Href";
import { InflightMessage } from "./Interfaces/InflightMessage";
import { Message } from "./Interfaces/Message";
import { OneClientSettingDefinition } from "./Interfaces/ClientSettingDefinition";
import { OnePingResponse } from "./Interfaces/PingResponseDefinition";
import { PingResponseDefinition } from "./Interfaces/PingResponseDefinition";
import { Response } from "./Interfaces/Response";
import { RequestType } from "./Interfaces/RequestType";
import { Socket } from "./Socket";
import { TaggedResponse } from "./Interfaces/TaggedResponse";

export class Connection extends BufferedResponse<{
    Disconnected: () => void;
    Response: (response: Response) => void;
    Message: (response: Response) => void;
    Error: (error: Error) => void;
}> {
    private socket: Socket;

    private requests: Map<string, InflightMessage> = new Map();
    private subscriptions: Map<string, (r: Response) => void> = new Map();

    constructor(host: string, port: number, secureContext: SecureContext) {
        super();

        this.socket = new Socket(host, port, secureContext);

        this.socket.on("Error", this.onSocketError());
        this.socket.on("Close", this.onSocketClose());
        this.socket.on("Data", this.onSocketData());
        this.socket.on("End", this.onSocketEnd());
    }

    public async connect(): Promise<void> {
        await this.socket.connect();
    }

    public async ping(): Promise<PingResponseDefinition> {
        const response = await this.request("ReadRequest", "/server/1/status/ping");
        const body = response.Body as OnePingResponse;

        return body.PingResponse;
    }

    public close() {
        this.socket?.close();
    }

    public drain() {
        this.off("Message");
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

        const message: Message = {
            CommuniqueType: requestType,
            Header: {
                ClientTag: tag!,
                Url: url,
            },
            Body: body,
        };

        await this.socket.write(message);

        return new Promise<Response>((resolve, reject) => {
            this.requests.set(tag!, {
                message,
                resolve,
                reject,
                timeout: setTimeout(() => reject(new Error(`tag "${tag}" request timeout`)), 5_000),
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
                this.emit("Message", response);

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

    private onSocketData(): (data: Buffer) => void {
        return (data: Buffer): void => {
            this.parse(data, this.onResponse());
        };
    }

    private onSocketClose(): () => void {
        return (): void => {
            this.requests.clear();
            this.subscriptions.clear();

            this.emit("Disconnected");
        };
    }

    private onSocketEnd(): () => void {
        return (): void => {
            this.socket.close();
        };
    }

    private onSocketError(): (error: Error) => void {
        return (error: Error): void => {
            this.emit("Error", error);
        };
    }
}
