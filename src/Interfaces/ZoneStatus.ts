import { Address } from "./Address";
import { FanSpeedType } from "./FanSpeedType";

export type ZoneStatus = Address & {
    CCOLevel: "Open" | "Closed";
    Level: number;
    SwitchedLevel: "On" | "Off";
    FanSpeed: FanSpeedType;
    Zone: Address;
    StatusAccuracy: "Good";
    AssociatedArea: Address;
    Availability: "Available" | "Unavailable" | "Mixed" | "Unknown";
    Tilt: number;
};
