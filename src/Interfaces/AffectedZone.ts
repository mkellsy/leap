import { Address } from "./Address";
import { ButtonGroup } from "./ButtonGroup";
import { Zone } from "./Zone";

/**
 * List of zones assigned to a button group.
 */
export type AffectedZone = Address & {
    /**
     * Button group.
     */
    ButtonGroup: ButtonGroup;

    /**
     * Assigned zone.
     */
    Zone: Zone;
};
