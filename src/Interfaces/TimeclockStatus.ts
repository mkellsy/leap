import { Address } from "./Address";

export type TimeclockStatus = Address & {
    Timeclock: Address;
    EnabledState: string;
};
