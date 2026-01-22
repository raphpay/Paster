function StatusBar() {
  function hideWindow() {
    window.electron.hideWindow();
  }

  return (
    <div className="w-full p-2">
      <span
        onClick={hideWindow}
        className="flex  justify-center w-12 hover:bg-gray-200"
      >
        -
      </span>
    </div>
  );
}

export default StatusBar;
