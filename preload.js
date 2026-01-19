const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("electron", {
  copyText: (text) => ipcRenderer.send("clipboard:copy", text),
  closePanel: () => ipcRenderer.send("panel:close"),
});
