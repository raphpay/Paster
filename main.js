const {
  app,
  BrowserWindow,
  ipcMain,
  clipboard,
  shell,
  screen,
  globalShortcut,
} = require("electron/main");
const path = require("path");
const { activeWindow, screenRecordingPermission } = require("get-windows");

// --- Configuration & State ---
let mainWindow;
let lastClipboardText = clipboard.readText();
let pollingInterval;

// --- Window Management ---
function createWindow() {
  const primaryDisplay = screen.getPrimaryDisplay();
  const { width, height } = primaryDisplay.workAreaSize;

  mainWindow = new BrowserWindow({
    width: width,
    height: 350,
    x: 0,
    y: height,
    frame: false, // Add frame: false to remove the default frame ( removes the title bar and border )
    transparent: true,
    alwaysOnTop: true,
    skipTaskbar: true,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"), // Use path.join for reliability
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

// --- Logic: Clipboard Tracking ---
async function checkClipboard() {
  try {
    const text = clipboard.readText();

    // Only proceed if text has changed and isn't empty
    if (text && text !== lastClipboardText) {
      lastClipboardText = text;

      // Get metadata (App Name)
      const windowInfo = await activeWindow();

      const item = {
        id: Date.now(),
        text,
        timestamp: new Date().toISOString(),
        sourceApp: windowInfo?.owner?.name ?? "Unknown",
      };

      // Send to Frontend
      if (mainWindow && !mainWindow.isDestroyed()) {
        mainWindow.webContents.send("clipboard:new-item", item);
      }
    }
  } catch (err) {
    console.error("Clipboard Monitoring Error:", err);
  }
}

// --- App Lifecycle ---
app.whenReady().then(() => {
  createWindow();

  // Start polling every 1 second (Balanced for performance vs reactivity)
  pollingInterval = setInterval(checkClipboard, 1000);

  // Register the keyboard shortcut to open/hide the window
  globalShortcut.register("CommandOrControl+Shift+V", () => {
    if (mainWindow && !mainWindow.isDestroyed()) {
      if (mainWindow.isVisible()) {
        mainWindow.hide();
      } else {
        mainWindow.show();
      }
    }
  });

  // Register handles
  ipcMain.handle("window:hide", handleWindowHide);
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});

app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) createWindow();
});

app.on("will-quit", () => {
  globalShortcut.unregisterAll();
  clearInterval(pollingInterval);
});

// --- IPC Listeners ---

// Handle manual copy from your UI back to the system clipboard
ipcMain.on("clipboard:copy", (event, text) => {
  lastClipboardText = text; // Update this so our watcher doesn't trigger a loop
  clipboard.writeText(text);

  if (mainWindow && !mainWindow.isDestroyed() && mainWindow.isVisible())
    mainWindow.hide();
});

// Check Permissions (macOS focus)
ipcMain.handle("permissions:check", async () => {
  if (process.platform !== "darwin") return true;
  return screenRecordingPermission;
});

// Open Privacy Settings
ipcMain.on("permissions:open-settings", () => {
  if (process.platform === "darwin") {
    shell.openExternal(
      "x-apple.systempreferences:com.apple.preference.security?Privacy_ScreenCapture",
    );
  }
});

// Handle window hide
function handleWindowHide() {
  if (mainWindow && !mainWindow.isDestroyed() && mainWindow.isVisible())
    mainWindow.hide();
}
