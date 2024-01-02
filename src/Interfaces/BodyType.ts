import { OneProjectDefinition } from "./ProjectDefinition";
import { OnePresetDefinition } from "./PresetDefinition";
import { OneAreaSceneDefinition } from "./AreaSceneDefinition";
import { OneLinkDefinition, OneLinkNodeDefinition, MultipleLinkNodeDefinition, MultipleLinkDefinition } from "./LinkNodeDefinition";
import { OneZoneDefinition, MultipleZoneDefinition } from "./ZoneDefinition";
import { OneAreaDefinition, MultipleAreaDefinition } from "./AreaDefinition";
import { OneControlStationDefinition, MultipleControlStationDefinition } from "./ControlStationDefinition";
import { OneAreaStatus, MultipleAreaStatus } from "./AreaStatus";
import { OneDeviceStatus } from "./DeviceStatus";
import { OneDeviceDefinition, MultipleDeviceDefinition } from "./DeviceDefinition";
import { OneZoneStatus, MultipleZoneStatus } from "./ZoneStatus";
import { OnePingResponse } from "./PingResponseDefinition";
import { MultipleButtonGroupDefinition, OneButtonGroupDefinition } from "./ButtonGroupDefinition";
import { MultipleButtonGroupExpandedDefinition } from "./ButtonGroupExpandedDefinition";
import { OneButtonDefinition } from "./ButtonDefinition";
import { OneButtonStatusEvent } from "./ButtonStatus";
import { MultipleOccupancyGroupStatus } from "./OccupancyGroupStatus";
import { OccupancyGroupDefinition, OneOccupancyGroupDefinition } from "./OccupancyGroupDefinition";
import { OneClientSettingDefinition } from "./ClientSettingDefinition";
import { MultipleVirtualButtonDefinition, OneVirtualButtonDefinition } from "./VirtualButtonDefinition";
import { OneProgrammingModelDefinition } from "./ProgrammingModelDefinition";
import { OnePresetAssignmentDefinition } from "./PresetAssignmentDefinition";
import { OneDimmedLevelAssignmentDefinition } from "./DimmedLevelAssignmentDefinition";
import { OneFanSpeedAssignmentDefinition } from "./FanSpeedAssignmentDefinition";
import { OneTiltAssignmentDefinition } from "./TiltAssignmentDefinition";
import { ExceptionDetail } from "./ExceptionDetail";
import { MessageType } from "./MessageType";

export type BodyType =
    | OneProjectDefinition
    | OnePresetDefinition
    | OneAreaSceneDefinition
    | OneLinkDefinition
    | OneLinkNodeDefinition
    | MultipleLinkNodeDefinition
    | MultipleLinkDefinition
    | OneZoneDefinition
    | MultipleZoneDefinition
    | OneAreaDefinition
    | MultipleAreaDefinition
    | OneControlStationDefinition
    | MultipleControlStationDefinition
    | OneAreaStatus
    | MultipleAreaStatus
    | OneDeviceStatus
    | OneDeviceDefinition
    | MultipleDeviceDefinition
    | OneZoneStatus
    | MultipleZoneStatus
    | OnePingResponse
    | OneButtonGroupDefinition
    | MultipleButtonGroupDefinition
    | MultipleButtonGroupExpandedDefinition
    | OneButtonDefinition
    | OneButtonStatusEvent
    | MultipleOccupancyGroupStatus
    | OccupancyGroupDefinition
    | OneOccupancyGroupDefinition
    | OneClientSettingDefinition
    | MultipleVirtualButtonDefinition
    | OneVirtualButtonDefinition
    | OneProgrammingModelDefinition
    | OnePresetAssignmentDefinition
    | OneDimmedLevelAssignmentDefinition
    | OneFanSpeedAssignmentDefinition
    | OneTiltAssignmentDefinition
    | ExceptionDetail;

export function parse(type: MessageType, data: object): BodyType {
    switch (type) {
        case "OneDeviceDefinition":
            return Object.assign(new OneDeviceDefinition(), data);

        case "OnePresetDefinition":
            return Object.assign(new OnePresetDefinition(), data);

        case "OneAreaSceneDefinition":
            return Object.assign(new OneAreaSceneDefinition(), data);

        case "MultipleAreaDefinition":
            return Object.assign(new MultipleAreaDefinition(), data);

        case "MultipleDeviceDefinition":
            return Object.assign(new MultipleDeviceDefinition(), data);

        case "ExceptionDetail":
            return Object.assign(new ExceptionDetail(), data);

        case "OneZoneStatus":
            return Object.assign(new OneZoneStatus(), data);

        case "MultipleZoneStatus":
            return Object.assign(new MultipleZoneStatus(), data);

        case "OnePingResponse":
            return Object.assign(new OnePingResponse(), data);

        case "OneButtonGroupDefinition":
            return Object.assign(new OneButtonGroupDefinition(), data);

        case "MultipleButtonGroupDefinition":
            return Object.assign(new MultipleButtonGroupDefinition(), data);

        case "MultipleButtonGroupExpandedDefinition":
            return Object.assign(new MultipleButtonGroupExpandedDefinition(), data);

        case "OneButtonDefinition":
            return Object.assign(new OneButtonDefinition(), data);

        case "OneButtonStatusEvent":
            return Object.assign(new OneButtonStatusEvent(), data);

        case "OneDeviceStatus":
            return Object.assign(new OneDeviceStatus(), data);

        case "OneZoneDefinition":
            return Object.assign(new OneZoneDefinition(), data);

        case "MultipleZoneDefinition":
            return Object.assign(new MultipleZoneDefinition(), data);

        case "OneAreaDefinition":
            return Object.assign(new OneAreaDefinition(), data);

        case "OneAreaStatus":
            return Object.assign(new OneAreaStatus(), data);

        case "MultipleAreaStatus":
            return Object.assign(new MultipleAreaStatus(), data);

        case "OneControlStationDefinition":
            return Object.assign(new OneControlStationDefinition(), data);

        case "MultipleControlStationDefinition":
            return Object.assign(new MultipleControlStationDefinition(), data);

        case "OneProjectDefinition":
            return Object.assign(new OneProjectDefinition(), data);

        case "OneLinkDefinition":
            return Object.assign(new OneLinkDefinition(), data);

        case "OneLinkNodeDefinition":
            return Object.assign(new OneLinkNodeDefinition(), data);

        case "MultipleLinkNodeDefinition":
            return Object.assign(new MultipleLinkNodeDefinition(), data);

        case "MultipleLinkDefinition":
            return Object.assign(new MultipleLinkDefinition(), data);

        case "MultipleOccupancyGroupStatus":
            return Object.assign(new MultipleOccupancyGroupStatus(), data);

        case "OneOccupancyGroupDefinition":
            return Object.assign(new OneOccupancyGroupDefinition(), data);

        case "OneClientSettingDefinition":
            return Object.assign(new OneClientSettingDefinition(), data);

        case "MultipleVirtualButtonDefinition":
            return Object.assign(new MultipleVirtualButtonDefinition(), data);

        case "OneVirtualButtonDefinition":
            return Object.assign(new OneVirtualButtonDefinition(), data);

        case "OneProgrammingModelDefinition":
            return Object.assign(new OneProgrammingModelDefinition(), data);

        case "OnePresetAssignmentDefinition":
            return Object.assign(new OnePresetAssignmentDefinition(), data);

        case "OneDimmedLevelAssignmentDefinition":
            return Object.assign(new OneDimmedLevelAssignmentDefinition(), data);

        case "OneFanSpeedAssignmentDefinition":
            return Object.assign(new OneFanSpeedAssignmentDefinition(), data);

        case "OneTiltAssignmentDefinition":
            return Object.assign(new OneTiltAssignmentDefinition(), data);

        default:
            throw new Error(`Type not implemented ${type}`);
    }
}
