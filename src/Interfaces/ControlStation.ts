import { Address } from "./Address";
import { Device } from "./Device";

export type ControlStation = Address & {
    Name: string;
    ControlType: string;
    Parent: Address;
    AssociatedArea: Address;
    SortOrder: number;
    AssociatedGangedDevices: Device[];
};
