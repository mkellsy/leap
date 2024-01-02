import { AffectedZone } from "./AffectedZone";
import { DeviceDefinition } from "./DeviceDefinition";
import { Href } from "./Href";

export type ButtonGroupDefinition = Href & {
    AffectedZones: AffectedZone[];
    Buttons: Href[];
    Parent: DeviceDefinition;
    ProgrammingType: string;
    SortOrder: number;
    StopIfMoving: string;
};

export class MultipleButtonGroupDefinition {
    ButtonGroups!: ButtonGroupDefinition[];
}

export class OneButtonGroupDefinition {
    ButtonGroup!: ButtonGroupDefinition;
}
