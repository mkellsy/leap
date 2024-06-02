import { Area } from "./Area";
import { AreaScene } from "./AreaScene";
import { AreaStatus } from "./AreaStatus";
import { Authentication } from "./Authentication";
import { Button } from "./Button";
import { ButtonGroup } from "./ButtonGroup";
import { ButtonGroupExpanded } from "./ButtonGroupExpanded";
import { ButtonStatus } from "./ButtonStatus";
import { ClientSetting } from "./ClientSetting";
import { ControlStation } from "./ControlStation";
import { Device } from "./Device";
import { DeviceStatus } from "./DeviceStatus";
import { DimmedLevelAssignment } from "./DimmedLevelAssignment";
import { ExceptionDetail } from "./ExceptionDetail";
import { FanSpeedAssignment } from "./FanSpeedAssignment";
import { LinkNode } from "./LinkNode";
import { OccupancyGroup } from "./OccupancyGroup";
import { OccupancyGroupStatus } from "./OccupancyGroupStatus";
import { PhysicalAccess } from "./PhysicalAccess";
import { PingResponse } from "./PingResponse";
import { Preset } from "./Preset";
import { PresetAssignment } from "./PresetAssignment";
import { ProgrammingModel } from "./ProgrammingModel";
import { Project } from "./Project";
import { TiltAssignment } from "./TiltAssignment";
import { Timeclock } from "./Timeclock";
import { VirtualButton } from "./VirtualButton";
import { Zone } from "./Zone";
import { ZoneStatus } from "./ZoneStatus";

export type BodyType =
    | Area
    | Area[]
    | AreaScene
    | AreaScene[]
    | AreaStatus
    | AreaStatus[]
    | Authentication
    | Button
    | Button[]
    | ButtonGroup
    | ButtonGroup[]
    | ButtonGroupExpanded
    | ButtonGroupExpanded[]
    | ButtonStatus
    | ButtonStatus[]
    | ClientSetting
    | ClientSetting[]
    | ControlStation
    | ControlStation[]
    | Device
    | Device[]
    | DeviceStatus
    | DeviceStatus[]
    | DimmedLevelAssignment
    | DimmedLevelAssignment[]
    | ExceptionDetail
    | ExceptionDetail[]
    | FanSpeedAssignment
    | FanSpeedAssignment[]
    | LinkNode
    | LinkNode[]
    | OccupancyGroup
    | OccupancyGroup[]
    | OccupancyGroupStatus
    | OccupancyGroupStatus[]
    | PhysicalAccess
    | PingResponse
    | PingResponse[]
    | Preset
    | Preset[]
    | PresetAssignment
    | PresetAssignment[]
    | ProgrammingModel
    | ProgrammingModel[]
    | Project
    | Project[]
    | TiltAssignment
    | TiltAssignment[]
    | Timeclock
    | Timeclock[]
    | VirtualButton
    | VirtualButton[]
    | Zone
    | Zone[]
    | ZoneStatus
    | ZoneStatus[];
