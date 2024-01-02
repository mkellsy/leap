import { Href } from "./Href";

export type LinkNodeDefinition = Href & {
    Parent: Href;
    LinkType: string;
    SortOrder: number;
    AssociatedLink: Href;
    ClearConnectTypeXLinkProperties: {
        PANID: number;
        ExtendedPANID: string;
        Channel: number;
        NetworkName: string;
        NetworkMasterKey: string;
    };
};

export class MultipleLinkNodeDefinition {
    Links!: LinkNodeDefinition[];
}

export class MultipleLinkDefinition {
    Links!: LinkNodeDefinition[];
}

export class OneLinkNodeDefinition {
    LinkNode!: LinkNodeDefinition;
}

export class OneLinkDefinition {
    LinkNode!: LinkNodeDefinition;
}
