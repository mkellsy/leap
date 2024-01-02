import { Href } from "./Href";
import { PhaseSetting } from "./PhaseSetting";
import { TuningSetting } from "./TuningSetting";

export type Zone = Href & {
    AssociatedArea: Href;
    ControlType: string;
    Name: string;
    PhaseSettings: PhaseSetting;
    SortOrder: number;
    TuningSettings: TuningSetting;
};
