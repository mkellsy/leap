# LEAP
This library is an implementation of Lutron's LEAP protocol.

This exposes a method to interact with LEAP enabled devices. This requires the client to impliment the system that needs to be intergrated.

## API
```js
import { Conection, Locator, Pairing } from "@mkellsy/leap";

const locator = new Locator();

locator.on("Discovered", (settings) => {
    console.log(`ID: ${settings.id}`);
    console.log(`Address: ${settings.ipAddress}`);
    console.log(`Type: ${settings.systype}`);

    const pairing = new Pairing(settings.ipAddress, 8083);

    pairing.on("Message", (response: any) => {
        if (response.Body.Status.Permissions.includes("PhysicalAccess")) {
            pairing.pair(csr);
        } else {
            console.log("Certificate: ", response);
        }
    });

    pairing.connect();
});

locator.search();
```