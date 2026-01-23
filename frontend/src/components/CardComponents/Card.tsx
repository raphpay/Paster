// Models
import type ClipboardItem from "../../types/ClipboardItem";

// Components
import Separator from "../Separator";
import AppNameText from "./AppNameText";
import CopiedText from "./CopiedText";
import DateText from "./DateText";

interface Props {
  item: ClipboardItem;
  isSelected: boolean;
}

function Card({ item, isSelected }: Props) {
  console.log("item", item, isSelected);

  return (
    <div
      className={`flex grow flex-col border rounded-md p-4 max-w-65 h-full overflow-hidden shadow-sm transition-colors bg-white
        hover:bg-gray-100 cursor-pointer
        ${
          isSelected
            ? "border-blue-500 ring-1 ring-blue-500"
            : "border-gray-200"
        }`}
    >
      <AppNameText name={item.sourceApp ?? "Incoonnue"} />
      <Separator />
      <CopiedText value={item.text ?? ""} />
      <Separator />
      <DateText timestamp={item.timestamp ?? 0} />
    </div>
  );
}

export default Card;
