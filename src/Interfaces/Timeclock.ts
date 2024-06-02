import { Address } from "./Address";

export type Timeclock = Address & {
    Name: string;
    Parent: Address;
};
