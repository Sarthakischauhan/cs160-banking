import { redirect } from "next/navigation";
import { auth0 } from "@/lib/auth0";
import { getUserData } from "@/lib/user";
import { ProfileCompletion } from "../components/onboard/ProfileCompletion";
import { NotificationsPageTable } from "./components/notifications-table";

export default async function NotificationsPage() {
  const session = await auth0.getSession();
  if (!session) redirect("/");

  const user = await getUserData({ userId: session.user.sub });
  if (!user?.isOnboarded) return <ProfileCompletion />;

  return (
    <div className="min-h-screen w-full px-10 py-8">
      {/* Title */}
      <h1 className="text-4xl font-bold mb-4">Notifications</h1>

      {/* Table Container */}
      <div className="w-full max-w-6xl">
        <NotificationsPageTable initialNotifications={user.notifications} />
      </div>
    </div>
  );
}
