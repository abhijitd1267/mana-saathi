import { useLocation } from 'react-router-dom';
import { 
  Home, 
  BookOpen, 
  ClipboardList, 
  TrendingUp, 
  Shield, 
  Phone, 
  Settings,
  Users,
  AlertTriangle,
  BarChart3,
  MessageSquare,
  FileText,
  UserCheck
} from 'lucide-react';
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
} from '@/components/ui/sidebar';
import { NavLink } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';
import { getCurrentUser } from '@/lib/mock-data';

interface NavItem {
  title: string;
  url: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: number;
}

const patientNavItems: NavItem[] = [
  { title: 'Home', url: '/', icon: Home },
  { title: 'Journal', url: '/journal', icon: BookOpen },
  { title: 'Assessments', url: '/assessments', icon: ClipboardList },
  { title: 'Insights', url: '/insights', icon: TrendingUp },
  { title: 'Share & Consent', url: '/consent', icon: Shield },
  { title: 'Crisis Help', url: '/crisis', icon: Phone },
  { title: 'Settings', url: '/settings', icon: Settings }
];

const therapistNavItems: NavItem[] = [
  { title: 'Patients', url: '/', icon: Users },
  { title: 'Risk Flags', url: '/risk-flags', icon: AlertTriangle, badge: 2 },
  { title: 'Outcomes', url: '/outcomes', icon: BarChart3 },
  { title: 'Messages', url: '/messages', icon: MessageSquare },
  { title: 'Settings', url: '/settings', icon: Settings }
];

const adminNavItems: NavItem[] = [
  { title: 'Audit Logs', url: '/audit', icon: FileText },
  { title: 'Users & Roles', url: '/users', icon: UserCheck },
  { title: 'Data Exports', url: '/exports', icon: BarChart3 }
];

export function AppSidebar() {
  const { open } = useSidebar();
  const location = useLocation();
  const currentUser = getCurrentUser();
  
  const getNavItems = (): NavItem[] => {
    switch (currentUser.role) {
      case 'patient':
        return patientNavItems;
      case 'therapist':
        return therapistNavItems;
      default:
        return patientNavItems;
    }
  };

  const navItems = getNavItems();
  const isCollapsed = !open;

  return (
    <Sidebar
      className={isCollapsed ? "w-14" : "w-64"}
      collapsible="icon"
    >
      <SidebarContent className="pt-4">
        <SidebarGroup>
          <SidebarGroupLabel className={isCollapsed ? "sr-only" : ""}>
            Navigation
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink 
                      to={item.url} 
                      end
                      className={({ isActive }) => 
                        `flex items-center gap-3 px-3 py-2 rounded-xl transition-all duration-200 ${
                          isActive 
                            ? 'bg-sidebar-accent text-sidebar-primary font-medium shadow-soft' 
                            : 'text-sidebar-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground'
                        }`
                      }
                    >
                      <item.icon className="w-5 h-5 flex-shrink-0" />
                      {!isCollapsed && (
                        <>
                          <span className="flex-1">{item.title}</span>
                          {item.badge && (
                            <Badge variant="destructive" className="text-xs px-1.5 py-0.5">
                              {item.badge}
                            </Badge>
                          )}
                        </>
                      )}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Crisis help button always visible for patients */}
        {currentUser.role === 'patient' && (
          <div className="mt-auto p-4">
            <button className="w-full bg-destructive text-destructive-foreground rounded-xl px-4 py-3 font-medium shadow-elevated hover:bg-destructive/90 transition-colors flex items-center justify-center gap-2">
              <Phone className="w-4 h-4" />
              {!isCollapsed && <span>Need Help Now?</span>}
            </button>
          </div>
        )}
      </SidebarContent>
    </Sidebar>
  );
}