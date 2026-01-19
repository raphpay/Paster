import { useEffect, useState } from "react";
import "./App.css";

interface ClipboardItem {
  id: number;
  text: string;
  timestamp: number;
}

function App() {
  const [textToCopy, setTextToCopy] = useState("Hello World!");
  const [history, setHistory] = useState<ClipboardItem[]>([]);

  function handleCopy() {
    window.electron.copyText(textToCopy);
  }

  function handleCopyFromHistory(item: ClipboardItem) {
    window.electron.copyText(item.text);
  }

  useEffect(() => {
    // On récupère la fonction de nettoyage
    const removeListener = window.electron.onClipboardNewItem(
      (item: ClipboardItem) => {
        setHistory((prev) => {
          // Sécurité anti-doublon par ID
          if (prev.find((i) => i.text === item.text)) return prev;
          return [item, ...prev];
        });
      },
    );

    return () => {
      removeListener();
    };
  }, []);

  return (
    <>
      <div className="flex flex-col">
        <input
          type="text"
          value={textToCopy}
          onChange={(e) => setTextToCopy(e.target.value)}
          className="border rounded-sm p-1"
        />
        <button onClick={handleCopy}>Copy</button>

        <h2 className="text-lg font-bold mb-2">Historique du presse-papiers</h2>
        <ul className="border rounded p-2 max-h-96 overflow-y-auto">
          {history.map((item) => (
            <li
              key={item.id}
              className="p-1 border-b flex justify-between items-center hover:bg-gray-100 cursor-pointer"
              onClick={() => handleCopyFromHistory(item)}
            >
              <span>{item.text}</span>
              <span className="text-xs text-gray-500">
                {new Date(item.timestamp).toLocaleTimeString()}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}

export default App;
