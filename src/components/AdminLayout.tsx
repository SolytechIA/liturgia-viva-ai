import { useEffect, useState } from "react";
import { NavLink, Outlet, useNavigate, Navigate, Link } from "react-router-dom";
import { LayoutDashboard, Users, DollarSign, LogOut } from "lucide-react";
import { Logo } from "@/components/Logo";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";

const items = [
  { to: "/admin", label: "Dashboard Admin", icon: LayoutDashboard, end: true },
  { to: "/admin/usuarios", label: "Usuários", icon: Users },
  { to: "/admin/financeiro", label: "Financeiro", icon: DollarSign },
];

export const AdminLayout = () => {
  const navigate = useNavigate();
  const { user, loading, signOut } = useAuth();
  const [checking, setChecking] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    if (loading) return;
    if (!user) {
      setChecking(false);
      return;
    }
    (async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("is_admin")
        .eq("id", user.id)
        .maybeSingle();
      if (error) {
        console.error(error);
        setIsAdmin(false);
      } else {
        setIsAdmin(!!data?.is_admin);
      }
      setChecking(false);
    })();
  }, [user, loading]);

  if (loading || checking) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-surface">
        <div className="text-muted-foreground">Carregando...</div>
      </div>
    );
  }

  if (!user) return <Navigate to="/login" replace />;
  if (!isAdmin) return <Navigate to="/dashboard" replace />;

  const sairAdmin = () => {
    navigate("/dashboard");
  };

  const logout = async () => {
    await signOut();
    toast.success("Você saiu. Até breve!");
    navigate("/");
  };

  return (
    <div className="flex min-h-screen bg-surface">
      <aside className="hidden w-64 shrink-0 flex-col bg-sidebar text-sidebar-foreground md:flex">
        <div className="border-b border-sidebar-border px-6 py-6">
          <Link to="/" aria-label="Liturgia Viva — Início">
            <Logo variant="light" />
          </Link>
          <p className="mt-2 text-[11px] uppercase tracking-[0.18em] text-gold">Admin</p>
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

        <div className="space-y-1 border-t border-sidebar-border p-3">
          <button
            onClick={sairAdmin}
            className="flex w-full items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium text-sidebar-foreground/80 transition-smooth hover:bg-sidebar-accent/60 hover:text-sidebar-primary"
          >
            <LogOut className="h-5 w-5" />
            Sair do Admin
          </button>
          <button
            onClick={logout}
            className="flex w-full items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium text-sidebar-foreground/60 transition-smooth hover:bg-sidebar-accent/60 hover:text-sidebar-primary"
          >
            <LogOut className="h-5 w-5" />
            Logout completo
          </button>
        </div>
      </aside>

      <div className="flex flex-1 flex-col">
        <header className="flex items-center justify-between border-b border-border bg-sidebar px-4 py-3 text-sidebar-foreground md:hidden">
          <Link to="/" aria-label="Liturgia Viva — Início">
            <Logo variant="light" />
          </Link>
          <button onClick={sairAdmin} className="rounded-md p-2 text-sidebar-foreground/80 hover:text-gold" aria-label="Sair do Admin">
            <LogOut className="h-5 w-5" />
          </button>
        </header>

        <nav className="fixed bottom-0 left-0 right-0 z-40 grid grid-cols-3 border-t border-sidebar-border bg-sidebar text-sidebar-foreground md:hidden">
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
