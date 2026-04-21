import { useEffect, useState } from "react";
import { NavLink, Outlet, useNavigate, Navigate, Link } from "react-router-dom";
import { Home, Cross, BookOpen, Star, LogOut, Shield } from "lucide-react";
import { Logo } from "@/components/Logo";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";

const baseItems = [
  { to: "/dashboard", label: "Início", icon: Home, end: true },
  { to: "/dashboard/leitura", label: "Leitura do Dia", icon: Cross },
  { to: "/dashboard/arquivo", label: "Arquivo", icon: BookOpen },
  { to: "/dashboard/plano", label: "Meu Plano", icon: Star },
];

export const PrivateLayout = () => {
  const navigate = useNavigate();
  const { user, loading, signOut } = useAuth();
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    if (!user) return;
    supabase
      .from("profiles")
      .select("is_admin")
      .eq("id", user.id)
      .maybeSingle()
      .then(({ data }) => setIsAdmin(!!data?.is_admin));
  }, [user]);

  const items = isAdmin
    ? [...baseItems, { to: "/admin", label: "Painel Admin", icon: Shield, end: false }]
    : baseItems;

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-surface">
        <div className="text-muted-foreground">Carregando...</div>
      </div>
    );
  }

  if (!user) return <Navigate to="/login" replace />;

  const logout = async () => {
    await signOut();
    toast.success("Você saiu. Até breve!");
    navigate("/");
  };

  return (
    <div className="flex min-h-screen bg-surface">
      {/* Sidebar */}
      <aside className="hidden w-64 shrink-0 flex-col bg-sidebar text-sidebar-foreground md:flex">
        <div className="border-b border-sidebar-border px-6 py-6">
          <Link to="/" aria-label="Liturgia Viva — Início">
            <Logo variant="light" />
          </Link>
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

          <div className="mt-4 border-t border-sidebar-border/50 pt-4">
            <button
              onClick={logout}
              className="flex w-full items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium text-sidebar-foreground/80 transition-smooth hover:bg-sidebar-accent/60 hover:text-sidebar-primary"
            >
              <LogOut className="h-5 w-5" />
              Sair
            </button>
          </div>
        </nav>
      </aside>

      {/* Mobile top bar */}
      <div className="flex flex-1 flex-col">
        <header className="flex items-center justify-between border-b border-border bg-sidebar px-4 py-3 text-sidebar-foreground md:hidden">
          <Link to="/" aria-label="Liturgia Viva — Início">
            <Logo variant="light" />
          </Link>
          <button onClick={logout} className="rounded-md p-2 text-sidebar-foreground/80 hover:text-gold" aria-label="Sair">
            <LogOut className="h-5 w-5" />
          </button>
        </header>

        {/* Mobile bottom nav */}
        <nav className={cn("fixed bottom-0 left-0 right-0 z-40 grid border-t border-sidebar-border bg-sidebar text-sidebar-foreground md:hidden", isAdmin ? "grid-cols-5" : "grid-cols-4")}>
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
