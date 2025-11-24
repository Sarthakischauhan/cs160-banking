export function RecipientSearchResults({
  results,
  onSelect,
}: {
  results: SearchRecipient[];
  onSelect: (user: SearchRecipient) => void;
}) {
  if (!results.length) return null;

  return (
    <div
      className="absolute z-10 mt-2 w-full max-h-56 overflow-y-auto rounded-lg border 
      border-gray-200 bg-white shadow-lg 
      dark:border-gray-800 dark:bg-black"
    >
      {results.map((user) => {
        const avatarUrl = `https://avatar.vercel.sh/${encodeURIComponent(user.name)}`;

        return (
          <div
            key={user.account_id}
            onClick={() => onSelect(user)}
            className="flex items-center gap-3 px-3 py-2 cursor-pointer transition 
              hover:bg-gray-100 dark:hover:bg-white/5"
          >
            <img
              src={avatarUrl}
              alt={user.name}
              className="h-8 w-8 rounded-full border border-gray-200 dark:border-gray-700"
            />

            <div className="flex flex-col">
              <span className="text-sm font-medium text-black dark:text-white">
                {user.name}
              </span>

              <span className="text-xs font-medium text-gray-600 dark:text-gray-400">
                {user.account_type}
              </span>

              <span className="text-xs text-gray-500 dark:text-gray-400">
                {user.email}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
