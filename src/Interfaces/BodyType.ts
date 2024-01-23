import { Project } from "./Project";
import { Preset } from "./Preset";
import { AreaScene } from "./AreaScene";
import { LinkNode } from "./LinkNode";
import { Zone } from "./Zone";
import { Area } from "./Area";
import { ControlStation } from "./ControlStation";
import { AreaStatus } from "./AreaStatus";
import { DeviceStatus } from "./DeviceStatus";
import { Device } from "./Device";
import { ZoneStatus } from "./ZoneStatus";
import { PingResponse } from "./PingResponse";
import { ButtonGroup } from "./ButtonGroup";
import { ButtonGroupExpanded } from "./ButtonGroupExpanded";
import { Button } from "./Button";
import { ButtonStatus } from "./ButtonStatus";
import { OccupancyGroupStatus } from "./OccupancyGroupStatus";
import { OccupancyGroup } from "./OccupancyGroup";
import { ClientSetting } from "./ClientSetting";
import { VirtualButton } from "./VirtualButton";
import { ProgrammingModel } from "./ProgrammingModel";
import { PresetAssignment } from "./PresetAssignment";
import { DimmedLevelAssignment } from "./DimmedLevelAssignment";
import { FanSpeedAssignment } from "./FanSpeedAssignment";
import { TiltAssignment } from "./TiltAssignment";
import { ExceptionDetail } from "./ExceptionDetail";

export type BodyType =
    | Project
    | Project[]
    | Preset
    | Preset[]
    | AreaScene
    | AreaScene[]
    | LinkNode
    | LinkNode[]
    | Zone
    | Zone[]
    | Area
    | Area[]
    | ControlStation
    | ControlStation[]
    | AreaStatus
    | AreaStatus[]
    | DeviceStatus
    | DeviceStatus[]
    | Device
    | Device[]
    | ZoneStatus
    | ZoneStatus[]
    | PingResponse
    | PingResponse[]
    | ButtonGroup
    | ButtonGroup[]
    | ButtonGroupExpanded
    | ButtonGroupExpanded[]
    | Button
    | Button[]
    | ButtonStatus
    | ButtonStatus[]
    | OccupancyGroupStatus
    | OccupancyGroupStatus[]
    | OccupancyGroup
    | OccupancyGroup[]
    | ClientSetting
    | ClientSetting[]
    | VirtualButton
    | VirtualButton[]
    | ProgrammingModel
    | ProgrammingModel[]
    | PresetAssignment
    | PresetAssignment[]
    | DimmedLevelAssignment
    | DimmedLevelAssignment[]
    | FanSpeedAssignment
    | FanSpeedAssignment[]
    | TiltAssignment
    | TiltAssignment[]
    | ExceptionDetail
    | ExceptionDetail[];
