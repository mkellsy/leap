import { RequestType } from "./RequestType";

export interface Message {
    CommuniqueType?: RequestType;
    Header: {
        RequestType?: string;
        ClientTag: string;
        Url: string;
    };
    Body?: Record<string, unknown>;
}
