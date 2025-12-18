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
  LogOut,
  Settings,
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
import LogoutButton from "@/components/ui/logoutbtn";

// A collection of possible sidebar options users can use to route through the page.
// UPDATE ME when another page is added for routing purposes
const sidebarOptions = [
  {
    title: "Dashboard",
    url: "/dashboard",
    img: House,
    accountDependent: false,
  },
  {
    title: "Deposit",
    url: "/dashboard/deposit",
    img: HandCoins,
    accountDependent: true,
  },
  {
    title: "Withdraw",
    url: "/dashboard/withdraw",
    img: HandCoins,
    accountDependent: true,
  },
  {
    title: "Transfer",
    url: "/dashboard/transfer",
    img: ArrowLeftRight,
    accountDependent: true,
  },
  {
    title: "Deposit Checks",
    url: "/dashboard/checks",
    img: Banknote,
    accountDependent: true,
  },
  {
    title: "Transaction History",
    url: "/dashboard/transaction-history",
    img: FileClock,
    accountDependent: true,
  },
  {
    title: "Notifications",
    url: "/dashboard/notifications",
    img: Bell,
    accountDependent: false,
  },
  {
    title: "Nearby ATMs",
    url: "/dashboard/maps",
    img: MapPin,
    accountDependent: false,
  },
  {
    title: "Account Settings",
    url: "/dashboard/account-settings",
    img: Settings,
    accountDependent: false,
  },
];

export function AppSidebar({
  currentAccountId,
}: {
  currentAccountId?: string;
}) {
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
            <SidebarMenuItem
              key={option.title}
              className={
                option.accountDependent && !currentAccountId
                  ? "opacity-50 pointer-events-none"
                  : ""
              }
            >
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
            <SidebarMenuButton asChild className="transition-colors">
              <LogoutButton />
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
