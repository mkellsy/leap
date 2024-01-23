import { Address } from "./Address";
import { AdvancedToggleProperties } from "./AdvancedToggleProperties";
import { DualActionProperties } from "./DualActionProperties";
import { ProgrammingModelType } from "./ProgrammingModelType";

export type ProgrammingModel = Address & {
    AdvancedToggleProperties: AdvancedToggleProperties;
    DualActionProperties: DualActionProperties;
    Name: string;
    Parent: Address;
    Preset: Address;
    ProgrammingModelType: ProgrammingModelType;
};
