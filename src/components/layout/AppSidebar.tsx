import { Link, useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Sprout, MapPin, Users, QrCode, Leaf, ShoppingBasket, LogIn, LogOut } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';

const allNavItems = [
  { to: '/', label: 'Dashboard', icon: LayoutDashboard, authRequired: true },
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

  const navItems = allNavItems.filter(item => !item.authRequired || isAuthenticated);

  return (
    <aside className="fixed left-0 top-0 z-40 h-screen w-64 border-r border-sidebar-border bg-sidebar flex flex-col">
      <div className="flex items-center gap-3 px-6 py-6 border-b border-sidebar-border">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl garden-gradient">
          <Leaf className="h-5 w-5 text-primary-foreground" />
        </div>
        <div>
          <h1 className="text-lg font-bold text-sidebar-foreground">GardenTrack</h1>
          <p className="text-xs text-sidebar-foreground/60">Harvest Manager</p>
        </div>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-1">
        {navItems.map((item) => {
          const isActive = location.pathname === item.to;
          return (
            <Link
              key={item.to}
              to={item.to}
              className={`relative flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-all duration-200 ${
                isActive
                  ? 'text-sidebar-primary-foreground'
                  : 'text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent'
              }`}
            >
              {isActive && (
                <motion.div
                  layoutId="sidebar-active"
                  className="absolute inset-0 rounded-lg bg-sidebar-primary"
                  transition={{ type: 'spring', bounce: 0.2, duration: 0.5 }}
                />
              )}
              <item.icon className="relative z-10 h-5 w-5" />
              <span className="relative z-10">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="px-4 py-4 border-t border-sidebar-border space-y-3">
        {isAuthenticated ? (
          <div className="flex items-center justify-between px-2">
            <span className="text-xs text-sidebar-foreground/70 truncate">{user?.email}</span>
            <button onClick={() => { logout(); navigate('/login'); }} className="text-sidebar-foreground/60 hover:text-sidebar-foreground">
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        ) : (
          <Link to="/login" className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent">
            <LogIn className="h-4 w-4" /> Sign In
          </Link>
        )}
        <div className="rounded-lg bg-sidebar-accent p-4">
          <p className="text-xs font-medium text-sidebar-foreground/80">Season Progress</p>
          <div className="mt-2 h-2 rounded-full bg-sidebar-border overflow-hidden">
            <div className="h-full w-3/5 rounded-full garden-gradient" />
          </div>
          <p className="mt-1 text-xs text-sidebar-foreground/60">60% through growing season</p>
        </div>
      </div>
    </aside>
  );
};

export default AppSidebar;
