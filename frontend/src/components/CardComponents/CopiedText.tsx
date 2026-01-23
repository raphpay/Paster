interface Props {
  value: string;
}

function CopiedText({ value }: Props) {
  return (
    <p className="grow h-full w-full overflow-y-auto wrap-break-words text-gray-700 text-md scrollbar-hide py-2">
      {value}
    </p>
  );
}

export default CopiedText;
