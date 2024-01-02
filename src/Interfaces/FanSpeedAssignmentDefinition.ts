import { Href } from "./Href";

export type FanSpeedAssignmentDefinition = Href & {
    AssignableResource: Href;
    DelayTime: string;
    Parent: Href;
    Speed: string;
};

export class OneFanSpeedAssignmentDefinition {
    FanSpeedAssignment!: FanSpeedAssignmentDefinition;
}
