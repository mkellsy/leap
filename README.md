# LEAP

Implementation of Lutron's LEAP protocol for TypeScript.

This exposes a method to interact with LEAP enabled devices. This requires the client to impliment the system that needs to be intergrated.

## API

Pairing a processor or bridge.

```js
import { Connection } from "@mkellsy/leap";

const connection = new Connection("192.168.123.5");

connection.connect().then(() => {
    connection.authenticate(request).then((certificate) => {
        // certificate can be used to make a secure connection
    });
});
```

Connect to the processor (using the certificate from pairing)

```js
import { Connection } from "@mkellsy/leap";

const connection = new Connection("192.168.123.5", certificate);
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
