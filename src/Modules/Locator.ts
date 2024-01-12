import { EventEmitter } from "@mkellsy/event-emitter";
import { Address6 } from "ip-address";
import { Protocol, MDNSServiceDiscovery, MDNSService } from "tinkerhub-mdns";

import { LocatorEvents } from "./LocatorEvents";

export class Locator extends EventEmitter<LocatorEvents> {
    public search(): void {
        const discovery = new MDNSServiceDiscovery({
            type: "lutron",
            protocol: Protocol.TCP,
        });

        discovery.onAvailable(this.onAvailable(discovery));
    }

    private onAvailable(discovery: MDNSServiceDiscovery): (service: MDNSService) => void {
        return (service: MDNSService) => {
            const systype = service.data.get("systype");

            if (typeof systype === "boolean") {
                this.emit("Error", Error(`invalid system type ${systype}`));

                return;
            }

            const address = this.parseAddresses(service.addresses);

            if (address == null) {
                this.emit("Error", Error("no processor available"));

                return;
            }

            // @ts-ignore
            const target: string = discovery.serviceData.get(service.id).SRV._record.target;
            const match = target.match(/[Ll]utron-(?<id>\w+)\.local/);

            if (match == null || match.groups == null || match.groups.id == null) {
                this.emit("Error", Error("invalid service discovery"));

                return;
            }

            this.emit("Discovered", {
                id: match.groups.id.toUpperCase(),
                ipAddress: address,
                systype: systype,
            });
        };
    }

    private parseAddresses(addresses: ({ host: string; port: number })[]): string | undefined {
        for (const address of addresses) {
            if (/^([\da-f]{1,4}:){7}[\da-f]{1,4}$/i.test(address.host)) {
                const link = new Address6(address.host);

                if (!link.isLinkLocal() && !link.isLoopback()) {
                    return address.host;
                }
            } else {
                return address.host;
            }
        }

        return undefined;
    }
}
