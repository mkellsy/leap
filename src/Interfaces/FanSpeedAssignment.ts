import { Address } from "./Address";

export type FanSpeedAssignment = Address & {
    AssignableResource: Address;
    DelayTime: string;
    Parent: Address;
    Speed: string;
};
