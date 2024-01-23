import { Address } from "./Address";

export type TiltAssignment = Address & {
    Parent: Address;
    AssignableResource: Address;
    DelayTime: string;
    Tilt: number;
};
