import { useState } from 'react';
import { Heart, Menu, Bell, Globe, HelpCircle, LogOut, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { AppSidebar } from '@/components/AppSidebar';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { getCurrentUser, setCurrentUser } from '@/lib/mock-data';

interface AppShellProps {
  children: React.ReactNode;
}

export function AppShell({ children }: AppShellProps) {
  const [currentUser, setCurrentUserState] = useState(getCurrentUser());
  
  const handleSwitchUser = (userType: 'patient' | 'therapist') => {
    setCurrentUser(userType);
    setCurrentUserState(getCurrentUser());
    window.location.reload(); // Simple refresh for demo
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        {/* Header */}
        <header className="fixed top-0 left-0 right-0 h-16 bg-background/95 backdrop-blur-sm border-b border-sidebar-border z-50 flex items-center justify-between px-4">
          <div className="flex items-center gap-4">
            <SidebarTrigger />
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
                <Heart className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                Sahaay
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Demo user switcher */}
            <Badge variant="outline" className="mr-2">
              Demo Mode
            </Badge>
            
            {/* Language switcher */}
            <Button variant="ghost" size="sm">
              <Globe className="w-4 h-4" />
              <span className="ml-1">EN</span>
            </Button>

            {/* Notifications */}
            <Button variant="ghost" size="sm" className="relative">
              <Bell className="w-4 h-4" />
              <span className="absolute -top-1 -right-1 w-2 h-2 bg-destructive rounded-full"></span>
            </Button>

            {/* Help */}
            <Button variant="ghost" size="sm">
              <HelpCircle className="w-4 h-4" />
            </Button>

            {/* User menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="gap-2">
                  <Avatar className="w-6 h-6">
                    <AvatarImage src={currentUser.avatar} alt={currentUser.name} />
                    <AvatarFallback>
                      {currentUser.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <span className="hidden md:inline">{currentUser.name}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <div className="flex items-center gap-2 p-2">
                  <Avatar className="w-8 h-8">
                    <AvatarImage src={currentUser.avatar} alt={currentUser.name} />
                    <AvatarFallback>
                      {currentUser.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-medium">{currentUser.name}</p>
                    <p className="text-xs text-muted-foreground capitalize">{currentUser.role}</p>
                  </div>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <User className="w-4 h-4 mr-2" />
                  Profile Settings
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem 
                  onClick={() => handleSwitchUser('patient')}
                  disabled={currentUser.role === 'patient'}
                >
                  Switch to Patient View
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={() => handleSwitchUser('therapist')}
                  disabled={currentUser.role === 'therapist'}
                >
                  Switch to Therapist View
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="text-destructive">
                  <LogOut className="w-4 h-4 mr-2" />
                  Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        {/* Sidebar */}
        <AppSidebar />

        {/* Main content */}
        <main className="flex-1 pt-16">
          {children}
        </main>
      </div>
    </SidebarProvider>
  );
}