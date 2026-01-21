import { useEffect, useState } from "react";
import "./App.css";
import PermissionAlert from "./components/PermissionAlert";
import type ClipboardItem from "./types/ClipboardItem";
import Main from "./components/Main";

function App() {
  const [history, setHistory] = useState<ClipboardItem[]>([]);
  const [hasPermission, setHasPermission] = useState(true);

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
      {!hasPermission && <PermissionAlert />}

      <Main history={history} />
    </>
  );
}

export default App;
