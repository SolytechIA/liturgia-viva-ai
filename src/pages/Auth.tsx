import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Logo } from "@/components/Logo";
import { toast } from "sonner";

interface AuthFormProps {
  mode: "login" | "signup";
}

export const AuthForm = ({ mode }: AuthFormProps) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const isSignup = mode === "signup";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Placeholder visual — autenticação real será conectada na próxima etapa.
    setTimeout(() => {
      setLoading(false);
      toast.success(isSignup ? "Conta criada! Bem-vindo(a)." : "Bem-vindo(a) de volta!");
      navigate("/dashboard");
    }, 600);
  };

  return (
    <div className="flex min-h-screen flex-col bg-gradient-warm">
      <div className="container flex flex-1 items-center justify-center py-12">
        <Card className="w-full max-w-md border-gold/20 p-8 shadow-elegant md:p-10">
          <Link to="/" className="mb-8 flex justify-center">
            <Logo />
          </Link>

          <h1 className="text-center font-serif text-3xl text-primary">
            {isSignup ? "Criar conta" : "Bem-vindo de volta"}
          </h1>
          <p className="mt-2 text-center text-sm text-muted-foreground">
            {isSignup
              ? "Comece sua jornada diária com a Palavra"
              : "Continue sua caminhada espiritual"}
          </p>

          <form onSubmit={handleSubmit} className="mt-8 space-y-4">
            {isSignup && (
              <div>
                <Label htmlFor="name">Nome</Label>
                <Input id="name" placeholder="Seu nome" required className="mt-1.5" />
              </div>
            )}
            <div>
              <Label htmlFor="email">E-mail</Label>
              <Input id="email" type="email" placeholder="seu@email.com" required className="mt-1.5" />
            </div>
            <div>
              <Label htmlFor="password">Senha</Label>
              <Input id="password" type="password" placeholder="••••••••" required minLength={6} className="mt-1.5" />
            </div>

            <Button type="submit" variant="gold" size="lg" className="w-full" disabled={loading}>
              {loading ? "Aguarde..." : isSignup ? "Criar conta" : "Entrar"}
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-muted-foreground">
            {isSignup ? (
              <>Já tem conta? <Link to="/login" className="font-medium text-gold-deep hover:underline">Entrar</Link></>
            ) : (
              <>Novo por aqui? <Link to="/cadastro" className="font-medium text-gold-deep hover:underline">Criar conta</Link></>
            )}
          </p>
        </Card>
      </div>
    </div>
  );
};

export const Login = () => <AuthForm mode="login" />;
export const Cadastro = () => <AuthForm mode="signup" />;
