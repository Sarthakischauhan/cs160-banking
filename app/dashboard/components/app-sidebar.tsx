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
    url: "/dashboard/transfer",
    img: ArrowLeftRight,
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
    title: "Account Settings",
    url: "/dashboard/account-settings",
    img: SettingsIcon,
  },
  {
    title: "Nearby ATMs",
    url: "/dashboard/maps",
    img: MapPin,
  },
  {
    title: "Deposit Checks",
    url: "/dashboard/checks",
    img: Banknote,
  }
];

export function AppSidebar({currentAccountId}: {currentAccountId?: string}) {
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
            <SidebarMenuButton asChild className="
              text-red-600 dark:text-red-400
              hover:bg-red-100 dark:hover:bg-red-900/40
              transition-colors
            ">
              <a href="/auth/logout">
                <LogOut className="mr-2" />
                <span className="text-lg">Logout</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
