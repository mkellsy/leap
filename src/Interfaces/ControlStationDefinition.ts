import { Href } from "./Href";
import { OneDeviceDefinition } from "./DeviceDefinition";

export type ControlStationDefinition = Href & {
    Name: string;
    ControlType: string;
    Parent: Href;
    AssociatedArea: Href;
    SortOrder: number;
    AssociatedGangedDevices: OneDeviceDefinition[];
};

export class MultipleControlStationDefinition {
    ControlStations!: ControlStationDefinition[];
}

export class OneControlStationDefinition {
    ControlStation!: ControlStationDefinition;
}
