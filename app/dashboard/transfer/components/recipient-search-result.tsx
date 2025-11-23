export function RecipientSearchResults({
  results,
  onSelect,
}: {
  results: SearchRecipient[];
  onSelect: (user: SearchRecipient) => void;
}) {
  if (!results.length) return null;

  return (
    <div className="absolute z-10 mt-2 w-full max-h-56 overflow-y-auto rounded-lg border border-gray-800 bg-black/90 shadow-lg">
      {results.map((user) => {
        const avatarUrl = `https://avatar.vercel.sh/${encodeURIComponent(user.name)}`;

        return (
          <div
            key={user.account_id}
            onClick={() => onSelect(user)}
            className="flex items-center gap-3 px-3 py-2 cursor-pointer hover:bg-white/5 transition"
          >
            <img
              src={avatarUrl}
              alt={user.name}
              className="h-8 w-8 rounded-full border border-gray-700"
            />

            <div className="flex flex-col">
              <span className="text-sm font-medium">
                {user.name}
              </span>
                <span className="text-xs opacity-60 font-medium">
                {user.account_type}
              </span> 
              <span className="text-xs text-gray-400">
                {user.email}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
