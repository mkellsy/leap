import { Address } from "./Address";

export type TuningSetting = Address & {
    HighEndTrim: number;
    LowEndTrim: number;
};
