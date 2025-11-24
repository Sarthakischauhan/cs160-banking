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
      <>
        <SidebarTrigger className="md:hidden fixed left-4 top-4 z-50" />
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
      </>
    );
  }
  
