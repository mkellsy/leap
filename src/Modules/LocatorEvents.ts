import { NetworkSettings } from "../Interfaces/NetworkSettings";

export type LocatorEvents = {
    Discovered: (networkSettings: NetworkSettings) => void;
    Error: (error: Error) => void;
};
