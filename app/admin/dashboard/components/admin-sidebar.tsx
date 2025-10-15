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

// A collection of possible sidebar options users can use to route through the page.
// UPDATE ME when another page is added for routing purposes
const sidebarOptions = [
  {
    title: "Dashboard",
    url: "/admin/dashboard",
    img: House,
  },
  {
    title: "User Requests",
    url: "/admin/dashboard/user-requests",
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
                <a href={option.url}>
                  <option.img />
                  <span className="text-lg">{option.title}</span>
                </a>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
        <SidebarGroup />
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <h1 className="text-center">Username</h1>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
