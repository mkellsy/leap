import { Response } from "./Response";

export interface Subscription {
    url: string;
    listener: (response: any) => void;
    callback: (r: Response) => void;
}
