import { Href } from "./Href";

export type AreaStatus = Href & {
    Level: number;
    OccupancyStatus: string;
    CurrentScene: Href;
};

export class MultipleAreaStatus {
    AreaStatuses!: AreaStatus[];
}

export class OneAreaStatus {
    AreaStatus!: AreaStatus;
}
