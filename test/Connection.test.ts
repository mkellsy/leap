import fs from "fs";
import path from "path";

import { proxy, registerNode } from "proxyrequire";

import chai, { expect } from "chai";
import sinon from "sinon";
import sinonChai from "sinon-chai";

import { Connection } from "../src/Connection";

chai.use(sinonChai);
registerNode();

const emit = (stub: any, event: string, ...payload: any[]) => {
    for (const callback of stub.callbacks[event] || []) {
        callback(...payload);
    }
};

describe("Connection", () => {
    let emitStub: any;
    let existsStub: any;
    let socketStub: any;
    let optionsStub: any;
    let authorityStub: any;
    let reachableStub: any;
    let connectionStub: any;
    let certificateStub: any;

    let connection: Connection;
    let connectionType: typeof Connection;

    before(() => {
        connectionType = proxy(() => require("../src/Connection").Connection, {
            fs: {
                existsSync() {
                    return existsStub;
                },
                readFileSync() {
                    return authorityStub;
                },
            },
            net: {
                Socket: class {
                    setTimeout = (timeout: number): void => {
                        reachableStub.timeout = timeout;
                    };

                    once = (event: string, callback: Function): void => {
                        reachableStub.callbacks[event] = callback;
                    };

                    connect = (port: number, host: string, callback: Function): void => {
                        reachableStub.port = port;
                        reachableStub.host = host;
                        reachableStub.callbacks.connect = callback;
                    };

                    destroy = reachableStub.destroy;
                },
            },
            "./Interfaces/BufferedResponse": {
                BufferedResponse: class {
                    emit(event: string, ...payload: any[]) {
                        emitStub(event, ...payload);
                    }

                    on(event: string, callback: Function) {
                        if (connectionStub.callbacks[event] == null) {
                            connectionStub.callbacks[event] = [];
                        }

                        connectionStub.callbacks[event].push(callback);

                        return this;
                    }

                    once(event: string, callback: Function) {
                        if (connectionStub.callbacks[event] == null) {
                            connectionStub.callbacks[event] = [];
                        }

                        connectionStub.callbacks[event].push(callback);

                        return this;
                    }

                    parse(data: any, callback: Function): void {
                        callback(data);
                    }
                },
            },
            "./Socket": {
                Socket: class {
                    constructor(host: string, port: number, certificate: any) {
                        optionsStub = { host, port, certificate };
                    }

                    connect() {
                        return socketStub.connect;
                    }

                    disconnect() {
                        return socketStub.disconnect();
                    }

                    on(event: string, callback: Function) {
                        if (socketStub.callbacks[event] == null) {
                            socketStub.callbacks[event] = [];
                        }

                        socketStub.callbacks[event].push(callback);

                        return this;
                    }

                    once(event: string, callback: Function) {
                        if (socketStub.callbacks[event] == null) {
                            socketStub.callbacks[event] = [];
                        }

                        socketStub.callbacks[event].push(callback);

                        return this;
                    }

                    emit(event: string, ...payload: any[]): void {
                        socketStub.emit(event, ...payload);
                    }
                },
            },
        });
    });

    beforeEach(() => {
        certificateStub = {
            ca: "ROOT",
            cert: "CERTIFICATE",
            key: "PUBLIC_KEY",
        };

        reachableStub = {
            callbacks: {},
            timeout: 0,

            port: 0,
            host: undefined,

            destroy: sinon.stub(),
        };

        connectionStub = { callbacks: {} };

        socketStub = {
            callbacks: {},
            connect: sinon.promise(),
            disconnect: sinon.stub(),
        };

        authorityStub = fs.readFileSync(path.resolve(__dirname, "../authority"));
        existsStub = true;
        emitStub = sinon.stub();

        connection = new connectionType("HOST", certificateStub);
    });

    describe("reachable()", () => {
        it("should return true if a host can be connected to", (done) => {
            connectionType.reachable("HOST").then((reachable) => {
                expect(reachable).to.be.true;

                expect(reachableStub.timeout).to.equal(1000);
                expect(reachableStub.port).to.equal(8081);
                expect(reachableStub.host).to.equal("HOST");

                expect(reachableStub.destroy).to.be.called;

                done();
            });

            reachableStub.callbacks.connect();
        });

        it("should return false if a host connection attempt timesout", (done) => {
            connectionType.reachable("HOST").then((reachable) => {
                expect(reachable).to.be.false;

                expect(reachableStub.timeout).to.equal(1000);
                expect(reachableStub.port).to.equal(8081);
                expect(reachableStub.host).to.equal("HOST");

                expect(reachableStub.destroy).to.be.called;

                done();
            });

            reachableStub.callbacks.timeout();
        });

        it("should return false if a host connection emits an error", (done) => {
            connectionType.reachable("HOST").then((reachable) => {
                expect(reachable).to.be.false;

                expect(reachableStub.timeout).to.equal(1000);
                expect(reachableStub.port).to.equal(8081);
                expect(reachableStub.host).to.equal("HOST");

                expect(reachableStub.destroy).to.be.called;

                done();
            });

            reachableStub.callbacks.error();
        });
    });

    describe("connect()", () => {
        it("should define listeners and emit a Connect event", (done) => {
            connection
                .connect()
                .then(() => {
                    expect(optionsStub.host).to.equal("HOST");
                    expect(optionsStub.port).to.equal(8083);
                    expect(optionsStub.certificate.ca).to.equal("ROOT");
                    expect(optionsStub.certificate.cert).to.equal("CERTIFICATE");
                    expect(optionsStub.certificate.key).to.equal("PUBLIC_KEY");

                    expect(socketStub.callbacks["Data"].length).to.be.greaterThan(0);
                    expect(socketStub.callbacks["Error"].length).to.be.greaterThan(0);
                    expect(socketStub.callbacks["Disconnect"].length).to.be.greaterThan(0);

                    expect(emitStub).to.be.calledWith("Connect", sinon.match.any);

                    done();
                })
                .catch((error) => console.log(error));

            socketStub.connect.resolve("PROTOCOL");
            emit(connectionStub, "Message");
        });

        it("should define listeners and emit a Connect event for non-secure connections", (done) => {
            connection = new connectionType("HOST");

            connection
                .connect()
                .then(() => {
                    expect(optionsStub.host).to.equal("HOST");
                    expect(optionsStub.port).to.equal(8081);

                    done();
                })
                .catch((error) => console.log(error));

            socketStub.connect.resolve("PROTOCOL");

            setTimeout(() => {
                emit(connectionStub, "Message", { Body: { Status: { Permissions: ["PhysicalAccess"] } } });
            }, 1);
        });

        it("should default the certificate to default if the authority file doesn't exist", (done) => {
            existsStub = false;
            connection = new connectionType("HOST");

            connection
                .connect()
                .then(() => {
                    expect(optionsStub.certificate.ca).to.equal("");
                    expect(optionsStub.certificate.cert).to.equal("");
                    expect(optionsStub.certificate.key).to.equal("");

                    done();
                })
                .catch((error) => console.log(error));

            socketStub.connect.resolve("PROTOCOL");

            setTimeout(() => {
                emit(connectionStub, "Message", { Body: { Status: { Permissions: ["PhysicalAccess"] } } });
            }, 1);
        });

        it("should default the certificate to default if the authority file is corrupt", (done) => {
            authorityStub = null;
            connection = new connectionType("HOST");

            connection
                .connect()
                .then(() => {
                    expect(optionsStub.certificate.ca).to.equal("");
                    expect(optionsStub.certificate.cert).to.equal("");
                    expect(optionsStub.certificate.key).to.equal("");

                    done();
                })
                .catch((error) => console.log(error));

            socketStub.connect.resolve("PROTOCOL");

            setTimeout(() => {
                emit(connectionStub, "Message", { Body: { Status: { Permissions: ["PhysicalAccess"] } } });
            }, 1);
        });
    });

    describe("disconnect()", () => {
        it("should not call destroy if connection is not established", () => {
            connection.disconnect();
            expect(socketStub.disconnect).to.not.be.called;
        });

        it("should call destroy if connection is established", (done) => {
            connection
                .connect()
                .then(() => {
                    connection.disconnect();

                    expect(socketStub.disconnect).to.be.called;
                    done();
                })
                .catch((error) => console.log(error));

            socketStub.connect.resolve("PROTOCOL");
            emit(connectionStub, "Message");
        });

        it("should call destroy for non-secure connections", (done) => {
            connection = new connectionType("HOST");

            connection
                .connect()
                .then(() => {
                    connection.disconnect();

                    expect(socketStub.disconnect).to.be.called;
                    done();
                })
                .catch((error) => console.log(error));

            socketStub.connect.resolve("PROTOCOL");

            setTimeout(() => {
                emit(connectionStub, "Message", { Body: { Status: { Permissions: ["PhysicalAccess"] } } });
            }, 1);
        });
    });

    describe("onSocketData()", () => {
        it("should emit message event on untagged responses", (done) => {
            connection
                .connect()
                .then(() => {
                    emit(socketStub, "Data", { Header: { ClientTag: null } });

                    expect(emitStub).to.be.calledWith("Message", sinon.match.any);
                    done();
                })
                .catch((error) => console.log(error));

            socketStub.connect.resolve("PROTOCOL");
            emit(connectionStub, "Message");
        });

        it("should not emit message event on tagged responses", (done) => {
            connection
                .connect()
                .then(() => {
                    emit(socketStub, "Data", { Header: { ClientTag: "UNKNOWN" } });

                    expect(emitStub).to.not.be.calledWith("Message", sinon.match.any);
                    done();
                })
                .catch((error) => console.log(error));

            socketStub.connect.resolve("PROTOCOL");
            emit(connectionStub, "Message");
        });

        it("should emit message event for non-secure responses", (done) => {
            connection = new connectionType("HOST");

            connection
                .connect()
                .then(() => {
                    emit(socketStub, "Data", Buffer.from(JSON.stringify({ message: "MESSAGE" })));

                    expect(emitStub).to.be.calledWith("Message", sinon.match.any);
                    done();
                })
                .catch((error) => console.log(error));

            socketStub.connect.resolve("PROTOCOL");

            setTimeout(() => {
                emit(connectionStub, "Message", { Body: { Status: { Permissions: ["PhysicalAccess"] } } });
            }, 1);
        });
    });

    describe("onSocketDisconnect()", () => {
        it("should emit a disconenct event when the socket ends", (done) => {
            connection
                .connect()
                .then(() => {
                    connection.disconnect();
                    emit(socketStub, "Disconnect");

                    expect(emitStub).to.be.calledWith("Disconnect");
                    done();
                })
                .catch((error) => console.log(error));

            socketStub.connect.resolve("PROTOCOL");
            emit(connectionStub, "Message");
        });
    });

    describe("onSocketError()", () => {
        it("should emit an error event when the socket has an error", (done) => {
            connection
                .connect()
                .then(() => {
                    emit(socketStub, "Error", "TEST ERROR");

                    expect(emitStub).to.be.calledWith("Error", "TEST ERROR");
                    done();
                })
                .catch((error) => console.log(error));

            socketStub.connect.resolve("PROTOCOL");
            emit(connectionStub, "Message");
        });
    });
});
