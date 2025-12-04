import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { AdminSidebar } from "./components/admin-sidebar";
import { auth0 } from "@/lib/auth0";
import { requireRole } from "@/lib/permission";
import { TopDrawerNav } from "./components/mobile-topdrawer";

export default async function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth0.getSession();
  // requireRole(session, "Admin");
  return (
    <>
      {/* Desktop sidebar */}
      <div className="sm:hidden">
        <TopDrawerNav />
      </div>
      <SidebarProvider>
        <AdminSidebar />
        <SidebarInset>{children}</SidebarInset>
      </SidebarProvider>

      {/* Mobile top drawer */}
      
    </>
  );
}
