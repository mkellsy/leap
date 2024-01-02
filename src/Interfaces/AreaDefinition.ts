import { Href } from "./Href";

export type AreaDefinition = Href & {
    Name: string;
    ControlType: string;
    Parent: Href;
    IsLeaf: boolean;
    AssociatedZones: Href[];
    AssociatedControlStations: Href[];
    AssociatedOccupancyGroups: Href[];
};

export class MultipleAreaDefinition {
    Areas: AreaDefinition[] = [];
}

export class OneAreaDefinition {
    Area!: AreaDefinition;
}
