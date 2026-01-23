// React

// Models
import { useEffect, useRef, useState } from "react";
import type ClipboardItem from "../types/ClipboardItem";
// Components
import Card from "./CardComponents/Card";

interface Props {
  history: ClipboardItem[];
}

function History({ history }: Props) {
  const [selectedIndex, setSelectedIndex] = useState<number>(0);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // --- Keyboard navigation logic ---
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (history.length === 0) return;

      if (e.key === "ArrowRight") {
        const newIndex = Math.min(selectedIndex + 1, history.length - 1);
        setSelectedIndex(newIndex);
      }
      if (e.key === "ArrowLeft") {
        const newIndex = Math.max(selectedIndex - 1, 0);
        setSelectedIndex(newIndex);
      }
      if (e.key === "Enter") {
        window.electron.copyText(history[selectedIndex].text);
      }
    };

    // Add listener
    window.addEventListener("keydown", handleKeyDown);
    // Remove listener when component unmounts
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [history, selectedIndex]);

  // Auto-scroll to selected card
  useEffect(() => {
    const selectedCard = scrollContainerRef.current?.children[
      selectedIndex
    ] as HTMLElement;
    if (selectedCard) {
      selectedCard.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
        inline: "center",
      });
    }
  }, [selectedIndex]);

  return (
    <div
      ref={scrollContainerRef}
      className="h-full grow flex flex-row p-2 overflow-x-auto snap-x "
    >
      {history.length > 0 ? (
        history.map((item, index) => (
          <div className="h-full p-2">
            <Card
              item={item}
              isSelected={index === selectedIndex}
              index={index}
              setSelectedIndex={setSelectedIndex}
            />
          </div>
        ))
      ) : (
        <div>Pas de text copié</div>
      )}
    </div>
  );
}

export default History;
