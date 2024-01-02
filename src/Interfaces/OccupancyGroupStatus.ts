import { Href } from "./Href";
import { OccupancyGroupDefinition } from "./OccupancyGroupDefinition";
import { OccupancyStatus } from "./OccupancyStatus";

export type OccupancyGroupStatus = Href & {
    OccupancyGroup: OccupancyGroupDefinition;
    OccupancyStatus: OccupancyStatus;
};

export class MultipleOccupancyGroupStatus {
    OccupancyGroupStatuses!: OccupancyGroupStatus[];
}
