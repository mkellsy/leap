import { AssociatedArea } from "./AssociatedArea";
import { AssociatedSensor } from "./AssociatedSensor";
import { Href } from "./Href";

export type OccupancyGroupDefinition = Href & {
    AssociatedAreas?: AssociatedArea[];
    AssociatedSensors?: AssociatedSensor[];
    ProgrammingModel?: Href;
    ProgrammingType?: string;
    OccupiedActionSchedule?: { ScheduleType: string }; // nfi
    UnoccupiedActionSchedule?: { ScheduleType: string }; // also nfi
};

export class OneOccupancyGroupDefinition {
    OccupancyGroup!: OccupancyGroupDefinition;
}
