import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Lock, Sparkles, ArrowRight, BookOpen } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

type Profile = {
  nome: string | null;
  plano: string;
  data_cadastro: string;
  horario_envio: string;
  canal_entrega: string;
  whatsapp: string | null;
  telegram_username: string | null;
};

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

const greeting = () => {
  const h = new Date().getHours();
  if (h < 12) return "Bom dia";
  if (h < 18) return "Boa tarde";
  return "Boa noite";
};

const todayLabel = new Date().toLocaleDateString("pt-BR", {
  weekday: "long",
  day: "numeric",
  month: "long",
  year: "numeric",
});

const Dashboard = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [saving, setSaving] = useState(false);

  // form state
  const [horario, setHorario] = useState("8h");
  const [canal, setCanal] = useState("email");
  const [telegram, setTelegram] = useState("");
  const [whatsapp, setWhatsapp] = useState("");

  useEffect(() => {
    if (!user) return;
    supabase
      .from("profiles")
      .select("nome, plano, data_cadastro, horario_envio, canal_entrega, whatsapp, telegram_username")
      .eq("id", user.id)
      .maybeSingle()
      .then(({ data }) => {
        if (data) {
          setProfile(data);
          setHorario(data.horario_envio || "8h");
          setCanal(data.canal_entrega || "email");
          setTelegram(data.telegram_username || "");
          setWhatsapp(data.whatsapp || "");
        }
      });
  }, [user]);

  const PLANOS_VALIDOS = ["gratuito", "devoto", "peregrino"];
  const planoRaw = profile?.plano || "gratuito";
  const plano = PLANOS_VALIDOS.includes(planoRaw) ? planoRaw : "gratuito";
  const isGratuito = plano === "gratuito";
  const isPeregrino = plano === "peregrino";
  const isPaid = !isGratuito;

  // dias desde cadastro (regra dos 7 dias do gratuito)
  const diasDesdeCadastro = profile
    ? Math.floor((Date.now() - new Date(profile.data_cadastro).getTime()) / 86_400_000)
    : 0;
  const diasTrialRestantes = isGratuito ? Math.max(0, 7 - diasDesdeCadastro) : null;
  const trialAtivo = isGratuito && diasDesdeCadastro < 7;
  const trialExpirado = isGratuito && diasTrialRestantes !== null && diasTrialRestantes === 0;
  const podeVerReflexao = !isGratuito || trialAtivo;

  // Bloqueia automaticamente o canal quando o trial expira
  useEffect(() => {
    if (!user || !profile) return;
    if (trialExpirado && profile.canal_entrega !== "bloqueado") {
      supabase
        .from("profiles")
        .update({ canal_entrega: "bloqueado" })
        .eq("id", user.id)
        .then(() => setCanal("bloqueado"));
    }
  }, [trialExpirado, user, profile]);

  const firstName = (profile?.nome || "").split(" ")[0] || "irmão(ã)";

  const savePrefs = async () => {
    if (!user) return;
    setSaving(true);
    const { error } = await supabase
      .from("profiles")
      .update({
        horario_envio: horario,
        canal_entrega: canal,
        telegram_username: telegram || null,
        whatsapp: whatsapp || null,
      })
      .eq("id", user.id);
    setSaving(false);
    if (error) toast.error("Erro ao salvar: " + error.message);
    else toast.success("Preferências salvas!");
  };

  return (
    <div className="container py-8 md:py-12">
      {/* Saudação */}
      <div className="mb-8 animate-fade-up">
        <p className="text-xs uppercase tracking-[0.22em] text-gold-deep">{todayLabel} · Tempo Comum</p>
        <h1 className="mt-2 font-serif text-4xl text-primary md:text-5xl">
          {greeting()}, {firstName}! <span className="text-gold-deep">✝️</span>
        </h1>
        <p className="mt-2 text-muted-foreground">
          Que a Palavra ilumine seu dia.
        </p>
      </div>

      {/* Leitura de Hoje */}
      <Card className="mb-8 overflow-hidden border-gold/20 bg-primary text-primary-foreground shadow-elegant">
        <div className="p-8 md:p-10">
          <p className="text-xs uppercase tracking-[0.22em] text-gold">Leitura de hoje</p>
          <h2 className="mt-3 font-serif text-3xl md:text-4xl">Evangelho segundo São João</h2>
          <p className="mt-1 text-sm text-primary-foreground/70">Jo 2, 1-11</p>

          <div className="mt-6 rounded-md border border-gold/20 bg-primary-glow/30 p-5">
            <p className="scripture text-base italic leading-relaxed text-primary-foreground/90 md:text-lg">
              "Naquele tempo, houve um casamento em Caná da Galileia. A mãe de
              Jesus estava presente. Também Jesus e seus discípulos haviam sido
              convidados para o casamento…"
            </p>
            <p className="mt-3 text-xs text-primary-foreground/60">
              (Texto completo em breve, conforme a fonte litúrgica oficial.)
            </p>
          </div>

          {/* Reflexão IA */}
          {podeVerReflexao ? (
            <div className="mt-6">
              <div className="mb-2 flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-gold" />
                <h3 className="font-serif text-lg text-gold">Reflexão com IA</h3>
              </div>
              <p className="text-sm leading-relaxed text-primary-foreground/85">
                Maria intercede com delicadeza, e Jesus revela sua glória. O
                primeiro sinal acontece numa festa, lembrando que a presença
                de Cristo transforma o ordinário em graça abundante.
                {trialAtivo && (
                  <span className="mt-2 block text-xs text-gold">
                    ✨ Você está no período de avaliação ({7 - diasDesdeCadastro} dias restantes).
                  </span>
                )}
              </p>
            </div>
          ) : (
            <div className="mt-6 rounded-md border border-gold/30 bg-background/10 p-5 text-center">
              <Lock className="mx-auto mb-2 h-6 w-6 text-gold" />
              <p className="text-sm text-primary-foreground/90">
                {trialExpirado
                  ? "Seu período de teste encerrou. Faça upgrade para continuar recebendo reflexões com IA."
                  : "Faça upgrade para continuar recebendo reflexões com IA ✨"}
              </p>
              <Button asChild variant="gold" size="sm" className="mt-4">
                <Link to="/assinar">
                  Ver planos <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </Button>
            </div>
          )}

          <Button asChild variant="gold-outline" size="lg" className="mt-6">
            <Link to="/dashboard/leitura">
              <BookOpen className="h-4 w-4" /> Abrir leitura completa
            </Link>
          </Button>
        </div>
      </Card>

      {/* Preferências de Envio */}
      <Card className="relative border-border p-8 shadow-card">
        <div className="mb-6">
          <h3 className="font-serif text-2xl text-primary">Preferências de envio</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            Escolha quando e onde quer receber a Palavra todos os dias.
          </p>
        </div>

        <div className={cn("space-y-6", isGratuito && "pointer-events-none select-none opacity-40 blur-[2px]")}>
          <div>
            <Label className="mb-3 block">Horário de envio</Label>
            <RadioGroup value={horario} onValueChange={setHorario} className="grid grid-cols-3 gap-3 md:grid-cols-5">
              {["6h","8h","10h","12h","14h","16h","18h","20h","22h"].map((h) => (
                <label key={h} className="flex cursor-pointer items-center justify-center gap-2 rounded-md border border-border p-3 hover:border-gold">
                  <RadioGroupItem value={h} id={`h-${h}`} />
                  <span className="text-sm font-medium">{h}</span>
                </label>
              ))}
            </RadioGroup>
          </div>

          <div>
            <Label className="mb-3 block">Canal de envio</Label>
            <RadioGroup value={canal} onValueChange={setCanal} className="grid grid-cols-1 gap-3 sm:grid-cols-3">
              <label className="flex cursor-pointer items-center gap-2 rounded-md border border-border p-3 hover:border-gold">
                <RadioGroupItem value="email" id="c-email" />
                <span className="text-sm font-medium">E-mail</span>
              </label>
              <label className="flex cursor-pointer items-center gap-2 rounded-md border border-border p-3 hover:border-gold">
                <RadioGroupItem value="telegram" id="c-telegram" />
                <span className="text-sm font-medium">Telegram</span>
              </label>
              <label
                className={cn(
                  "flex cursor-pointer items-center gap-2 rounded-md border border-border p-3 hover:border-gold",
                  !isPeregrino && "cursor-not-allowed opacity-50"
                )}
              >
                <RadioGroupItem value="whatsapp" id="c-whatsapp" disabled={!isPeregrino} />
                <span className="text-sm font-medium">WhatsApp</span>
                {!isPeregrino && <Lock className="ml-auto h-3.5 w-3.5 text-muted-foreground" />}
              </label>
            </RadioGroup>
            {!isPeregrino && (
              <p className="mt-2 text-xs text-muted-foreground">
                WhatsApp disponível apenas no plano Peregrino.
              </p>
            )}
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <Label htmlFor="telegram-pref">Usuário do Telegram</Label>
              <Input
                id="telegram-pref"
                placeholder="@seu_usuario"
                value={telegram}
                onChange={(e) => setTelegram(e.target.value)}
                maxLength={64}
                className="mt-1.5"
              />
            </div>
            {isPeregrino && (
              <div>
                <Label htmlFor="whatsapp-pref">WhatsApp</Label>
                <Input
                  id="whatsapp-pref"
                  placeholder="+55 (11) 99999-9999"
                  value={whatsapp}
                  onChange={(e) => setWhatsapp(formatWhatsApp(e.target.value))}
                  className="mt-1.5"
                />
              </div>
            )}
          </div>

          <Button onClick={savePrefs} variant="gold" disabled={saving}>
            {saving ? "Salvando..." : "Salvar preferências"}
          </Button>
        </div>

        {/* Overlay para gratuito */}
        {isGratuito && (
          <div className="absolute inset-0 flex flex-col items-center justify-center rounded-lg bg-background/60 p-6 text-center backdrop-blur-sm">
            <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-gold/15 text-gold-deep">
              <Lock className="h-6 w-6" />
            </div>
            <p className="mt-4 max-w-sm font-serif text-lg text-primary">
              Personalize seu envio fazendo upgrade para Devoto
            </p>
            <Button asChild variant="gold" className="mt-5">
              <Link to="/assinar">
                Ver planos <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        )}
      </Card>
    </div>
  );
};

export default Dashboard;
