import { Href } from "./Href";
import { ProgrammingModelDefinition } from "./ProgrammingModelDefinition";

export type ButtonDefinition = Href & {
    AssociatedLED: Href;
    ButtonNumber: number;
    Engraving: { Text: string };
    Name: string;
    Parent: Href;
    ProgrammingModel: ProgrammingModelDefinition;
};

export class OneButtonDefinition {
    Button!: ButtonDefinition;
}
