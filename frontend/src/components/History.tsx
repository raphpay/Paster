// React
// Models
import type ClipboardItem from "../types/ClipboardItem";
// Components
import Card from "./CardComponents/Card";

interface Props {
  history: ClipboardItem[];
}

function History({ history }: Props) {
  function handleCopyFromHistory(item: ClipboardItem) {
    window.electron.copyText(item.text);
  }

  // To be removed to handle conditional rendering
  const emptyItem: ClipboardItem = {
    id: 0,
    sourceApp: "Inconnu",
    text: "",
    timestamp: 0,
  };

  return (
    <>
      {history.length === 0 ? (
        <div className="h-full w-full grow flex flex-col p-2">
          <Card item={history[0] ?? emptyItem} isSelected={false} />
        </div>
      ) : (
        <div className="h-full w-full grow flex items-center justify-center">
          <h2 className="text-xl font-semibold">Pas de texte copié</h2>
        </div>
      )}
    </>
  );
}

export default History;
