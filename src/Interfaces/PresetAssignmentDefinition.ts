import { Href } from "./Href";
import { PresetDefinition } from "./PresetDefinition";
import { Zone } from "./Zone";

export type PresetAssignmentDefinition = Href & {
    AffectedZone?: Zone;
    Delay?: number;
    Fade?: number;
    Level?: number;
    Name?: string;
    Parent?: PresetDefinition;
};

export class OnePresetAssignmentDefinition {
    PresetAssignment!: PresetAssignmentDefinition;
}
