import { Href } from "./Href";

export type ProjectDefinition = Href & {
    Name: string;
    ControlType: string;
    ProductType: string;
    Contacts: Href[];
    TimeclockEventRules: Href;
    ProjectModifiedTimestamp: {
        Year: number;
        Month: number;
        Day: number;
        Hour: number;
        Minute: number;
        Second: number;
        Utc: "string";
    };
};

export class OneProjectDefinition {
    Project!: ProjectDefinition;
}
