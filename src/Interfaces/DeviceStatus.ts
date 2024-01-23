import { Address } from "./Address";
import { DeviceHeard } from "./DeviceHeard";

export type DeviceStatus = Address & {
    DeviceHeard: DeviceHeard;
};
