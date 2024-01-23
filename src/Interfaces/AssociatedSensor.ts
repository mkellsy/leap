import { Address } from "./Address";

export type AssociatedSensor = Address & {
    OccupancySensor: Address;
};
