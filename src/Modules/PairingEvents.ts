export type PairingEvents = {
    Message: (response: object) => void;
    Disconnected: () => void;
    Error: (error: Error) => void;
};
