import { AffectedZone } from "./AffectedZone";
import { ButtonDefinition } from "./ButtonDefinition";
import { DeviceDefinition } from "./DeviceDefinition";
import { Href } from "./Href";

export type ButtonGroupExpandedDefinition = Href & {
    AffectedZones: AffectedZone[];
    Buttons: ButtonDefinition[];
    Parent: DeviceDefinition;
    ProgrammingType: string;
    SortOrder: number;
    StopIfMoving: string;
};

export class MultipleButtonGroupExpandedDefinition {
    ButtonGroupsExpanded!: ButtonGroupExpandedDefinition[];
}
