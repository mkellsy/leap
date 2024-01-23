import { SecureContext } from "tls";
import { v4 } from "uuid";

import { BufferedResponse } from "./Interfaces/BufferedResponse";
import { ExceptionDetail } from "./Interfaces/ExceptionDetail";
import { InflightMessage } from "./Interfaces/InflightMessage";
import { Message } from "./Interfaces/Message";
import { Response } from "./Interfaces/Response";
import { RequestType } from "./Interfaces/RequestType";
import { Socket } from "./Socket";

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

        this.socket.on("Error", this.onSocketError);
        this.socket.on("Close", this.onSocketClose);
        this.socket.on("Data", this.onSocketData);
        this.socket.on("End", this.onSocketEnd);
    }

    public async connect(): Promise<void> {
        await this.socket.connect();
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

    public async read<T>(url: string): Promise<T> {
        const tag = v4();
        const response = await this.sendRequest(tag, "ReadRequest", url);
        const body = response.Body as T;

        if (body == null) {
            throw new Error(`${url} no body`);
        }

        if (response.Body instanceof ExceptionDetail) {
            throw new Error(response.Body.Message);
        }

        return response.Body as T;
    }

    public async update<T>(url: string, body: any): Promise<T> {
        const tag = v4();
        const response = await this.sendRequest(tag, "UpdateRequest", url, body);

        if (response.Body instanceof ExceptionDetail) {
            throw new Error(response.Body.Message);
        }

        return response.Body as T;
    }

    public async command(url: string, command: any): Promise<void> {
        const tag = v4();

        await this.sendRequest(tag, "CreateRequest", url, command);
    }

    public async subscribe<T>(url: string, listener: (response: T) => void): Promise<void> {
        const tag = v4();

        this.sendRequest(tag, "SubscribeRequest", url).then((response: Response) => {
            if (response.Header.StatusCode != null && response.Header.StatusCode.isSuccessful()) {
                this.subscriptions.set(tag, (response: Response) => listener(response.Body as T));
            }
        });
    }

    private async sendRequest(tag: string, requestType: RequestType, url: string, body?: Record<string, unknown>): Promise<Response> {
        await this.connect();

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

    private onResponse = (response: Response): void => {
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

    private onSocketData = (data: Buffer): void => {
        this.parse(data, this.onResponse);
    };

    private onSocketClose = (): void => {
        this.requests.clear();
        this.subscriptions.clear();

        this.emit("Disconnected");
    };

    private onSocketEnd = (): void => {
        this.socket.close();
    };

    private onSocketError = (error: Error): void => {
        this.emit("Error", error);
    };
}
