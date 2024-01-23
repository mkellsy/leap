import { Address } from "./Address";
import { AssociatedArea } from "./AssociatedArea";
import { AssociatedSensor } from "./AssociatedSensor";

export type OccupancyGroup = Address & {
    AssociatedAreas?: AssociatedArea[];
    AssociatedSensors?: AssociatedSensor[];
    ProgrammingModel?: Address;
    ProgrammingType?: string;
    OccupiedActionSchedule?: { ScheduleType: string }; // nfi
    UnoccupiedActionSchedule?: { ScheduleType: string }; // also nfi
};
