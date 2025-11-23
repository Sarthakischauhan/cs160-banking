import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "./components/app-sidebar";
import { getUserData, handleCurrentId } from "@/lib/user";
import { auth0 } from "@/lib/auth0";
import { OnboardSidebar } from "./components/onboard-sidebar";
import { cookies } from "next/headers";
import { ThemeScript } from "@/components/theme-script";
import { HideBalanceProvider } from "./providers/hide-balance-provider";

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
  const user = await getUserData({ userId: userSub })
  return (
    <div>
      <HideBalanceProvider initialHideBalance={hideBalance}>
        <SidebarProvider>
          {user?.isOnboarded ? <AppSidebar />  : <OnboardSidebar />}
          <SidebarInset>{children}</SidebarInset>
        </SidebarProvider>
      </HideBalanceProvider>
    </div>
  );
}
