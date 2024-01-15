import { Response } from "../Interfaces/Response";

export type ConnectionEvents = {
    Disconnected: () => void;
    Response: (response: Response) => void;
    Message: (response: Response) => void;
    Error: (error: Error) => void;
};
