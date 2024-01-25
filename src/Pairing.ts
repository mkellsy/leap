import { EventEmitter } from "@mkellsy/event-emitter";

import { AuthContext } from "./Interfaces/AuthContext";
import { Socket } from "./Socket";

export class Pairing extends EventEmitter<{
    Connect: (protocol: string) => void;
    Disconnect: () => void;
    Message: (response: object) => void;
    Error: (error: Error) => void;
}> {
    private socket?: Socket;
    private teardown: boolean = false;

    private readonly host: string;
    private readonly port: number;
    private readonly context: AuthContext;

    constructor(host: string, port: number, context: AuthContext) {
        super();

        this.host = host;
        this.port = port;
        this.context = context;
    }

    public async connect(): Promise<void> {
        this.teardown = false;

        this.socket?.off();
        this.socket = new Socket(this.host, this.port, this.context);

        this.socket.on("Data", this.onSocketData);
        this.socket.on("Error", this.onSocketError);
        this.socket.on("Disconnect", this.onSocketDisconnect);

        const protocol = await this.socket.connect();

        this.emit("Connect", protocol);
    }

    public disconnect() {
        this.teardown = true;

        this.socket?.disconnect();
    }

    public async pair(csr: string) {
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

        this.socket?.write(message);
    }

    private onSocketData = (data: Buffer): void => {
        this.emit("Message", JSON.parse(data.toString()));
    };

    private onSocketDisconnect = (): void => {
        if (!this.teardown) {
            this.connect();
        } else {
            this.emit("Disconnect");
        }
    };

    private onSocketError = (error: Error): void => {
        this.emit("Error", error);
    };
}
