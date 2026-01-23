interface Props {
  value: string;
}

function CopiedText({ value }: Props) {
  return (
    <p className="h-50 w-50 overflow-y-auto overflow-x-hidden wrap-break-words text-gray-700 text-md py-2">
      {value}
    </p>
  );
}

export default CopiedText;
