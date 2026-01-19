import { useState } from "react";
import "./App.css";

function App() {
  const [textToCopy, setTextToCopy] = useState("Hello World!");

  function handleCopy() {
    window.electron.copyText(textToCopy);
  }

  return (
    <>
      <div className="flex">
        <input
          type="text"
          value={textToCopy}
          onChange={(e) => setTextToCopy(e.target.value)}
          className="border rounded-sm p-1"
        />
        <button onClick={handleCopy}>Copy</button>
      </div>
    </>
  );
}

export default App;
