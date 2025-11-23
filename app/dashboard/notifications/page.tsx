import { auth0 } from "@/lib/auth0";
import { NotificationCard } from "../components/notification-card";
import { redirect } from "next/navigation";
import { ProfileCompletion } from "../components/onboard/ProfileCompletion";
import { getUserData } from "@/lib/user";

export default async function NotificationsPage() {
  const session = await auth0.getSession();
  if (!session) {
    redirect("/");
  }
  const user = await getUserData({ userId: session.user.sub });
  if (!user?.isOnboarded) {
    return <ProfileCompletion />;
  }
  console.log(user.notifications)
  return (
    <>
      <div className="p-10">
        <h1 className="text-4xl font-bold">Notifications</h1>
      </div>
      <div className="flex w-full h-[calc(100%-200px)] justify-center">
        <NotificationCard notifications={user?.notifications} />
      </div>
    </>
  );
}
