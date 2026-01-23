import { formatRelativeTime } from "../../utils/timeAgo";

interface Props {
  timestamp: number;
}

function DateText({ timestamp }: Props) {
  const formattedDate = formatRelativeTime(timestamp);

  return (
    <p className="text-gray-500 text-right w-full text-xs pt-1 font-semibold">
      {formattedDate}
    </p>
  );
}

export default DateText;
