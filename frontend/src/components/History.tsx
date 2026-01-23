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
    <div className="h-full grow flex flex-col p-2">
      <Card item={history[0] ?? emptyItem} isSelected={false} />
    </div>
  );
}

export default History;
