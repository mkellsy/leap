import { Message } from "./Message";
import { Response } from "./Response";

export interface InflightMessage {
    message: Message;
    resolve: (message: Response) => void;
    reject: (err: Error) => void;
    timeout: NodeJS.Timeout;
}
