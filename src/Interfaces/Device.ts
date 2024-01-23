import { Address } from "./Address";

export type Device = Address & {
    Name: string;
    Parent: Address;
    SerialNumber: string;
    ModelNumber: string;
    DeviceType: string;
    ButtonGroups: Address[];
    LocalZones: Address[];
    AssociatedArea: Address;
    OccupancySensors: Address[];
    LinkNodes: Address[];
    DeviceRules: Address[];
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
