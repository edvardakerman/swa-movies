import { useAuth } from "../hooks/useAuth";

export const Header = () => {
  const { user, signOut } = useAuth();

  // Extract name from claims or use email
  const getName = () => {
    if (!user) return "User";
    const nameClaim = user.claims?.find((c) => c.typ === "name");
    if (nameClaim) return nameClaim.val;
    return user.userDetails.split("@")[0];
  };

  return (
    <header className="sticky top-0 z-50 bg-gray-900 border-b border-gray-700">
      <div className="max-w-2xl mx-auto px-3 py-3 flex items-center justify-between">
        <h1 className="text-xl font-bold text-white flex items-center gap-2">
          <img
            src="public/apple-touch-icon.png"
            alt="popcorn"
            className="h-12"
          />
          <span>Movies</span>
        </h1>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white text-sm font-semibold">
              {getName().charAt(0).toUpperCase()}
            </div>
            <span className="text-sm text-white hidden sm:inline">
              {getName()}
            </span>
          </div>
          <button
            onClick={signOut}
            className="text-sm text-gray-400 hover:text-white transition-colors"
          >
            Sign Out
          </button>
        </div>
      </div>
    </header>
  );
};
