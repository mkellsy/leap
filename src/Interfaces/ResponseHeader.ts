import { MessageType } from "./MessageType";
import { ResponseStatus } from "./ResponseStatus";

export class ResponseHeader {
    public StatusCode?: ResponseStatus;
    public Url?: string;
    public MessageBodyType?: MessageType;
    public ClientTag?: string;
}
