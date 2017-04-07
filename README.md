## Promise interface for the ipc commands in electron.


#### Example
```javascript

// renderer.js
import { ipcRenderer } from 'electron';
import ipc from 'ipc-promises';

const tunnel = new ipc(ipcRenderer);

tunnel.send('getsomedata').then((resp) => {
  // resp contains the data
});

// main.js
import { ipcMain } from 'electron';
import ipc from 'ipc-promises';

const tunnel = new ipc(ipcMain);

tunnel.on('getsomedata').then((id) => {
  mainTunnel.respond(id, 'data not accessible by the renderer');
});

```