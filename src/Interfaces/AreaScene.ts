import { Address } from "./Address";

export type AreaScene = Address & {
    Name: string;
    Parent: Address;
    Preset: Address;
    SortOrder: number;
};
