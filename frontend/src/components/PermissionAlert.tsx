function PermissionAlert() {
  return (
    <div className="bg-yellow-100 border-l-4 border-yellow-500 p-4 mb-4">
      <p className="text-sm text-yellow-700">
        L'accès à l'enregistrement de l'écran est nécessaire pour détecter
        l'origine des copies.
        <button
          onClick={() => window.electron.openSettings()}
          className="ml-2 underline font-bold"
        >
          Ouvrir les réglages
        </button>
      </p>
    </div>
  );
}

export default PermissionAlert;
