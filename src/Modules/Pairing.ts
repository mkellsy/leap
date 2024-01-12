import Logger from "js-logger";

import { EventEmitter } from "@mkellsy/event-emitter";
import { SecureContext, TLSSocket, connect, createSecureContext } from "tls";

import { PairingEvents } from "./PairingEvents";

import Athority from "../Certificates/Athority";
import Certificate from "../Certificates/Certificate";
import Key from "../Certificates/Key";

const log = Logger.get("Pairing");

export class Pairing extends EventEmitter<PairingEvents> {
    private connection?: TLSSocket;

    private readonly host: string;
    private readonly port: number;
    private readonly secureContext: SecureContext;

    constructor(host: string, port: number) {
        super();

        this.host = host;
        this.port = port;

        this.secureContext = createSecureContext({
            ca: Athority,
            key: Key,
            cert: Certificate,
        });
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

    public async pair(csr: string) {
        await this.connect();

        const message = {
            Header: {
                RequestType: "Execute",
                Url: "/pair",
                ClientTag: "get-cert",
            },
            Body: {
                CommandType: "CSR",
                Parameters: {
                    CSR: csr,
                    DisplayName: "get_lutron_cert.py",
                    DeviceUID: "000000000000",
                    Role: "Admin",
                },
            },
        };

        this.connection?.write(`${JSON.stringify(message)}\n`);
    }

    private onSecureConnect(resolve: (value: void | PromiseLike<void>) => void, reject: (reason?: any) => void, connection: TLSSocket): () => void {
        return (): void => {
            this.connection = connection;

            connection.off("error", reject);

            connection.once("error", this.onSocketError());
            connection.on("close", this.onSocketClose());
            connection.on("data", this.onSocketData());

            resolve();
        };
    }

    private onSocketData(): (data: Buffer) => void {
        return (data: Buffer): void => {
            this.emit("Message", JSON.parse(data.toString()));
        };
    }

    private onSocketClose(): () => void {
        return (): void => {
            this.connection = undefined;

            this.emit("Disconnected");
        };
    }

    private onSocketError(): (error: Error) => void {
        return (error: Error): void => {
            log.error(error);
        };
    }
}
