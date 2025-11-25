import {
  House,
  Landmark,
  Bell,
  FileText,
  UserCog,
  ArrowLeftRight,
  Ticket,
  LogOut,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import Link from "next/link";

// A collection of possible sidebar options users can use to route through the page.
// UPDATE ME when another page is added for routing purposes
const sidebarOptions = [
  {
    title: "Dashboard",
    url: "/admin/dashboard",
    img: House,
  },
  {
    title: "Notifications",
    url: "/admin/dashboard/notifications",
    img: Bell,
  },
  {
    title: "Reports",
    url: "/admin/dashboard/reports",
    img: FileText,
  },
  {
    title: "Account Management",
    url: "/admin/dashboard/account-management",
    img: UserCog,
  },
  {
    title: "Transactions",
    url: "/admin/dashboard/transactions",
    img: ArrowLeftRight,
  },
  {
    title: "Support Tickets",
    url: "/admin/dashboard/support-tickets",
    img: Ticket,
  },
];

export function AdminSidebar() {
  return (
    <Sidebar collapsible="offcanvas" className="p-2">
      <SidebarHeader>
        <div className="flex flex-row items-center">
          <Landmark className="mx-2" />
          <h1 className="text-3xl items-center">Online Bank</h1>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup />
        <SidebarMenu>
          {sidebarOptions.map((option) => (
            <SidebarMenuItem key={option.title}>
              <SidebarMenuButton asChild>
                <Link href={option.url}>
                  <option.img />
                  <span className="text-lg">{option.title}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
        <SidebarGroup />
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuButton
            asChild
            className="
              text-red-600 dark:text-red-400
              hover:bg-red-100 dark:hover:bg-red-900/40
              transition-colors
            "
          >
            <a href="/auth/logout">
              <LogOut className="mr-2" />
              <span className="text-lg">Logout</span>
            </a>
          </SidebarMenuButton>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
