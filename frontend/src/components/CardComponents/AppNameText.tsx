interface Props {
  name: string;
}

function AppNameText({ name }: Props) {
  return (
    <p className="flex-none font-black text-gray-900 truncate uppercase tracking-wider text-xs pb-1">
      {name}
    </p>
  );
}

export default AppNameText;
