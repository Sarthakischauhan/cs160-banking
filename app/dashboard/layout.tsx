import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "./components/app-sidebar";
import { getUserData, handleCurrentId } from "@/lib/user";
import { auth0 } from "@/lib/auth0";
import { OnboardSidebar } from "./components/onboard-sidebar";
import { cookies } from "next/headers";
import { HideBalanceProvider } from "./providers/hide-balance-provider";
import ChatWidget from "./components/chat-widget";
import { getAccount } from "@/lib/accounts";

export default async function dashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const theme = cookieStore.get("theme")?.value ?? "light";
  const hideBalance = cookieStore.get("hideBalance")?.value === "true";

  const session = await auth0.getSession()
  if (!session){
    return (
      <>
      {children}
      </>
    )
  }
  const userSub = session?.user?.sub
  if (!userSub) {
    throw new Error("User ID (sub) is missing from session.")
  }

  const activeId = (await handleCurrentId()) ?? "";

  const user = await getUserData({ userId: userSub })
  return (
    <div>
      <HideBalanceProvider initialHideBalance={hideBalance}>
        <SidebarProvider>
          {user?.isOnboarded ? <AppSidebar currentAccountId={activeId} />  : <OnboardSidebar />}
          <SidebarInset>
            <div className="md:hidden flex items-center gap-2 border-b px-3 py-2">
              <SidebarTrigger />
              <span className="text-sm font-medium">Menu</span>
            </div>
            {children}
          </SidebarInset>
        </SidebarProvider>
        {user?.isOnboarded && <ChatWidget />}
      </HideBalanceProvider>
    </div>
  );
}
