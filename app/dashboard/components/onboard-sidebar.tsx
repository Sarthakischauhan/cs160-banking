import {
    House,
    ArrowLeftRight,
    FileClock,
    Settings as SettingsIcon,
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
    SidebarRail,
    SidebarTrigger,
  } from "@/components/ui/sidebar";
  

  const sidebarOptions = [
    {
      title: "Complete Profile",
      url: "/dashboard",
      img: House,
    }
  ];
  
  export function OnboardSidebar() {
    return (
      <Sidebar className="p-2" collapsible="icon">
        <SidebarHeader>
          <div className="flex flex-row items-center gap-2">
            <SidebarTrigger className="md:hidden" />
            <Landmark className="mx-2"/>
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
        <SidebarRail />
      </Sidebar>
    );
  }
  
