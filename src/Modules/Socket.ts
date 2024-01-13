import { EventEmitter } from "@mkellsy/event-emitter";
import { connect, SecureContext, TLSSocket } from "tls";

import { Message } from "../Interfaces/Message";
import { SocketEvents } from "./SocketEvents";

export class Socket extends EventEmitter<SocketEvents> {
    private connection?: TLSSocket;

    private readonly host: string;
    private readonly port: number;
    private readonly secureContext: SecureContext;

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

    public close(): void {
        this.connection?.end();
        this.connection?.destroy();
    }

    public write(message: Message): Promise<void> {
        return new Promise((resolve, reject) => {
            this.connection?.write(`${JSON.stringify(message)}\n`, (error) => {
                if (error != null) {
                    return reject(error);
                }

                return resolve();
            });
        });
    }

    private onSecureConnect(resolve: (value: void | PromiseLike<void>) => void, reject: (reason?: any) => void, connection: TLSSocket): () => void {
        return (): void => {
            this.connection = connection;

            connection.off("error", reject);

            connection.on("error", this.onSocketError());
            connection.on("close", this.onSocketClose());
            connection.on("data", this.onSocketData());
            connection.on("end", this.onSocketEnd());

            resolve();
        };
    }

    private onSocketData(): (data: Buffer) => void {
        return (data: Buffer): void => {
            this.emit("Data", data);
        };
    }

    private onSocketClose(): () => void {
        return (): void => {
            this.emit("Close");
        };
    }

    private onSocketEnd(): () => void {
        return (): void => {
            this.emit("End");
        };
    }

    private onSocketError(): (error: Error) => void {
        return (error: Error): void => {
            this.emit("Error", error);
        };
    }
}
