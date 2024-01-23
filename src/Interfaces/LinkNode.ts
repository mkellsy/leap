import { Address } from "./Address";

export type LinkNode = Address & {
    Parent: Address;
    LinkType: string;
    SortOrder: number;
    AssociatedLink: Address;
    ClearConnectTypeXLinkProperties: {
        PANID: number;
        ExtendedPANID: string;
        Channel: number;
        NetworkName: string;
        NetworkMasterKey: string;
    };
};
