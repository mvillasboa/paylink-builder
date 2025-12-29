import { useEffect } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { NavLink } from "@/components/NavLink";
import { useRealtimeNotifications } from "@/hooks/useRealtimeNotifications";
import { NotificationPanel } from "./NotificationPanel";
import { notificationConfig } from "@/types/notification";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarProvider,
  SidebarTrigger,
  SidebarHeader,
  SidebarFooter,
} from "@/components/ui/sidebar";
import {
  LayoutDashboard,
  Link2,
  Receipt,
  Users,
  BarChart3,
  Settings,
  CreditCard,
  LogOut,
  Repeat,
  Package,
  FileText,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Bell, Search } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

const menuItems = [
  { title: "Dashboard", url: "/dashboard", icon: LayoutDashboard },
  { title: "Links de Pago", url: "/dashboard/links", icon: Link2 },
  { title: "Transacciones", url: "/dashboard/transactions", icon: Receipt },
  { title: "Suscripciones", url: "/dashboard/subscriptions", icon: Repeat },
  { title: "Productos", url: "/dashboard/products", icon: Package },
  { title: "Clientes", url: "/dashboard/clients", icon: Users },
  { title: "Reportes", url: "/dashboard/reports", icon: BarChart3 },
  { title: "Configuración", url: "/dashboard/settings", icon: Settings },
  { title: "Migración Java", url: "/docs/java-migration", icon: FileText },
  { title: "Esquema de BD", url: "/docs/database-schema", icon: FileText },
];

export function DashboardLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const { notifications, unreadCount, clearAll, markAsRead } = useRealtimeNotifications();

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  const userInitials = user?.email?.[0]?.toUpperCase() || 'U';
  const userEmail = user?.email || 'usuario@email.com';

  useEffect(() => {
    if (notifications.length > 0) {
      const latestNotification = notifications[0];
      const config = notificationConfig[latestNotification.type];
      
      const toastDuration = config.priority === "high" ? 8000 : config.priority === "medium" ? 5000 : 3000;
      
      toast(latestNotification.title, {
        description: latestNotification.message,
        duration: toastDuration,
        className: config.priority === "high" ? "border-destructive" : config.priority === "medium" ? "border-accent" : "",
      });
    }
  }, [notifications]);

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        {/* Verona-style Sidebar with dark gradient */}
        <Sidebar className="border-r-0 bg-gradient-sidebar">
          <SidebarHeader className="border-b border-sidebar-border p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded bg-primary">
                <CreditCard className="h-5 w-5 text-primary-foreground" />
              </div>
              <div>
                <h2 className="font-semibold text-lg text-sidebar-foreground">PayLink Pro</h2>
                <p className="text-xs text-sidebar-foreground/60">Panel de Control</p>
              </div>
            </div>
          </SidebarHeader>

          <SidebarContent className="px-3 py-4">
            <SidebarGroup>
              <SidebarGroupLabel className="text-[11px] uppercase tracking-wider text-sidebar-foreground/50 px-3 py-2 font-medium">
                Menú Principal
              </SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu className="space-y-1">
                  {menuItems.map((item) => {
                    const isActive = location.pathname === item.url;
                    return (
                      <SidebarMenuItem key={item.title}>
                        <SidebarMenuButton asChild isActive={isActive}>
                          <NavLink
                            to={item.url}
                            className={`
                              relative flex items-center gap-3 px-3 py-2.5 rounded text-sm transition-all duration-200
                              ${isActive 
                                ? 'bg-sidebar-accent text-sidebar-foreground' 
                                : 'text-sidebar-foreground/80 hover:bg-sidebar-accent hover:text-sidebar-foreground'
                              }
                            `}
                            activeClassName=""
                          >
                            {isActive && (
                              <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-primary rounded-r" />
                            )}
                            <item.icon className="h-4 w-4 shrink-0" />
                            <span className="font-medium">{item.title}</span>
                          </NavLink>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    );
                  })}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>

          <SidebarFooter className="border-t border-sidebar-border p-4">
            <div className="flex items-center gap-3">
              <Avatar className="h-9 w-9 border-2 border-primary/30">
                <AvatarImage src="/placeholder.svg" />
                <AvatarFallback className="bg-primary text-primary-foreground text-sm font-semibold">
                  {userInitials}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-sidebar-foreground truncate">{userEmail}</p>
                <p className="text-xs text-sidebar-foreground/50 truncate">Usuario activo</p>
              </div>
            </div>
          </SidebarFooter>
        </Sidebar>

        <div className="flex-1 flex flex-col min-w-0">
          {/* Header - Clean Verona style */}
          <header className="sticky top-0 z-10 border-b border-border bg-card">
            <div className="flex h-14 items-center gap-4 px-4">
              <SidebarTrigger className="text-muted-foreground hover:text-foreground" />
              
              <div className="flex-1 flex items-center gap-4">
                <div className="relative max-w-sm flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Buscar..."
                    className="pl-9 h-9 bg-background border-border text-sm"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="relative h-9 w-9 text-muted-foreground hover:text-foreground"
                      onClick={markAsRead}
                    >
                      <Bell className="h-4 w-4" />
                      {unreadCount > 0 && (
                        <Badge className="absolute -top-1 -right-1 h-4 w-4 flex items-center justify-center p-0 bg-destructive text-destructive-foreground text-[10px]">
                          {unreadCount}
                        </Badge>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent align="end" className="p-0 w-auto">
                    <NotificationPanel
                      notifications={notifications}
                      onClearAll={clearAll}
                    />
                  </PopoverContent>
                </Popover>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-9 w-9">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src="/placeholder.svg" />
                        <AvatarFallback className="bg-primary text-primary-foreground text-sm font-semibold">
                          {userInitials}
                        </AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuLabel className="font-normal">
                      <p className="text-sm font-medium">{userEmail}</p>
                      <p className="text-xs text-muted-foreground">Administrador</p>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => navigate('/dashboard/settings')}>
                      <Settings className="mr-2 h-4 w-4" />
                      Configuración
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Users className="mr-2 h-4 w-4" />
                      Mi Perfil
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleSignOut} className="text-destructive focus:text-destructive">
                      <LogOut className="mr-2 h-4 w-4" />
                      Cerrar Sesión
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </header>

          {/* Main Content */}
          <main className="flex-1 overflow-auto p-6">
            <Outlet />
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
