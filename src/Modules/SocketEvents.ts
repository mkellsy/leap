export type SocketEvents = {
    Error: (error: Error) => void;
    Close: () => void;
    Data: (data: Buffer) => void;
    End: () => void;
};
