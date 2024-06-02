import { Address } from "./Address";

export type DimmedLevelAssignment = Address & {
    AssignableResource: Address;
    DelayTime: string;
    FadeTime: string;
    Level: number;
    Parent: Address;
};
