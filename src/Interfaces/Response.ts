import * as Body from "./BodyType";

import { RequestType } from "./RequestType";
import { MessageType } from "./MessageType";
import { ResponseHeader } from "./ResponseHeader";
import { ResponseStatus } from "./ResponseStatus";

export class Response {
    public CommuniqueType?: RequestType;
    public Body?: Body.BodyType;
    public Header: ResponseHeader;

    constructor() {
        this.Header = new ResponseHeader();
    }

    static parse(value: string): Response {
        const payload = JSON.parse(value);
        const status = payload.Header.StatusCode == null ? undefined : ResponseStatus.fromString(payload.Header.StatusCode);

        const header: ResponseHeader = Object.assign({}, payload.Header, {
            StatusCode: status,
            MessageBodyType: payload.Header.MessageBodyType as MessageType,
        });

        return Object.assign(new Response(), payload, {
            Header: header,
            Body: header.MessageBodyType ? Body.parse(header.MessageBodyType, payload.Body) : undefined,
        });
    }
}
