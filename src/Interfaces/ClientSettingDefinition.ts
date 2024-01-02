import { Href } from "./Href";

export type ClientSettingDefinition = Href & {
    ClientMajorVersion: number;
    ClientMinorVersion: number;
    Permissions: {
        SessionRole: string;
    };
};

export class OneClientSettingDefinition {
    ClientSetting!: ClientSettingDefinition;
}
