import { Address } from "./Address";
import { Preset } from "./Preset";
import { Zone } from "./Zone";

export type PresetAssignment = Address & {
    AffectedZone?: Zone;
    Delay?: number;
    Fade?: number;
    Level?: number;
    Name?: string;
    Parent?: Preset;
};
