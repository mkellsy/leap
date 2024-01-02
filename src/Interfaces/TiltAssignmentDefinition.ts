import { Href } from "./Href";

export type TiltAssignmentDefinition = Href & {
    Parent: Href;
    AssignableResource: Href;
    DelayTime: string;
    Tilt: number;
};

export class OneTiltAssignmentDefinition {
    TiltAssignment!: TiltAssignmentDefinition;
}
