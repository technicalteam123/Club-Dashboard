import { ReactNode, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Link, useLocation } from 'wouter';
import { 
  Home, CreditCard, Calendar, Users, FileText, 
  MessageCircle, HelpCircle, BookOpen, Video, 
  Settings, LogOut, Menu, X, Activity, DollarSign
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useLogout } from '@workspace/api-client-react';

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const { user, logout: contextLogout } = useAuth();
  const [location, setLocation] = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const logoutMutation = useLogout();

  const handleLogout = () => {
    logoutMutation.mutate(undefined, {
      onSettled: () => {
        contextLogout();
        setLocation('/login');
      }
    });
  };

  const navItems = {
    user: [
      { path: '/user/dashboard', label: 'Dashboard', icon: Home },
      { path: '/user/membership', label: 'Membership', icon: CreditCard },
      { path: '/user/appointments', label: 'Appointments', icon: Calendar },
      { path: '/user/doctors', label: 'Doctors', icon: Users },
      { path: '/user/reports', label: 'Reports', icon: FileText },
      { path: '/user/finance', label: 'Finance & SIP', icon: DollarSign },
      { path: '/user/community', label: 'Community', icon: MessageCircle },
      { path: '/user/learning', label: 'Learning Center', icon: BookOpen },
      { path: '/user/webinars', label: 'Webinars', icon: Video },
      { path: '/user/messages', label: 'Messages', icon: MessageCircle },
      { path: '/user/support', label: 'Support', icon: HelpCircle },
    ],
    doctor: [
      { path: '/doctor/dashboard', label: 'Dashboard', icon: Home },
      { path: '/doctor/appointments', label: 'Appointments', icon: Calendar },
      { path: '/doctor/patients', label: 'My Patients', icon: Users },
      { path: '/doctor/reports', label: 'Reports', icon: FileText },
      { path: '/doctor/messages', label: 'Messages', icon: MessageCircle },
      { path: '/doctor/profile', label: 'Profile', icon: Settings },
    ],
    admin: [
      { path: '/admin/dashboard', label: 'Dashboard', icon: Home },
      { path: '/admin/users', label: 'Users', icon: Users },
      { path: '/admin/doctors', label: 'Doctors', icon: Activity },
      { path: '/admin/appointments', label: 'Appointments', icon: Calendar },
      { path: '/admin/reports', label: 'Reports', icon: FileText },
      { path: '/admin/webinars', label: 'Webinars', icon: Video },
      { path: '/admin/community', label: 'Community', icon: MessageCircle },
      { path: '/admin/finance', label: 'Finance', icon: DollarSign },
      { path: '/admin/support', label: 'Support', icon: HelpCircle },
    ]
  };

  const links = user ? navItems[user.role as keyof typeof navItems] : [];

  return (
    <div className="flex min-h-[100dvh] bg-background">
      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 glass-panel border-r transition-transform duration-300 md:translate-x-0 ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'} md:static md:flex md:flex-col`}>
        <div className="flex h-16 shrink-0 items-center px-6">
          <div className="flex items-center gap-2 text-primary">
            <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center">
              <span className="text-primary-foreground font-display font-bold text-lg">E</span>
            </div>
            <span className="font-display font-semibold text-xl tracking-tight">EFFF Club</span>
          </div>
          <Button variant="ghost" size="icon" className="ml-auto md:hidden" onClick={() => setIsMobileMenuOpen(false)}>
            <X className="h-5 w-5" />
          </Button>
        </div>
        
        <nav className="flex-1 space-y-1 px-4 py-4 overflow-y-auto">
          {links.map((link) => {
            const Icon = link.icon;
            const isActive = location.startsWith(link.path);
            return (
              <Link key={link.path} href={link.path} onClick={() => setIsMobileMenuOpen(false)}>
                <div className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors ${isActive ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:bg-muted hover:text-foreground'}`}>
                  <Icon className="h-5 w-5" />
                  {link.label}
                </div>
              </Link>
            );
          })}
        </nav>

        <div className="p-4 mt-auto">
          <div className="mb-4 px-3 py-3 rounded-xl bg-muted/50">
            <p className="text-sm font-medium truncate">{user?.name}</p>
            <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
          </div>
          <Button variant="outline" className="w-full justify-start text-muted-foreground border-border/50" onClick={handleLogout}>
            <LogOut className="mr-2 h-4 w-4" />
            Sign out
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0">
        <header className="flex h-16 shrink-0 items-center border-b glass-panel px-4 md:px-8">
          <Button variant="ghost" size="icon" className="md:hidden mr-4" onClick={() => setIsMobileMenuOpen(true)}>
            <Menu className="h-5 w-5" />
          </Button>
          <div className="flex-1" />
          <div className="flex items-center gap-4">
            {/* Header actions */}
            {user?.role === 'user' && (
              <Badge variant="secondary" className="hidden sm:inline-flex bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300 border-none px-3 py-1">
                {user.membershipPlan?.toUpperCase()} PLAN
              </Badge>
            )}
          </div>
        </header>
        <div className="flex-1 p-4 md:p-8 overflow-y-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
