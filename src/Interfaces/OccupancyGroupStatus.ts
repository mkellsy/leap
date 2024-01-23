import { Address } from "./Address";
import { OccupancyGroup } from "./OccupancyGroup";
import { OccupancyStatus } from "./OccupancyStatus";

export type OccupancyGroupStatus = Address & {
    OccupancyGroup: OccupancyGroup;
    OccupancyStatus: OccupancyStatus;
};
