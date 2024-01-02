import { EventEmitter } from "@mkellsy/event-emitter";

import { ConnectionEvents } from "../ConnectionEvents";
import { Response } from "./Response";

export class BufferedResponse extends EventEmitter<ConnectionEvents> {
    private buffer: string = "";

    public parse(data: Buffer): void {
        const response = this.buffer + data.toString();
        const lines: string[] = response.split(/\r?\n/);

        if (lines.length - 1 === 0) {
            this.buffer = response;

            return;
        }

        this.buffer = lines[lines.length - 1] || "";

        for (const line of lines.slice(0, lines.length - 1)) {
            this.emit("Response", Response.parse(line));
        }
    }
}
