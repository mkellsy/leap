import { Address } from "./Address";
import { ButtonGroup } from "./ButtonGroup";
import { Zone } from "./Zone";

export type AffectedZone = Address & {
    ButtonGroup: ButtonGroup;
    Zone: Zone;
};
