import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Logo } from "@/components/Logo";

const HORARIOS = ["6h", "8h", "10h", "12h", "14h", "16h", "18h", "20h", "22h"];
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

const formatWhatsApp = (v: string) => {
  const digits = v.replace(/\D/g, "").slice(0, 13);
  if (!digits) return "";
  let out = "+55 ";
  const rest = digits.startsWith("55") ? digits.slice(2) : digits;
  if (rest.length <= 2) out += `(${rest}`;
  else if (rest.length <= 7) out += `(${rest.slice(0, 2)}) ${rest.slice(2)}`;
  else out += `(${rest.slice(0, 2)}) ${rest.slice(2, 7)}-${rest.slice(7, 11)}`;
  return out;
};

const BemVindo = () => {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const [loading, setLoading] = useState(false);
  const [nome, setNome] = useState("");
  const [horario, setHorario] = useState("8h");
  const [canal, setCanal] = useState("email");
  const [whatsapp, setWhatsapp] = useState("");
  const [telegram, setTelegram] = useState("");

  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      navigate("/login");
      return;
    }
    supabase
      .from("profiles")
      .select("nome, horario_envio, canal_entrega, whatsapp, telegram_username")
      .eq("id", user.id)
      .maybeSingle()
      .then(({ data }) => {
        if (data?.nome) setNome(data.nome);
        if (data?.horario_envio) setHorario(data.horario_envio);
        if (data?.canal_entrega) setCanal(data.canal_entrega);
        if (data?.whatsapp) setWhatsapp(data.whatsapp);
        if (data?.telegram_username) setTelegram(data.telegram_username);
      });
  }, [authLoading, user, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    if (!nome.trim()) {
      toast.error("Por favor, informe seu nome.");
      return;
    }
    setLoading(true);
    const { error } = await supabase
      .from("profiles")
      .update({
        nome: nome.trim(),
        horario_envio: horario,
        canal_entrega: canal,
        whatsapp: whatsapp || null,
        telegram_username: telegram || null,
      })
      .eq("id", user.id);
    setLoading(false);

    if (error) {
      toast.error("Erro ao salvar: " + error.message);
      return;
    }
    toast.success("Tudo pronto! Que sua jornada seja abençoada.");
    navigate("/dashboard");
  };

  return (
    <div className="flex min-h-screen flex-col bg-gradient-warm">
      <div className="container flex flex-1 items-center justify-center py-12">
        <Card className="w-full max-w-xl border-gold/20 p-8 shadow-elegant md:p-10">
          <div className="mb-6 flex justify-center">
            <Logo />
          </div>

          <h1 className="text-center font-serif text-3xl text-primary">Bem-vindo(a)!</h1>
          <p className="mt-2 text-center text-sm text-muted-foreground">
            Personalize como deseja receber a Palavra todos os dias
          </p>

          <form onSubmit={handleSubmit} className="mt-8 space-y-6">
            <div>
              <Label htmlFor="nome">Nome completo</Label>
              <Input
                id="nome"
                placeholder="Seu nome"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                required
                maxLength={100}
                className="mt-1.5"
              />
            </div>

            <div>
              <Label className="mb-3 block">Horário preferido</Label>
              <RadioGroup value={horario} onValueChange={setHorario} className="grid grid-cols-2 gap-3">
                <label className="flex cursor-pointer items-center gap-3 rounded-md border border-border p-3 hover:border-gold">
                  <RadioGroupItem value="manha" id="h-manha" />
                  <div>
                    <div className="font-medium">Manhã</div>
                    <div className="text-xs text-muted-foreground">6h às 8h</div>
                  </div>
                </label>
                <label className="flex cursor-pointer items-center gap-3 rounded-md border border-border p-3 hover:border-gold">
                  <RadioGroupItem value="tarde" id="h-tarde" />
                  <div>
                    <div className="font-medium">Tarde</div>
                    <div className="text-xs text-muted-foreground">12h</div>
                  </div>
                </label>
              </RadioGroup>
            </div>

            <div>
              <Label className="mb-3 block">Canal preferido</Label>
              <RadioGroup value={canal} onValueChange={setCanal} className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                {[
                  { v: "email", l: "E-mail" },
                  { v: "whatsapp", l: "WhatsApp" },
                  { v: "telegram", l: "Telegram" },
                  { v: "todos", l: "Todos" },
                ].map((c) => (
                  <label key={c.v} className="flex cursor-pointer items-center gap-2 rounded-md border border-border p-3 hover:border-gold">
                    <RadioGroupItem value={c.v} id={`c-${c.v}`} />
                    <span className="text-sm font-medium">{c.l}</span>
                  </label>
                ))}
              </RadioGroup>
            </div>

            <div>
              <Label htmlFor="whatsapp">WhatsApp (opcional)</Label>
              <Input
                id="whatsapp"
                placeholder="+55 (11) 99999-9999"
                value={whatsapp}
                onChange={(e) => setWhatsapp(formatWhatsApp(e.target.value))}
                className="mt-1.5"
              />
            </div>

            <div>
              <Label htmlFor="telegram">Telegram (opcional)</Label>
              <Input
                id="telegram"
                placeholder="@seu_usuario"
                value={telegram}
                onChange={(e) => setTelegram(e.target.value)}
                maxLength={64}
                className="mt-1.5"
              />
            </div>

            <Button type="submit" variant="gold" size="lg" className="w-full" disabled={loading}>
              {loading ? "Salvando..." : "Começar minha jornada"}
            </Button>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default BemVindo;
