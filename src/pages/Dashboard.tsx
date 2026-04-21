import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Lock, Sparkles, ArrowRight, BookOpen, Clock, Settings } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { formatTodayLongBR } from "@/lib/dateUtils";

type Profile = {
  nome: string | null;
  plano: string;
  data_cadastro: string;
  horario_envio: string;
  canal_entrega: string;
};

const greeting = () => {
  const h = new Date().getHours();
  if (h < 12) return "Bom dia";
  if (h < 18) return "Boa tarde";
  return "Boa noite";
};

const CANAL_LABEL: Record<string, string> = {
  email: "E-mail",
  whatsapp: "WhatsApp",
  telegram: "Telegram",
  todos: "todos os canais",
  bloqueado: "—",
};

const todayLabel = formatTodayLongBR();

const Dashboard = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState<Profile | null>(null);

  useEffect(() => {
    if (!user) return;
    supabase
      .from("profiles")
      .select("nome, plano, data_cadastro, horario_envio, canal_entrega")
      .eq("id", user.id)
      .maybeSingle()
      .then(({ data }) => {
        if (data) setProfile(data);
      });
  }, [user]);

  const PLANOS_VALIDOS = ["gratuito", "devoto", "peregrino"];
  const planoRaw = profile?.plano || "gratuito";
  const plano = PLANOS_VALIDOS.includes(planoRaw) ? planoRaw : "gratuito";
  const isGratuito = plano === "gratuito";

  const diasDesdeCadastro = profile
    ? Math.floor((Date.now() - new Date(profile.data_cadastro).getTime()) / 86_400_000)
    : 0;
  const diasTrialRestantes = isGratuito ? Math.max(0, 7 - diasDesdeCadastro) : null;
  const trialAtivo = isGratuito && diasDesdeCadastro < 7;
  const trialExpirado = isGratuito && diasTrialRestantes !== null && diasTrialRestantes === 0;
  const podeVerReflexao = !isGratuito || trialAtivo;

  const firstName = (profile?.nome || "").split(" ")[0] || "irmão(ã)";

  const HORARIOS_VALIDOS = ["6h","8h","10h","12h","14h","16h","18h","20h","22h"];
  const horarioExibido = HORARIOS_VALIDOS.includes(profile?.horario_envio || "")
    ? profile!.horario_envio
    : "8h";
  const canalKey = profile?.canal_entrega || "email";
  const canalExibido = CANAL_LABEL[canalKey] || "E-mail";

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

      {/* Banner trial expirado */}
      {trialExpirado && (
        <Card className="mb-6 border-gold/40 bg-gold/10 p-5">
          <div className="flex flex-col items-start justify-between gap-3 md:flex-row md:items-center">
            <div>
              <p className="font-serif text-lg text-primary">Seu período de teste encerrou</p>
              <p className="text-sm text-muted-foreground">
                Faça upgrade para continuar recebendo a Palavra com reflexões diárias.
              </p>
            </div>
            <Button asChild variant="gold">
              <Link to="/assinar">
                Ver planos <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </Card>
      )}

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

      {/* Próximo envio (somente leitura) */}
      <Card className="border-border p-6 shadow-card">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex items-start gap-3">
            <div className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gold/15 text-gold-deep">
              <Clock className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-serif text-lg text-primary">Próximo envio</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                Você receberá às <span className="font-medium text-foreground">{horarioExibido}</span>{" "}
                via <span className="font-medium text-foreground">{canalExibido}</span>.
              </p>
            </div>
          </div>
          <Button asChild variant="outline" size="sm">
            <Link to="/dashboard/plano">
              <Settings className="h-4 w-4" /> Alterar preferências
            </Link>
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default Dashboard;
