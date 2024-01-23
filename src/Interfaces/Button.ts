import { Address } from "./Address";
import { ProgrammingModel } from "./ProgrammingModel";

export type Button = Address & {
    AssociatedLED: Address;
    ButtonNumber: number;
    Engraving: { Text: string };
    Name: string;
    Parent: Address;
    ProgrammingModel: ProgrammingModel;
};
