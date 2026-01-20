import { NavLink, useLocation } from 'react-router-dom';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
  useSidebar,
} from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import {
  LayoutDashboard,
  BarChart3,
  Megaphone,
  Sparkles,
  ArrowUpRight,
  Palette,
  FileText,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Home,
} from 'lucide-react';

interface AdminSidebarProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
  onLogout: () => void;
  userEmail?: string;
}

const menuItems = [
  { id: 'overview', title: 'Overview', icon: LayoutDashboard },
  { id: 'posts', title: 'Blog Posts', icon: FileText },
  { id: 'analytics', title: 'Analytics', icon: BarChart3 },
  { id: 'marketing', title: 'Marketing', icon: Megaphone },
  { id: 'ai-studio', title: 'AI Studio', icon: Sparkles },
  { id: 'social', title: 'Social Media', icon: ArrowUpRight },
  { id: 'visual', title: 'Visual Editor', icon: Palette },
];

export function AdminSidebar({ activeSection, onSectionChange, onLogout, userEmail }: AdminSidebarProps) {
  const { state, toggleSidebar } = useSidebar();
  const collapsed = state === 'collapsed';

  return (
    <Sidebar collapsible="icon" className="border-r">
      <SidebarHeader className="border-b p-4">
        <div className="flex items-center justify-between">
          {!collapsed && (
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-primary/10">
                <LayoutDashboard className="h-5 w-5 text-primary" />
              </div>
              <span className="font-semibold">Admin Panel</span>
            </div>
          )}
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleSidebar}
            className="h-8 w-8"
          >
            {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          </Button>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className={collapsed ? 'sr-only' : ''}>
            Dashboard
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.id}>
                  <SidebarMenuButton
                    onClick={() => onSectionChange(item.id)}
                    isActive={activeSection === item.id}
                    tooltip={item.title}
                    className="cursor-pointer"
                  >
                    <item.icon className="h-4 w-4" />
                    <span>{item.title}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup className="mt-auto">
          <SidebarGroupLabel className={collapsed ? 'sr-only' : ''}>
            Quick Links
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild tooltip="View Site">
                  <NavLink to="/" className="cursor-pointer">
                    <Home className="h-4 w-4" />
                    <span>View Site</span>
                  </NavLink>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t p-4">
        {!collapsed && userEmail && (
          <p className="text-xs text-muted-foreground truncate mb-2">{userEmail}</p>
        )}
        <Button
          variant="outline"
          size={collapsed ? 'icon' : 'sm'}
          onClick={onLogout}
          className="w-full"
        >
          <LogOut className="h-4 w-4" />
          {!collapsed && <span className="ml-2">Logout</span>}
        </Button>
      </SidebarFooter>
    </Sidebar>
  );
}
