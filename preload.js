const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("electron", {
  copyText: (text) => ipcRenderer.send("clipboard:copy", text),
  closePanel: () => ipcRenderer.send("panel:close"),
  getClipboardHistory: () => ipcRenderer.invoke("clipboard:get-history"),
  onClipboardNewItem: (callback) => {
    const subscription = (_, item) => callback(item);
    ipcRenderer.on("clipboard:new-item", subscription);
    return () => ipcRenderer.removeListener("clipboard:new-item", subscription);
  },
});
