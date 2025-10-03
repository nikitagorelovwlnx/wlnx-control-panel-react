import { ReactNode } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, MessageSquare, RefreshCw } from 'lucide-react';
import { HealthStatus } from '@/features/health/components/health-status';
import { Button } from '@/ui/button';
import { useQueryClient } from '@tanstack/react-query';

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const location = useLocation();
  const queryClient = useQueryClient();

  const navigation = [
    { name: 'Dashboard', href: '/', icon: LayoutDashboard },
    { name: 'Prompts Configuration', href: '/prompts', icon: MessageSquare },
  ];

  const handleRefresh = () => {
    queryClient.invalidateQueries();
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-30 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center gap-6">
              <h1 className="text-xl font-bold">WLNX Control Panel</h1>
              <nav className="hidden md:flex items-center gap-1">
                {navigation.map((item) => {
                  const Icon = item.icon;
                  const isActive = location.pathname === item.href;
                  return (
                    <Link key={item.name} to={item.href}>
                      <Button
                        variant={isActive ? 'secondary' : 'ghost'}
                        size="sm"
                        className="gap-2"
                      >
                        <Icon className="h-4 w-4" />
                        {item.name}
                      </Button>
                    </Link>
                  );
                })}
              </nav>
            </div>

            <div className="flex items-center gap-3">
              <HealthStatus />
              <Button size="icon" variant="ghost" onClick={handleRefresh} title="Refresh all data">
                <RefreshCw className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Mobile navigation */}
          <nav className="md:hidden flex items-center gap-1 pb-3 overflow-x-auto">
            {navigation.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.href;
              return (
                <Link key={item.name} to={item.href}>
                  <Button
                    variant={isActive ? 'secondary' : 'ghost'}
                    size="sm"
                    className="gap-2 whitespace-nowrap"
                  >
                    <Icon className="h-4 w-4" />
                    {item.name}
                  </Button>
                </Link>
              );
            })}
          </nav>
        </div>
      </header>

      {/* Main content */}
      <main className="container mx-auto px-4 py-6">{children}</main>
    </div>
  );
}
