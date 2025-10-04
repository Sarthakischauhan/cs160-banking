import {
  House,
  ArrowLeftRight,
  FileClock,
  Settings,
  Landmark,
  Bell,
  MapPin,
  HandCoins
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
    url: "/dashboard",
    img: House,
  },
  {
    title: "Deposit",
    url: "/dashboard/deposit",
    img: HandCoins,
  },
  {
    title: "Transfer",
    url: "#",
    img: ArrowLeftRight,
  },
  {
    title: "Transaction History",
    url: "/dashboard/transaction-history",
    img: FileClock,
  },
  {
    title: "Notifications",
    url: "#",
    img: Bell,
  },
  {
    title: "Account Settings",
    url: "#",
    img: Settings,
  },
  {
    title: "Nearby ATMs",
    url: "#",
    img: MapPin,
  }
];

export function AppSidebar() {
  return (
    <Sidebar className="p-2">
      <SidebarHeader>
        <div className="flex flex-row items-center">
          <Landmark className="mx-2"/>
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
