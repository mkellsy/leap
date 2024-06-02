import { Address } from "./Address";
import { Category } from "./Category";

export type VirtualButton = Address & {
    ButtonNumber: number;
    Category: Category;
    IsProgrammed: boolean;
    Name: string;
    Parent: Address;
    ProgrammingModel: Address;
};
