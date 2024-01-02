import { AdvancedToggleProperties } from "./AdvancedToggleProperties";
import { DualActionProperties } from "./DualActionProperties";
import { Href } from "./Href";
import { ProgrammingModelType } from "./ProgrammingModelType";

export type ProgrammingModelDefinition = Href & {
    AdvancedToggleProperties: AdvancedToggleProperties;
    DualActionProperties: DualActionProperties;
    Name: string;
    Parent: Href;
    Preset: Href;
    ProgrammingModelType: ProgrammingModelType;
};

export class OneProgrammingModelDefinition {
    ProgrammingModel!: ProgrammingModelDefinition;
}
