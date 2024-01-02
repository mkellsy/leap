import { FanSpeedType } from "./FanSpeedType";
import { Href } from "./Href";

export type ZoneStatus = Href & {
    CCOLevel: "Open" | "Closed";
    Level: number;
    SwitchedLevel: "On" | "Off";
    FanSpeed: FanSpeedType;
    Zone: Href;
    StatusAccuracy: "Good";
    AssociatedArea: Href;
    Availability: "Available" | "Unavailable" | "Mixed" | "Unknown";
    Tilt: number;
};

export class MultipleZoneStatus {
    ZoneStatuses!: ZoneStatus[];
}

export class OneZoneStatus {
    ZoneStatus!: ZoneStatus;
}
