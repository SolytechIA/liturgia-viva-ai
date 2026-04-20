import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Logo } from "@/components/Logo";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

const ResetPassword = () => {
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.updateUser({ password });
    setLoading(false);
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success("Senha atualizada com sucesso!");
    navigate("/dashboard");
  };

  return (
    <div className="flex min-h-screen flex-col bg-gradient-warm">
      <div className="container flex flex-1 items-center justify-center py-12">
        <Card className="w-full max-w-md border-gold/20 p-8 shadow-elegant md:p-10">
          <div className="mb-8 flex justify-center"><Logo /></div>
          <h1 className="text-center font-serif text-3xl text-primary">Nova senha</h1>
          <p className="mt-2 text-center text-sm text-muted-foreground">Defina sua nova senha de acesso</p>
          <form onSubmit={handleSubmit} className="mt-8 space-y-4">
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
            <Button type="submit" variant="gold" size="lg" className="w-full" disabled={loading}>
              {loading ? "Salvando..." : "Atualizar senha"}
            </Button>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default ResetPassword;
