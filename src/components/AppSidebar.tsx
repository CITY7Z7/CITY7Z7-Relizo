import { NavLink } from "@/components/NavLink";
import { useLocation } from "react-router";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { Music, Disc3, Calendar, Truck, Megaphone, BarChart3 } from "lucide-react";

const catalogItems = [
  { title: "Tracks", url: "/tracks", icon: Music },
  { title: "Albums", url: "/albums", icon: Disc3 },
];

const planningItems = [
  { title: "Release Calendar", url: "/releases", icon: Calendar },
];

const distroItems = [
  { title: "Distributors", url: "/distributors", icon: Truck },
  { title: "Promotion", url: "/promotion", icon: Megaphone },
];

const dashboardItems = [
  { title: "Dashboard", url: "/", icon: BarChart3 },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const location = useLocation();
  const isActive = (path: string) => location.pathname === path || (path !== "/" && location.pathname.startsWith(path));

  const renderGroup = (label: string, items: typeof catalogItems) => (
    <SidebarGroup>
      {!collapsed && (
        <SidebarGroupLabel className="text-[10px] uppercase tracking-[0.1em] text-muted-foreground font-semibold mb-1">
          {label}
        </SidebarGroupLabel>
      )}
      <SidebarGroupContent>
        <SidebarMenu>
          {items.map((item) => (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton asChild isActive={isActive(item.url)}>
                <NavLink
                  to={item.url}
                  end={item.url === "/"}
                  className="flex items-center gap-2.5 px-2.5 py-1.5 rounded-md text-sm transition-colors duration-150"
                  activeClassName="bg-primary/8 text-primary font-medium"
                  aria-label={item.title}
                >
                  <item.icon className="h-4 w-4 shrink-0" />
                  {!collapsed && <span>{item.title}</span>}
                </NavLink>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );

  return (
    <Sidebar collapsible="icon" className="border-r-0 shadow-studio">
      <div className="px-4 py-4 flex items-center gap-2">
        <div className="w-7 h-7 rounded-lg bg-primary flex items-center justify-center">
          <Music className="h-4 w-4 text-primary-foreground" />
        </div>
        {!collapsed && (
          <span className="text-sm font-semibold tracking-tighter">Studio</span>
        )}
      </div>
      <SidebarContent className="px-2">
        {renderGroup("Dashboard", dashboardItems)}
        {renderGroup("Music Catalog", catalogItems)}
        {renderGroup("Release Planning", planningItems)}
        {renderGroup("Distribution", distroItems)}
      </SidebarContent>
    </Sidebar>
  );
}
