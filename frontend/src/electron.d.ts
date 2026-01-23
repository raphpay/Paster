import type ClipboardItem from "./types/ClipboardItem";
export interface IElectronAPI {
  // Renderer to Main (One-way: fire and forget)
  copyText: (text: string) => void;
  closePanel: () => void;
  openSettings: () => void;
  saveHistory: (data: ClipboardItem[]) => void;
  clearHistory: () => void;
  deleteHistory: (id: string) => void;
  deleteAllHistory: () => void;

  // Main to Renderer (Two-way: returns a Promise)
  checkPermissions: () => Promise<boolean>;
  hideWindow: () => Promise<void>;
  loadHistory: () => Promise<ClipboardItem[]>;

  // Event Listeners (Main to Renderer)
  // These return a function that can be called to unsubscribe (cleanup)
  onClipboardNewItem: (callback: (item: ClipboardItem) => void) => () => void;

  onCleanUpHistory: (
    callback: (history: ClipboardItem[]) => void,
  ) => () => void;
}

declare global {
  interface Window {
    electron: IElectronAPI;
  }
}
