import { useEffect, useState } from "react";
import "./App.css";
// To be added later
// import PermissionAlert from "./components/PermissionAlert";
import type ClipboardItem from "./types/ClipboardItem";
import Main from "./components/Main";
import StatusBar from "./components/StatusBar";

function App() {
  const [history, setHistory] = useState<ClipboardItem[]>([]);
  // const [hasPermission, setHasPermission] = useState(true);

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
    <div className="min-w-screen min-h-screen">
      {/*To be added later*/}
      {/*{!hasPermission && <PermissionAlert />}*/}

      <StatusBar />

      <Main history={history} />
    </div>
  );
}

export default App;
