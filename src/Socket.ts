import { EventEmitter } from "@mkellsy/event-emitter";
import { connect, createSecureContext, SecureContext, TLSSocket } from "tls";

import { AuthContext } from "./Interfaces/AuthContext";
import { Message } from "./Interfaces/Message";

export class Socket extends EventEmitter<{
    Error: (error: Error) => void;
    Data: (data: Buffer) => void;
    Disconnect: () => void;
}> {
    private connection?: TLSSocket;

    private readonly host: string;
    private readonly port: number;
    private readonly context: AuthContext;

    constructor(host: string, port: number, context: AuthContext) {
        super();

        this.host = host;
        this.port = port;
        this.context = context;
    }

    public connect(): Promise<string> {
        return new Promise((resolve, reject) => {
            const connection = connect(this.port, this.host, {
                secureContext: createSecureContext(this.context),
                secureProtocol: "TLS_method",
                rejectUnauthorized: false,
            });

            connection.once("secureConnect", (): void => {
                this.connection = connection;

                this.connection.off("error", reject);

                this.connection.on("error", this.onSocketError);
                this.connection.on("data", this.onSocketData);
                this.connection.on("end", this.onSocketEnd);

                this.connection.setKeepAlive(true);

                resolve(this.connection.getProtocol() || "Unknown");
            });

            connection.once("error", reject);
        });
    }

    public disconnect(): void {
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

    private onSocketData = (data: Buffer): void => {
        this.emit("Data", data);
    };

    private onSocketEnd = (): void => {
        this.emit("Disconnect");
    };

    private onSocketError = (error: Error): void => {
        this.emit("Error", error);
    };
}
