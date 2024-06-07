import { Address } from "./Address";
import { AffectedZone } from "./AffectedZone";
import { Device } from "./Device";

/**
 * Defines a group of buttons.
 */
export type ButtonGroup = Address & {
    /**
     * Zones assigned to the buttons.
     */
    AffectedZones: AffectedZone[];

    /**
     * List of buttons.
     */
    Buttons: Address[];

    /**
     * Parent node address.
     */
    Parent: Device;

    /**
     * Button group programming type.
     */
    ProgrammingType: string;

    /**
     * Order of group amongst others.
     */
    SortOrder: number;

    /**
     * Special property to stop listening to the button if assicoated zone is
     * in motion.
     */
    StopIfMoving: string;
};
