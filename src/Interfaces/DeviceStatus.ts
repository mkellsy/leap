import { DeviceHeard } from "./DeviceHeard";
import { Href } from "./Href";

export type DeviceStatus = Href & {
    DeviceHeard: DeviceHeard;
};

export class OneDeviceStatus {
    DeviceStatus!: DeviceStatus;
}
