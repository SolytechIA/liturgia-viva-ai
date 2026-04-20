import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { Home, Cross, BookOpen, Star, LogOut } from "lucide-react";
import { Logo } from "@/components/Logo";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

const items = [
  { to: "/dashboard", label: "Início", icon: Home, end: true },
  { to: "/dashboard/leitura", label: "Leitura do Dia", icon: Cross },
  { to: "/dashboard/arquivo", label: "Arquivo", icon: BookOpen },
  { to: "/dashboard/plano", label: "Meu Plano", icon: Star },
];

export const PrivateLayout = () => {
  const navigate = useNavigate();

  const logout = () => {
    toast.success("Você saiu. Até breve!");
    navigate("/");
  };

  return (
    <div className="flex min-h-screen bg-surface">
      {/* Sidebar */}
      <aside className="hidden w-64 shrink-0 flex-col bg-sidebar text-sidebar-foreground md:flex">
        <div className="border-b border-sidebar-border px-6 py-6">
          <Logo variant="light" />
        </div>

        <nav className="flex-1 space-y-1 px-3 py-6">
          {items.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition-smooth",
                  isActive
                    ? "bg-sidebar-accent text-sidebar-primary"
                    : "text-sidebar-foreground/80 hover:bg-sidebar-accent/60 hover:text-sidebar-primary"
                )
              }
            >
              <item.icon className="h-5 w-5" />
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="border-t border-sidebar-border p-3">
          <button
            onClick={logout}
            className="flex w-full items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium text-sidebar-foreground/80 transition-smooth hover:bg-sidebar-accent/60 hover:text-sidebar-primary"
          >
            <LogOut className="h-5 w-5" />
            Sair
          </button>
        </div>
      </aside>

      {/* Mobile top bar */}
      <div className="flex flex-1 flex-col">
        <header className="flex items-center justify-between border-b border-border bg-sidebar px-4 py-3 text-sidebar-foreground md:hidden">
          <Logo variant="light" />
          <button onClick={logout} className="rounded-md p-2 text-sidebar-foreground/80 hover:text-gold" aria-label="Sair">
            <LogOut className="h-5 w-5" />
          </button>
        </header>

        {/* Mobile bottom nav */}
        <nav className="fixed bottom-0 left-0 right-0 z-40 grid grid-cols-4 border-t border-sidebar-border bg-sidebar text-sidebar-foreground md:hidden">
          {items.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                cn(
                  "flex flex-col items-center justify-center py-2 text-[10px] font-medium",
                  isActive ? "text-sidebar-primary" : "text-sidebar-foreground/70"
                )
              }
            >
              <item.icon className="mb-1 h-5 w-5" />
              {item.label}
            </NavLink>
          ))}
        </nav>

        <main className="flex-1 pb-20 md:pb-0">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
