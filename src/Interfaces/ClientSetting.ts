import { Address } from "./Address";

export type ClientSetting = Address & {
    ClientMajorVersion: number;
    ClientMinorVersion: number;
    Permissions: {
        SessionRole: string;
    };
};
