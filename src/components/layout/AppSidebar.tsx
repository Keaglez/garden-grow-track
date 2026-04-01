import { Link, useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Sprout, MapPin, Users, QrCode, Leaf, ShoppingBasket, LogIn, LogOut, Globe } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
  SidebarHeader,
  useSidebar,
} from '@/components/ui/sidebar';
import { NavLink } from '@/components/NavLink';

const allNavItems = [
  { to: '/', label: 'Dashboard', icon: LayoutDashboard, authRequired: true },
  { to: '/locations', label: 'Locations', icon: Globe, authRequired: true },
  { to: '/spaces', label: 'Spaces', icon: MapPin, authRequired: true },
  { to: '/crops', label: 'Crops & Harvests', icon: Sprout, authRequired: true },
  { to: '/scanner', label: 'QR Scanner', icon: QrCode, authRequired: true },
  { to: '/shop', label: 'Shop', icon: ShoppingBasket, authRequired: false },
  { to: '/users', label: 'Users', icon: Users, authRequired: true },
];

const AppSidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated, user, logout } = useAuth();
  const { state } = useSidebar();
  const collapsed = state === 'collapsed';

  const navItems = allNavItems.filter(item => !item.authRequired || isAuthenticated);

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <div className="flex items-center gap-3 px-2 py-2">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl garden-gradient">
            <Leaf className="h-5 w-5 text-primary-foreground" />
          </div>
          {!collapsed && (
            <div>
              <h1 className="text-lg font-bold text-sidebar-foreground">GardenTrack</h1>
              <p className="text-xs text-sidebar-foreground/60">Harvest Manager</p>
            </div>
          )}
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => (
                <SidebarMenuItem key={item.to}>
                  <SidebarMenuButton
                    asChild
                    isActive={location.pathname === item.to}
                    tooltip={item.label}
                  >
                    <NavLink to={item.to} end>
                      <item.icon className="h-5 w-5" />
                      <span>{item.label}</span>
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        {isAuthenticated ? (
          <div className="flex items-center justify-between px-2">
            {!collapsed && (
              <span className="text-xs text-sidebar-foreground/70 truncate">{user?.email}</span>
            )}
            <button
              onClick={() => { logout(); navigate('/login'); }}
              className="text-sidebar-foreground/60 hover:text-sidebar-foreground"
              title="Sign Out"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        ) : (
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton asChild tooltip="Sign In">
                <Link to="/login">
                  <LogIn className="h-4 w-4" />
                  <span>Sign In</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        )}
        {!collapsed && (
          <div className="rounded-lg bg-sidebar-accent p-4">
            <p className="text-xs font-medium text-sidebar-foreground/80">Season Progress</p>
            <div className="mt-2 h-2 rounded-full bg-sidebar-border overflow-hidden">
              <div className="h-full w-3/5 rounded-full garden-gradient" />
            </div>
            <p className="mt-1 text-xs text-sidebar-foreground/60">60% through growing season</p>
          </div>
        )}
      </SidebarFooter>
    </Sidebar>
  );
};

export default AppSidebar;
