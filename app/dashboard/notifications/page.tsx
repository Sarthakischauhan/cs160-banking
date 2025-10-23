import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "../components/app-sidebar";
import { NotificationCard } from "../components/notification-card";

export default function NotificationsPage() {
  return (
    <>
      <div className="p-10">
        <h1 className="text-4xl font-bold">Notifications</h1>
      </div>
      <div className="grid w-full h-[calc(100%-200px)] justify-center">
        <NotificationCard full={true} />
      </div>
    </>
  );
}
