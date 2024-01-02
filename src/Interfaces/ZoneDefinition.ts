import { Category } from "./Category";
import { Href } from "./Href";

export type ZoneDefinition = Href & {
    Name: string;
    ControlType: string;
    Category: Category;
    Device: Href;
    AssociatedFacade: Href;
};

export class MultipleZoneDefinition {
    Zones: ZoneDefinition[] = [];
}

export class OneZoneDefinition {
    Zone!: ZoneDefinition;
}
