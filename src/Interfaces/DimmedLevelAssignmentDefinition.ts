import { Href } from "./Href";

export type DimmedLevelAssignmentDefinition = Href & {
    AssignableResource: Href;
    DelayTime: string;
    FadeTime: string;
    Level: number;
    Parent: Href;
};

export class OneDimmedLevelAssignmentDefinition {
    DimmedLevelAssignment!: DimmedLevelAssignmentDefinition;
}
