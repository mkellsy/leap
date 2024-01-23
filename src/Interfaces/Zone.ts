import { Address } from "./Address";
import { Category } from "./Category";
import { PhaseSetting } from "./PhaseSetting";
import { TuningSetting } from "./TuningSetting";

export type Zone = Address & {
    Name: string;
    ControlType: string;
    Category?: Category;
    Device?: Address;
    AssociatedFacade?: Address;
    AssociatedArea?: Address;
    PhaseSettings?: PhaseSetting;
    SortOrder?: number;
    TuningSettings?: TuningSetting;
};
