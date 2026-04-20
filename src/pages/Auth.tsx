import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Logo } from "@/components/Logo";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

interface AuthFormProps {
  mode: "login" | "signup";
}

export const AuthForm = ({ mode }: AuthFormProps) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [resetMode, setResetMode] = useState(false);

  const isSignup = mode === "signup";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (resetMode) {
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: `${window.location.origin}/reset-password`,
        });
        if (error) throw error;
        toast.success("Enviamos um link de recuperação para seu e-mail.");
        setResetMode(false);
      } else if (isSignup) {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: { emailRedirectTo: `${window.location.origin}/bem-vindo` },
        });
        if (error) throw error;
        toast.success("Conta criada! Vamos personalizar sua jornada.");
        navigate("/bem-vindo");
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        toast.success("Bem-vindo(a) de volta!");
        navigate("/dashboard");
      }
    } catch (err: any) {
      const msg = err?.message || "Erro inesperado";
      if (msg.includes("Invalid login")) toast.error("E-mail ou senha incorretos.");
      else if (msg.includes("already registered")) toast.error("Este e-mail já está cadastrado.");
      else toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-gradient-warm">
      <div className="container flex flex-1 items-center justify-center py-12">
        <Card className="w-full max-w-md border-gold/20 p-8 shadow-elegant md:p-10">
          <Link to="/" className="mb-8 flex justify-center">
            <Logo />
          </Link>

          <h1 className="text-center font-serif text-3xl text-primary">
            {resetMode ? "Recuperar senha" : isSignup ? "Criar conta" : "Bem-vindo de volta"}
          </h1>
          <p className="mt-2 text-center text-sm text-muted-foreground">
            {resetMode
              ? "Informe seu e-mail para receber o link"
              : isSignup
              ? "Comece sua jornada diária com a Palavra"
              : "Continue sua caminhada espiritual"}
          </p>

          <form onSubmit={handleSubmit} className="mt-8 space-y-4">
            <div>
              <Label htmlFor="email">E-mail</Label>
              <Input
                id="email"
                type="email"
                placeholder="seu@email.com"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1.5"
              />
            </div>
            {!resetMode && (
              <div>
                <Label htmlFor="password">Senha</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  required
                  minLength={6}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="mt-1.5"
                />
              </div>
            )}

            <Button type="submit" variant="gold" size="lg" className="w-full" disabled={loading}>
              {loading ? "Aguarde..." : resetMode ? "Enviar link" : isSignup ? "Criar conta" : "Entrar"}
            </Button>

            {!isSignup && !resetMode && (
              <button
                type="button"
                onClick={() => setResetMode(true)}
                className="block w-full text-center text-sm text-gold-deep hover:underline"
              >
                Esqueci minha senha
              </button>
            )}
            {resetMode && (
              <button
                type="button"
                onClick={() => setResetMode(false)}
                className="block w-full text-center text-sm text-muted-foreground hover:underline"
              >
                Voltar ao login
              </button>
            )}
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
