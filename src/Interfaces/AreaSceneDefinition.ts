import { Href } from "./Href";

export type AreaSceneDefinition = Href & {
    Name: string;
    Parent: Href;
    Preset: Href;
    SortOrder: number;
};

export class OneAreaSceneDefinition {
    AreaScene!: AreaSceneDefinition;
}
