import { EventEmitter } from "@mkellsy/event-emitter";
import { SecureContext } from "tls";

import { Socket } from "./Socket";

export class Pairing extends EventEmitter<{
    Message: (response: object) => void;
    Disconnected: () => void;
    Error: (error: Error) => void;
}> {
    private socket: Socket;

    constructor(host: string, port: number, secureContext: SecureContext) {
        super();

        this.socket = new Socket(host, port, secureContext);

        this.socket.on("Error", this.onSocketError);
        this.socket.on("Close", this.onSocketClose);
        this.socket.on("Data", this.onSocketData);
    }

    public async connect(): Promise<void> {
        await this.socket.connect();
    }

    public close() {
        this.socket?.close();
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

        this.socket.write(message);
    }

    private onSocketData = (data: Buffer): void => {
        this.emit("Message", JSON.parse(data.toString()));
    };

    private onSocketClose = (): void => {
        this.emit("Disconnected");
    };

    private onSocketError = (error: Error): void => {
        this.emit("Error", error);
    };
}
