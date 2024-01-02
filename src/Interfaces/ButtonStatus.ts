import { Href } from "./Href";

export type ButtonStatus = Href & {
    Button: Href;
    ButtonEvent: { EventType: "Press" | "Release" | "LongHold" };
};

export class OneButtonStatusEvent {
    ButtonStatus!: ButtonStatus;
}
