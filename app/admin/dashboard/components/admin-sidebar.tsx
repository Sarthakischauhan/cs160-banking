import {
  House,
  Landmark,
  Bell,
  FileText,
  UserCog,
  ArrowLeftRight,
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
    img: Bell
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
  }
];

export function AdminSidebar() {
  return (
    <Sidebar className="p-2">
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
          <SidebarMenuButton>
              <a 
                href="/auth/logout"
                className="bg-black text-white rounded-lg w-1/2 mx-auto text-center py-2 hover:bg-opacity-80"
              >
                Logout
              </a>
            </SidebarMenuButton>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
