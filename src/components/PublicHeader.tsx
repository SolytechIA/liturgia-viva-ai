import { Link, NavLink } from "react-router-dom";
import { Menu, X, User, LogOut } from "lucide-react";
import { useState } from "react";
import { Logo } from "@/components/Logo";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";

const links = [
  { to: "/", label: "Início" },
  { to: "/como-funciona", label: "Como Funciona" },
  { to: "/assinar", label: "Assinar" },
  { to: "/sobre", label: "Sobre" },
];

export const PublicHeader = () => {
  const [open, setOpen] = useState(false);
  const { user, signOut } = useAuth();

  const handleSignOut = async () => {
    await signOut();
    toast.success("Você saiu. Até breve!");
    setOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/60 bg-background/85 backdrop-blur-md">
      <div className="container flex h-20 items-center justify-between">
        <Link to="/" aria-label="Liturgia Viva — Início">
          <Logo />
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              end={l.to === "/"}
              className={({ isActive }) =>
                cn(
                  "text-sm font-medium transition-smooth hover:text-gold",
                  isActive ? "text-primary" : "text-muted-foreground"
                )
              }
            >
              {l.label}
            </NavLink>
          ))}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          {user ? (
            <>
              <Button asChild variant="ghost" size="sm">
                <Link to="/dashboard/plano"><User className="h-4 w-4" /> Meu Perfil</Link>
              </Button>
              <Button variant="gold" size="sm" onClick={handleSignOut}>
                <LogOut className="h-4 w-4" /> Sair
              </Button>
            </>
          ) : (
            <>
              <Button asChild variant="ghost" size="sm">
                <Link to="/login">Entrar</Link>
              </Button>
              <Button asChild variant="gold" size="sm">
                <Link to="/cadastro">Começar agora</Link>
              </Button>
            </>
          )}
        </div>

        <button
          className="inline-flex h-10 w-10 items-center justify-center rounded-md text-primary md:hidden"
          aria-label="Abrir menu"
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {open && (
        <div className="border-t border-border bg-background md:hidden">
          <nav className="container flex flex-col py-4">
            {links.map((l) => (
              <NavLink
                key={l.to}
                to={l.to}
                end={l.to === "/"}
                onClick={() => setOpen(false)}
                className={({ isActive }) =>
                  cn(
                    "py-3 text-sm font-medium",
                    isActive ? "text-primary" : "text-muted-foreground"
                  )
                }
              >
                {l.label}
              </NavLink>
            ))}
            <div className="mt-2 flex gap-2">
              {user ? (
                <>
                  <Button asChild variant="outline" size="sm" className="flex-1">
                    <Link to="/dashboard/plano" onClick={() => setOpen(false)}>Meu Perfil</Link>
                  </Button>
                  <Button variant="gold" size="sm" className="flex-1" onClick={handleSignOut}>Sair</Button>
                </>
              ) : (
                <>
                  <Button asChild variant="outline" size="sm" className="flex-1">
                    <Link to="/login" onClick={() => setOpen(false)}>Entrar</Link>
                  </Button>
                  <Button asChild variant="gold" size="sm" className="flex-1">
                    <Link to="/cadastro" onClick={() => setOpen(false)}>Começar agora</Link>
                  </Button>
                </>
              )}
            </div>
          </nav>
        </div>
      )}
    </header>
  );
};
