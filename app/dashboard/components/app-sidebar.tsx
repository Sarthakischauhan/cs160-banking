import {
  House,
  ArrowLeftRight,
  FileClock,
  Settings as SettingsIcon,
  Landmark,
  Bell,
  MapPin,
  HandCoins,
  Banknote,
  LogOut
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
  SidebarRail,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import Image from "next/image";

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
    url: "/dashboard/transfer",
    img: ArrowLeftRight,
  },
  {
    title: "Deposit Checks",
    url: "/dashboard/checks",
    img: Banknote,
  },
  {
    title: "Transaction History",
    url: "/dashboard/transaction-history",
    img: FileClock,
  },
  {
    title: "Notifications",
    url: "/dashboard/notifications",
    img: Bell,
  },
  {
    title: "Nearby ATMs",
    url: "/dashboard/maps",
    img: MapPin,
  },
  {
    title: "Account Settings",
    url: "/dashboard/account-settings",
    img: SettingsIcon,
  }
];

export function AppSidebar({currentAccountId}: {currentAccountId?: string}) {
  return (
    <Sidebar className="p-2" collapsible="icon">
      <SidebarHeader>
        <div className="flex flex-row items-center gap-2">
          <SidebarTrigger className="md:hidden" />
          <Landmark />
          <h1 className="text-3xl items-center">Online Bank</h1>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup />
        <SidebarMenu>
          {sidebarOptions.map((option) => (
            <SidebarMenuItem key={option.title}>
              <SidebarMenuButton asChild tooltip={option.title}>
                <a href={option.url}>
                  <option.img />
                  <span className="text-lg group-data-[collapsible=icon]:hidden">
                    {option.title}
                  </span>
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
            <SidebarMenuButton asChild className="
              text-red-600 dark:text-red-400
              hover:bg-red-100 dark:hover:bg-red-900/40
              transition-colors
            ">
              <a href="/auth/logout">
                <span className="text-lg group-data-[collapsible=icon]:hidden">Logout</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
