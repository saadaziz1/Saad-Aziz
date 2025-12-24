
import { useNavigate, useLocation } from 'react-router-dom';
import useAuthStore from '../../store/authStore';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { LayoutDashboard, Package, ShoppingCart, Users, Shield, ShieldCheck } from 'lucide-react';

const AdminNav = ({ isOpen, setIsOpen }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuthStore();

  const navItems = [
    { path: '/admin', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/admin/products', label: 'Products', icon: Package },
    { path: '/admin/orders', label: 'Orders', icon: ShoppingCart },
    ...(user?.role === 'superadmin' ? [{ path: '/admin/users', label: 'Users', icon: Users }] : [])
  ];

  const getRoleIcon = () => {
    switch (user?.role) {
      case 'superadmin': return <ShieldCheck className="h-4 w-4" />;
      case 'admin': return <Shield className="h-4 w-4" />;
      default: return null;
    }
  };

  const getRoleBadgeVariant = () => {
    switch (user?.role) {
      case 'superadmin': return 'default';
      case 'admin': return 'secondary';
      default: return 'outline';
    }
  };

  const isActive = (path) => location.pathname === path;

  return (
    <>


      {/* Backdrop */}
      {isOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
     <div className={`
  fixed lg:relative
  top-0 left-0 h-screen w-64
  bg-background border-r border-border
  z-50 flex-shrink-0
  transform transition-transform duration-300
  ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
`}>
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="p-4 border-b border-border">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-lg font-bold text-foreground">Admin Panel</h2>
            </div>
            <div className="flex items-center gap-2">
              {getRoleIcon()}
              <Badge variant={getRoleBadgeVariant()} className="capitalize">
                {user?.role || 'admin'}
              </Badge>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4">
            <div className="space-y-1">
              {navItems.map((item) => {
                const IconComponent = item.icon;
                return (
                  <Button
                    key={item.path}
                    variant={isActive(item.path) ? 'default' : 'ghost'}
                    className="w-full justify-start gap-3 h-10"
                    onClick={() => {
                      navigate(item.path);
                      setIsOpen(false);
                    }}
                  >
                    <IconComponent className="h-4 w-4" />
                    {item.label}
                  </Button>
                );
              })}
            </div>
          </nav>

          
        </div>
      </div>
    </>
  );
};

export default AdminNav;