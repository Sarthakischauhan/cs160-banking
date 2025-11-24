export function RecipientPreview({ user }: { user: SearchRecipient | null }) {
  if (!user) return null;

  const avatarUrl = `https://avatar.vercel.sh/${encodeURIComponent(user.name)}`;

  return (
    <div className="mt-4 flex items-center gap-3 rounded-lg border border-gray-800 p-3">
      <img
        src={avatarUrl}
        alt={user.name}
        className="h-10 w-10 rounded-full border border-gray-700"
      />

      <div className="flex flex-col">
        <span className="text-xs">
          Sending money to
        </span>

        <span className="text-sm font-semibold">
          {user.name}
        </span>

        <span className="text-xs">
          {user.email}
        </span>

        <span className="text-xs">
            {`Account No ****${user.account_id.slice(-4)}`}
        </span> 
      </div>
    </div>
  );
}
