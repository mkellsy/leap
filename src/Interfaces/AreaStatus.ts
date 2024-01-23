import { Address } from "./Address";

export type AreaStatus = Address & {
    Level: number;
    OccupancyStatus: string;
    CurrentScene: Address;
};
