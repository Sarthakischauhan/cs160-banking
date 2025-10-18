import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "./components/app-sidebar";
import { getUserData } from "@/lib/user";
import { auth0 } from "@/lib/auth0";
import { OnboardSidebar } from "./components/onboard-sidebar";

export default async function dashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth0.getSession()
  const userSub = session?.user?.sub
  if (!userSub) {
    throw new Error("User ID (sub) is missing from session.")
  }
  const user = await getUserData({ userId: userSub })
  return (
    <>
      <SidebarProvider>
        {user?.isOnboarded ? <AppSidebar />  : <OnboardSidebar />}
        <SidebarInset>{children}</SidebarInset>
      </SidebarProvider>
    </>
  );
}
