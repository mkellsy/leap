import fs from "fs";
import path from "path";

import { BSON } from "bson";
import { pki } from "node-forge";
import { v4 } from "uuid";

import { Authentication } from "./Interfaces/Authentication";
import { BufferedResponse } from "./Interfaces/BufferedResponse";
import { Certificate } from "./Interfaces/Certificate";
import { CertificateRequest } from "./Interfaces/CertificateRequest";
import { ExceptionDetail } from "./Interfaces/ExceptionDetail";
import { InflightMessage } from "./Interfaces/InflightMessage";
import { Message } from "./Interfaces/Message";
import { PhysicalAccess } from "./Interfaces/PhysicalAccess";
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
    private secure: boolean = false;
    private teardown: boolean = false;

    private host: string;
    private port: number;
    private certificate: Certificate;

    private requests: Map<string, InflightMessage> = new Map();
    private subscriptions: Map<string, Subscription> = new Map();

    constructor(host: string, certificate?: Certificate) {
        super();

        this.host = host;
        this.port = certificate != null ? 8081 : 8083;
        this.secure = certificate != null;

        this.certificate = {
            ca: "",
            cert: "",
            key: "",
            ...(certificate != null ? certificate : this.authorityCertificate()),
        };
    }

    public async connect(): Promise<void> {
        this.teardown = false;
        this.socket = undefined;

        const subscriptions = [...this.subscriptions.values()];
        const socket = new Socket(this.host, this.port, this.certificate);

        socket.on("Data", this.onSocketData);
        socket.on("Error", this.onSocketError);
        socket.on("Disconnect", this.onSocketDisconnect);

        const protocol = await socket.connect();

        if (!this.secure) {
            await this.physicalAccess();
        }

        this.subscriptions.clear();
        this.socket = socket;

        if (this.secure) {
            for (const subscription of subscriptions) {
                this.subscribe(subscription.url, subscription.listener);
            }
        }

        this.emit("Connect", protocol);
    }

    public disconnect() {
        this.teardown = true;

        if (this.secure) {
            this.drainRequests();
        }

        this.subscriptions.clear();
        this.socket?.disconnect();
    }

    public async read<T>(url: string): Promise<T> {
        if (!this.secure) {
            throw new Error("Only available for secure connections");
        }

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

    public async authenticate(csr: CertificateRequest): Promise<Certificate> {
        if (this.secure) {
            throw new Error("Only available for physical connections");
        }

        return new Promise((resolve, reject) => {
            const message = {
                Header: {
                    RequestType: "Execute",
                    Url: "/pair",
                    ClientTag: "get-cert",
                },
                Body: {
                    CommandType: "CSR",
                    Parameters: {
                        CSR: csr.cert,
                        DisplayName: "get_lutron_cert.py",
                        DeviceUID: "000000000000",
                        Role: "Admin",
                    },
                },
            };

            const timeout = setTimeout(() => reject(new Error("Authentication timeout exceeded")), 5_000);

            this.once("Message", (response: Response) => {
                clearTimeout(timeout);

                resolve({
                    ca: (response.Body as Authentication).SigningResult.RootCertificate,
                    cert: (response.Body as Authentication).SigningResult.Certificate,
                    key: pki.privateKeyToPem(csr.key),
                });
            });

            this.socket?.write(message);
        });
    }

    public async update<T>(url: string, body: Record<string, unknown>): Promise<T> {
        if (!this.secure) {
            throw new Error("Only available for secure connections");
        }

        const tag = v4();
        const response = await this.sendRequest(tag, "UpdateRequest", url, body);

        if (response.Body instanceof ExceptionDetail) {
            throw new Error(response.Body.Message);
        }

        return response.Body as T;
    }

    public async command(url: string, command: Record<string, unknown>): Promise<void> {
        if (!this.secure) {
            throw new Error("Only available for secure connections");
        }

        const tag = v4();

        await this.sendRequest(tag, "CreateRequest", url, command);
    }

    public subscribe<T>(url: string, listener: (response: T) => void): void {
        if (!this.secure) {
            throw new Error("Only available for secure connections");
        }

        const tag = v4();

        this.sendRequest(tag, "SubscribeRequest", url).then((response: Response) => {
            if (response.Header.StatusCode != null && response.Header.StatusCode.isSuccessful()) {
                this.subscriptions.set(tag, {
                    url,
                    listener,
                    callback: (response: Response) => listener(response.Body as T),
                });
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

    private async sendRequest(
        tag: string,
        requestType: RequestType,
        url: string,
        body?: Record<string, unknown>,
    ): Promise<Response> {
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
        if (this.secure) {
            this.parse(data, this.onResponse);
        } else {
            this.emit("Message", JSON.parse(data.toString()));
        }
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

    private authorityCertificate(): Certificate | null {
        const filename = path.resolve(__dirname, "../authority");

        if (fs.existsSync(filename)) {
            const bytes = fs.readFileSync(filename);
            const certificate = BSON.deserialize(bytes) as Certificate;

            if (certificate == null) {
                return null;
            }

            certificate.ca = Buffer.from(certificate.ca, "base64").toString("utf8");
            certificate.key = Buffer.from(certificate.key, "base64").toString("utf8");
            certificate.cert = Buffer.from(certificate.cert, "base64").toString("utf8");

            return certificate;
        }

        return null;
    }

    private physicalAccess(): Promise<void> {
        return new Promise((resolve, reject) => {
            const timeout = setTimeout(() => reject(new Error("Physical timeout exceeded")), 60_000);

            this.once("Message", (response: Response) => {
                if ((response.Body as PhysicalAccess).Status.Permissions.includes("PhysicalAccess")) {
                    clearTimeout(timeout);

                    return resolve();
                }

                return reject(new Error("Unknown pairing error"));
            });
        });
    }
}
