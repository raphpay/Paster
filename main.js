const { app, BrowserWindow, ipcMain, clipboard } = require("electron");
const path = require("path");

function createWindow() {
  const win = new BrowserWindow({
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
    win.loadURL("http://localhost:5173");
    win.webContents.openDevTools();
  } else {
    win.loadFile(path.join(__dirname, "../frontend/dist/index.html"));
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

app.on("ready", () => {
  // Perform any necessary setup when the app is ready
});

ipcMain.on("clipboard:copy", (event, text) => {
  clipboard.writeText(text);
});
