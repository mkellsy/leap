import { Address } from "./Address";
import { AffectedZone } from "./AffectedZone";
import { Device } from "./Device";

export type ButtonGroup = Address & {
    AffectedZones: AffectedZone[];
    Buttons: Address[];
    Parent: Device;
    ProgrammingType: string;
    SortOrder: number;
    StopIfMoving: string;
};
