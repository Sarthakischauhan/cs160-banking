
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { AdminSidebar } from "./components/admin-sidebar";
import { auth0 } from "@/lib/auth0";
import { requireRole } from "@/lib/permission";

export default async function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth0.getSession()
  requireRole(session, "Admin")
  return (
    <>
      <SidebarProvider>
        <AdminSidebar />
        <SidebarInset>{children}</SidebarInset>
      </SidebarProvider>
    </>
  );
}