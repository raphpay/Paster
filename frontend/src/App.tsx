import { useEffect, useState } from "react";
import "./App.css";

interface ClipboardItem {
  id: number;
  text: string;
  timestamp: number;
  sourceApp: string;
}

function App() {
  const [textToCopy, setTextToCopy] = useState("Hello World!");
  const [history, setHistory] = useState<ClipboardItem[]>([]);
  const [hasPermission, setHasPermission] = useState(true);

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

  useEffect(() => {
    // Check on startup
    window.electron.checkPermissions().then((allowed: boolean) => {
      setHasPermission(allowed);
    });
  }, []);

  return (
    <>
      {!hasPermission && (
        <div className="bg-yellow-100 border-l-4 border-yellow-500 p-4 mb-4">
          <p className="text-sm text-yellow-700">
            L'accès à l'enregistrement de l'écran est nécessaire pour détecter
            l'origine des copies.
            <button
              onClick={() => window.electron.openSettings()}
              className="ml-2 underline font-bold"
            >
              Ouvrir les réglages
            </button>
          </p>
        </div>
      )}

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
    </>
  );
}

export default App;
