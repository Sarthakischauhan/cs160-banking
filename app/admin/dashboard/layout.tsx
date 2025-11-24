import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { auth0 } from "@/lib/auth0";
import { requireRole } from "@/lib/permission";
import { AdminSidebar } from "./components/admin-sidebar";

export default async function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth0.getSession();
  requireRole(session, "Admin");
  return (
    <>
      <SidebarProvider>
        <AdminSidebar />
        <SidebarInset>{children}</SidebarInset>
      </SidebarProvider>
    </>
  );
}
