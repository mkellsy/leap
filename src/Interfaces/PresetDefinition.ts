import { Href } from "./Href";
import { PresetAssignmentDefinition } from "./PresetAssignmentDefinition";

export type PresetDefinition = Href & {
    Name: string;
    Parent: Href;
    ChildPresetAssignment: PresetAssignmentDefinition;
    PresetAssignments: Href[];
    FanSpeedAssignments: Href[];
    TiltAssignments: Href[];
    DimmedLevelAssignments: Href[];
    FavoriteCycleAssignments: Href[];
    NextTrackAssignments: Href[];
    PauseAssignments: Href[];
    PlayPauseToggleAssignments: Href[];
    RaiseLowerAssignments: Href[];
    ShadeLevelAssignments: Href[];
    SonosPlayAssignments: Href[];
    SwitchedLevelAssignments: Href[];
    WhiteTuningLevelAssignments: Href[];
};

export class OnePresetDefinition {
    Preset!: PresetDefinition;
}
