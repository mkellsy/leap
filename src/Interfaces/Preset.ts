import { Address } from "./Address";
import { PresetAssignment } from "./PresetAssignment";

export type Preset = Address & {
    Name: string;
    Parent: Address;
    ChildPresetAssignment: PresetAssignment;
    PresetAssignments: Address[];
    FanSpeedAssignments: Address[];
    TiltAssignments: Address[];
    DimmedLevelAssignments: Address[];
    FavoriteCycleAssignments: Address[];
    NextTrackAssignments: Address[];
    PauseAssignments: Address[];
    PlayPauseToggleAssignments: Address[];
    RaiseLowerAssignments: Address[];
    ShadeLevelAssignments: Address[];
    SonosPlayAssignments: Address[];
    SwitchedLevelAssignments: Address[];
    WhiteTuningLevelAssignments: Address[];
};
