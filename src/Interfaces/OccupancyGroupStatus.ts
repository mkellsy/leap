import { Address } from "./Address";
import { OccupancyGroup } from "./OccupancyGroup";
import { OccupancyStatus } from "./OccupancyStatus";

/**
 * Occupancy sensor status response.
 */
export type OccupancyGroupStatus = Address & {
    /**
     * Sensor group.
     */
    OccupancyGroup: OccupancyGroup;

    /**
     * Sensor status.
     */
    OccupancyStatus: OccupancyStatus;
};
