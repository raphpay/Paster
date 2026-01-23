// React
import { useEffect, useState } from "react";

// Models
import type ClipboardItem from "./types/ClipboardItem";
// Components
import History from "./components/History";
import StatusBar from "./components/StatusBar";
// To be added later
// import PermissionAlert from "./components/PermissionAlert";

// Styles
import "./App.css";

function App() {
  const [history, setHistory] = useState<ClipboardItem[]>([]);
  // const [hasPermission, setHasPermission] = useState(true);

  function handleClear() {
    setHistory([]);
    window.electron.clearHistory();
  }

  // Load history from app cache on startup
  useEffect(() => {
    async function init() {
      const history = await window.electron.loadHistory();
      setHistory(history);
    }
    init();
  }, []);

  useEffect(() => {
    // On récupère la fonction de nettoyage
    const removeListener = window.electron.onClipboardNewItem(
      (item: ClipboardItem) => {
        setHistory((prev) => {
          // Sécurité anti-doublon par ID
          if (prev.find((i) => i.id === item.id)) return prev;
          const newHistory = [item, ...prev];
          window.electron.saveHistory(newHistory);
          return newHistory;
        });
      },
    );

    return () => {
      removeListener();
    };
  }, []);

  // useEffect(() => {
  //   // Check on startup
  //   window.electron.checkPermissions().then((allowed: boolean) => {
  //     console.log("Permissions checked:", allowed);
  //     setHasPermission(allowed);
  //   });
  // }, []);

  return (
    <div className="min-w-screen min-h-screen flex flex-col flex-1">
      {/*To be added later*/}
      {/*{!hasPermission && <PermissionAlert />}*/}

      <StatusBar />

      {/*<button onClick={handleClear}>Clean history</button>*/}

      <History history={history} />
    </div>
  );
}

export default App;
