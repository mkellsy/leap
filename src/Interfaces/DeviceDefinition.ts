import { Href } from "./Href";

export type DeviceDefinition = Href & {
    Name: string;
    Parent: Href;
    SerialNumber: string;
    ModelNumber: string;
    DeviceType: string;
    ButtonGroups: Href[];
    LocalZones: Href[];
    AssociatedArea: Href;
    OccupancySensors: Href[];
    LinkNodes: Href[];
    DeviceRules: Href[];
    RepeaterProperties: {
        IsRepeater: boolean;
    };
    FirmwareImage: {
        Firmware: {
            DisplayName: string;
        };
        Installed: {
            Year: number;
            Month: number;
            Day: number;
            Hour: number;
            Minute: number;
            Second: number;
            Utc: string;
        };
    };
    AddressedState?: "Addressed" | "Unaddressed" | "Unknown";
    IsThisDevice?: boolean;
};

export class MultipleDeviceDefinition {
    Devices: DeviceDefinition[] = [];
}

export class OneDeviceDefinition {
    Device!: DeviceDefinition;
}
