import { Address } from "./Address";

export type Area = Address & {
    Name: string;
    ControlType: string;
    Parent: Address;
    IsLeaf: boolean;
    AssociatedZones: Address[];
    AssociatedControlStations: Address[];
    AssociatedOccupancyGroups: Address[];
};
