import { useState, useEffect } from "react";
import type ClipboardItem from "../types/ClipboardItem";

interface Props {
  history: ClipboardItem[];
}

function Main({ history }: Props) {
  const [textToCopy, setTextToCopy] = useState("Hello World!");

  function handleCopy() {
    window.electron.copyText(textToCopy);
  }

  function handleCopyFromHistory(item: ClipboardItem) {
    window.electron.copyText(item.text);
  }

  function handleSave() {
    window.electron.saveHistory("Random text");
  }

  async function retrieveHistory() {
    const res = await window.electron.loadHistory();
    console.log("res", res);
  }

  function handleClear() {
    window.electron.clearHistory();
  }

  return (
    <div className="h-full w-full p-2">
      <button onClick={handleSave}>Save</button>

      <button onClick={retrieveHistory}>Retrieve History</button>

      <button onClick={handleClear}>Clear</button>

      {/*<input
        type="text"
        value={textToCopy}
        onChange={(e) => setTextToCopy(e.target.value)}
        className="border rounded-sm p-1"
      />
      <button onClick={handleCopy}>Copy</button>*/}

      <h2 className="text-lg font-bold mb-2">Historique du presse-papiers</h2>
      <ul className="border rounded p-2 max-h-96 overflow-y-auto">
        {history.map((item) => (
          <li
            key={item.id}
            className="p-1 border-b flex justify-between items-center hover:bg-gray-100 cursor-pointer"
            onClick={() => handleCopyFromHistory(item)}
          >
            <span>{item.text}</span>
            <div className="flex items-center">
              <span className="text-xs text-gray-500 px-1">
                {new Date(item.timestamp).toLocaleTimeString()}
              </span>
              <span className="text-xs text-gray-500 px-1">
                {item.sourceApp ?? "None"}
              </span>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Main;
