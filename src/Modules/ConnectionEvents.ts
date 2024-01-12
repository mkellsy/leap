import { Response } from "../Interfaces/Response";

export type ConnectionEvents = {
    Disconnected: () => void;
    Response: (response: Response) => void;
    Unsolicited: (response: Response) => void;
};
