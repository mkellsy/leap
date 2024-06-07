import { Address } from "./Address";

/**
 * Defines a timeclock.
 */
export type Timeclock = Address & {
    /**
     * Timeclock name.
     */
    Name: string;

    /**
     * Parent node address.
     */
    Parent: Address;
};
