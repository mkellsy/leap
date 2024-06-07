import { Address } from "./Address";
import { Preset } from "./Preset";
import { Zone } from "./Zone";

/**
 * Assigns preset assignment types.
 */
export type PresetAssignment = Address & {
    /**
     * Assingned zone address.
     */
    AffectedZone?: Zone;

    /**
     * Action delay time.
     */
    Delay?: number;

    /**
     * Brightness fade time.
     */
    Fade?: number;

    /**
     * Brightness level.
     */
    Level?: number;

    /**
     * Preset name.
     */
    Name?: string;

    /**
     * Parent node address.
     */
    Parent?: Preset;
};
