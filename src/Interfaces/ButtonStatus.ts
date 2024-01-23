import { Address } from "./Address";

export type ButtonStatus = Address & {
    Button: Address;
    ButtonEvent: { EventType: "Press" | "Release" | "LongHold" };
};
