const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("electron", {
  // Renderer to main
  copyText: (text) => ipcRenderer.send("clipboard:copy", text),
  closePanel: () => ipcRenderer.send("panel:close"),
  openSettings: () => ipcRenderer.send("permissions:open-settings"),
  saveHistory: (data) => ipcRenderer.send("store:save-history", data),
  clearHistory: () => ipcRenderer.send("store:clear-history"),
  deleteHistory: (id) => ipcRenderer.send("store:delete-history", id),
  deleteAllHistory: () => ipcRenderer.send("store:delete-all-history"),
  // Main to renderer ( Two-way)
  checkPermissions: () => ipcRenderer.invoke("permissions:check"),
  hideWindow: () => ipcRenderer.invoke("window:hide"),
  loadHistory: () => ipcRenderer.invoke("store:load-history"),
  // Event Listeners (Main to Renderer)
  onClipboardNewItem: (callback) => {
    const subscription = (_, item) => callback(item);
    ipcRenderer.on("clipboard:new-item", subscription);
    return () => ipcRenderer.removeListener("clipboard:new-item", subscription);
  },
});
