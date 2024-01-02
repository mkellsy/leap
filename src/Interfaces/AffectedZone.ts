import { ButtonGroupDefinition } from "./ButtonGroupDefinition";
import { Href } from "./Href";
import { Zone } from "./Zone";

export type AffectedZone = Href & {
    ButtonGroup: ButtonGroupDefinition;
    Zone: Zone;
};
