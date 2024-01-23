# LEAP
Implementation of Lutron's LEAP protocol for TypeScript.

This exposes a method to interact with LEAP enabled devices. This requires the client to impliment the system that needs to be intergrated.

## API
Pairing a processor or bridge.
```js
import { createSecureContext } from "tls";
import { Pairing } from "@mkellsy/leap";

const pairing = new Pairing(
    "192.168.123.5",
    8083,
    createSecureContext({ ca, key, cert })
);

pairing.once("Message", (response: Record<string, any>) => {
    if (response.Body.Status.Permissions.includes("PhysicalAccess")) {
        // physical access gained
    } else {
        // no physical access
    }
});

await pairing.connect();
```

Fetch access keys (after physical access)
```js
this.pairing.once("Message", (response: Record<string, any>) => {
    /*
    ca: response.Body.SigningResult.RootCertificate,
    cert: response.Body.SigningResult.Certificate,
    key: pki.privateKeyToPem(csr.key),
    */
});

this.pairing.pair(csr.cert);
```

Connect to the processor (using the certificate from pairing)
```js
import { createSecureContext } from "tls";
import { Connection } from "@mkellsy/leap";

const connection = new Connection(
    "192.168.123.5",
    8081,
    createSecureContext({ ca, key, cert })
);
```

Making a request
```js
import { Area } from "@mkellsy/leap";

const areas = await connection.read<Area[]>("/area");

for (const area of areas) {
    // area logic
}
```

Ping
```
/server/1/status/ping
```

Project
```
/project
```

System Information
```
/device?where=IsThisDevice:true
```

Areas
```
/area
```

Zones
```
/zone/[id]/associatedzone
```

Zone Status
```
/zone/[id]/status
```

Area Controls
```
/area/[id]/associatedcontrolstation
```

Area Control
```
/device/[id]
```

Area Control Buttons
```
/device/[id]/buttongroup/expanded
```

Execute Command
```
/zone/[id]/commandprocessor
```

Subscribe
```
/button/[id]/status/event
```
