export type DeviceHeard = {
    DiscoveryMechanism: "UserInteraction" | "UnassociatedDeviceDiscovery" | "Unknown";
    SerialNumber: string;
    DeviceType: string;
    ModelNumber: string;
};
