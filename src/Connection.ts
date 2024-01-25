import { v4 } from "uuid";

import { AuthContext } from "./Interfaces/AuthContext";
import { BufferedResponse } from "./Interfaces/BufferedResponse";
import { ExceptionDetail } from "./Interfaces/ExceptionDetail";
import { InflightMessage } from "./Interfaces/InflightMessage";
import { Message } from "./Interfaces/Message";
import { Response } from "./Interfaces/Response";
import { RequestType } from "./Interfaces/RequestType";
import { Socket } from "./Socket";
import { Subscription } from "./Interfaces/Subscription";

export class Connection extends BufferedResponse<{
    Connect: (protocol: string) => void;
    Disconnect: () => void;
    Response: (response: Response) => void;
    Message: (response: Response) => void;
    Error: (error: Error) => void;
}> {
    private socket?: Socket;
    private teardown: boolean = false;

    private host: string;
    private port: number;
    private context: AuthContext;

    private requests: Map<string, InflightMessage> = new Map();
    private subscriptions: Map<string, Subscription> = new Map();

    constructor(host: string, port: number, context: AuthContext) {
        super();

        this.host = host;
        this.port = port;
        this.context = context;
    }

    public async connect(): Promise<void> {
        this.teardown = false;
        this.socket = undefined;

        const subscriptions = [...this.subscriptions.values()];
        const socket = new Socket(this.host, this.port, this.context);

        socket.on("Data", this.onSocketData);
        socket.on("Error", this.onSocketError);
        socket.on("Disconnect", this.onSocketDisconnect);

        const protocol = await socket.connect();

        this.subscriptions.clear();
        this.socket = socket;

        for (const subscription of subscriptions) {
            this.subscribe(subscription.url, subscription.listener);
        }

        this.emit("Connect", protocol);
    }

    public disconnect() {
        this.teardown = true;

        this.drainRequests();

        this.subscriptions.clear();
        this.socket?.disconnect();
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

    public subscribe<T>(url: string, listener: (response: T) => void): void {
        const tag = v4();

        this.sendRequest(tag, "SubscribeRequest", url).then((response: Response) => {
            if (response.Header.StatusCode != null && response.Header.StatusCode.isSuccessful()) {
                this.subscriptions.set(tag, { url, listener, callback: (response: Response) => listener(response.Body as T) });
            }
        });
    }

    private drainRequests() {
        for (const tag of this.requests.keys()) {
            const request = this.requests.get(tag)!;

            clearTimeout(request.timeout);
        }

        this.requests.clear();
    }

    private async sendRequest(tag: string, requestType: RequestType, url: string, body?: Record<string, unknown>): Promise<Response> {
        if (this.requests.has(tag)) {
            const request = this.requests.get(tag)!;

            request.reject(new Error(`tag "${tag}" reused`));

            clearTimeout(request.timeout);

            this.requests.delete(tag);
        }

        const message: Message = {
            CommuniqueType: requestType,
            Header: {
                ClientTag: tag!,
                Url: url,
            },
            Body: body,
        };

        await this.socket?.write(message);

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

        subscription.callback(response);
    };

    private onSocketData = (data: Buffer): void => {
        this.parse(data, this.onResponse);
    };

    private onSocketDisconnect = (): void => {
        if (!this.teardown) {
            this.drainRequests();
            this.connect();
        } else {
            this.emit("Disconnect");
        }
    };

    private onSocketError = (error: Error): void => {
        this.emit("Error", error);
    };
}
