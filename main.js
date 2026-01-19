const { app, BrowserWindow, ipcMain, clipboard } = require("electron");
const { watch } = require("fs/promises");
const path = require("path");

let mainWindow;
let lastClipboardText = "";
const clipboardHistory = [];

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: __dirname + "/preload.js",
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  const isDev = !app.isPackaged;

  if (isDev) {
    mainWindow.loadURL("http://localhost:5173");
    mainWindow.webContents.openDevTools();
  } else {
    mainWindow.loadFile(path.join(__dirname, "../frontend/dist/index.html"));
  }
}

app.whenReady().then(createWindow);

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

app.on("before-quit", () => {
  // Perform any necessary cleanup before quitting the app
});

app.on("quit", () => {
  // Perform any necessary cleanup before quitting the app
});

app.on("will-quit", () => {
  // Perform any necessary cleanup before quitting the app
});

function watchClipboard() {
  setInterval(() => {
    const text = clipboard.readText();
    if (text && text !== lastClipboardText) {
      lastClipboardText = text;
      let item = {
        id: Date.now(),
        text,
        timestamp: Date.now(),
      };

      mainWindow.webContents.send("clipboard:new-item", item);
    }
  }, 500);
}

app.on("ready", () => {
  watchClipboard();
});

ipcMain.on("clipboard:copy", (event, text) => {
  lastClipboardText = text;
  clipboard.writeText(text);

  const item = {
    id: Date.now(),
    text,
    timestamp: Date.now(),
  };

  clipboardHistory.unshift(item);
  mainWindow.webContents.send("clipboard:new-item", item);
});

ipcMain.handle("clipboard:get-history", () => {
  console.log("history", clipboardHistory);
  return clipboardHistory;
});
