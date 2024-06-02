import { Address } from "./Address";
import { AffectedZone } from "./AffectedZone";
import { Button } from "./Button";
import { Device } from "./Device";

export type ButtonGroupExpanded = Address & {
    AffectedZones: AffectedZone[];
    Buttons: Button[];
    Parent: Device;
    ProgrammingType: string;
    SortOrder: number;
    StopIfMoving: string;
};
