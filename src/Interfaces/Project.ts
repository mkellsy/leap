import { Address } from "./Address";

export type Project = Address & {
    Name: string;
    ControlType: string;
    ProductType: string;
    Contacts: Address[];
    TimeclockEventRules: Address;
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
