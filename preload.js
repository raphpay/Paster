const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("electron", {
  // Renderer to main
  copyText: (text) => ipcRenderer.send("clipboard:copy", text),
  closePanel: () => ipcRenderer.send("panel:close"),
  openSettings: () => ipcRenderer.send("permissions:open-settings"),
  // Main to renderer
  getClipboardHistory: () => ipcRenderer.invoke("clipboard:get-history"),
  checkPermissions: () => ipcRenderer.invoke("permissions:check"),
  hideWindow: () => ipcRenderer.invoke("window:hide"),
  // ??
  onClipboardNewItem: (callback) => {
    const subscription = (_, item) => callback(item);
    ipcRenderer.on("clipboard:new-item", subscription);
    return () => ipcRenderer.removeListener("clipboard:new-item", subscription);
  },
});
