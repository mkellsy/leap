import { Category } from "./Category";
import { Href } from "./Href";

export type VirtualButtonDefinition = Href & {
    ButtonNumber: number;
    Category: Category;
    IsProgrammed: boolean;
    Name: string;
    Parent: Href;
    ProgrammingModel: Href;
};

export class MultipleVirtualButtonDefinition {
    VirtualButtons!: VirtualButtonDefinition[];
}

export class OneVirtualButtonDefinition {
    VirtualButton!: VirtualButtonDefinition;
}
