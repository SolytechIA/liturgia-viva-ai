import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Star, Mail, MessageCircle, Clock, Lock, Send } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Link } from "react-router-dom";
import { Logo } from "@/components/Logo";

type Plano = "gratuito" | "devoto" | "peregrino";

const PLANOS: Record<Plano, { nome: string; preco: string; precoLabel: string }> = {
  gratuito: { nome: "Plano Gratuito", preco: "R$ 0,00", precoLabel: "" },
  devoto: { nome: "Plano Devoto", preco: "R$ 19,90", precoLabel: "/mês" },
  peregrino: { nome: "Plano Peregrino", preco: "R$ 39,90", precoLabel: "/mês" },
};

const HORARIOS = ["6h", "8h", "10h", "12h", "14h", "16h", "18h", "20h", "22h"];

const formatarData = (iso: string | null) => {
  if (!iso) return null;
  return new Date(iso).toLocaleDateString("pt-BR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
};

const MeuPlano = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [savingDados, setSavingDados] = useState(false);

  const [plano, setPlano] = useState<Plano>("gratuito");
  const [nome, setNome] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [telegram, setTelegram] = useState("");
  const [canalEmail, setCanalEmail] = useState(true);
  const [canalTelegram, setCanalTelegram] = useState(false);
  const [canalWhatsapp, setCanalWhatsapp] = useState(false);
  const [horario, setHorario] = useState("8h");
  const [dataCadastro, setDataCadastro] = useState<string | null>(null);
  const [dataProximaCobranca, setDataProximaCobranca] = useState<string | null>(null);

  useEffect(() => {
    const carregar = async () => {
      if (!user) return;
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .maybeSingle();

      if (error) {
        toast.error("Erro ao carregar perfil");
        setLoading(false);
        return;
      }

      if (data) {
        const planoAtual = (data.plano as Plano) || "gratuito";
        setPlano(planoAtual);
        setNome(data.nome || "");
        setWhatsapp(data.whatsapp || "");
        setTelegram(data.telegram_username || "");
        setHorario(HORARIOS.includes(data.horario_envio) ? data.horario_envio : "8h");
        setDataCadastro(data.data_cadastro);
        setDataProximaCobranca(data.data_proxima_cobranca);

        const canais = (data.canal_entrega || "email").split(",").map((c) => c.trim());
        setCanalEmail(canais.includes("email"));
        setCanalTelegram(canais.includes("telegram") && planoAtual !== "gratuito");
        setCanalWhatsapp(canais.includes("whatsapp") && planoAtual === "peregrino");
      }
      setLoading(false);
    };
    carregar();
  }, [user]);

  const diasTrialRestantes = (() => {
    if (plano !== "gratuito" || !dataCadastro) return null;
    const cadastro = new Date(dataCadastro).getTime();
    const dias = Math.floor((Date.now() - cadastro) / (1000 * 60 * 60 * 24));
    return Math.max(0, 7 - dias);
  })();

  const salvarPreferencias = async () => {
    if (!user) return;
    setSaving(true);
    const canais: string[] = [];
    if (canalEmail) canais.push("email");
    if (canalTelegram && plano !== "gratuito") canais.push("telegram");
    if (canalWhatsapp && plano === "peregrino") canais.push("whatsapp");

    const { error } = await supabase
      .from("profiles")
      .update({
        canal_entrega: canais.join(",") || "email",
        horario_envio: horario,
        telegram_username: telegram || null,
        whatsapp: whatsapp || null,
      })
      .eq("id", user.id);

    setSaving(false);
    if (error) {
      toast.error("Erro ao salvar preferências");
    } else {
      toast.success("Preferências salvas!");
    }
  };

  const atualizarDados = async () => {
    if (!user) return;
    setSavingDados(true);
    const { error } = await supabase
      .from("profiles")
      .update({
        nome,
        whatsapp: whatsapp || null,
        telegram_username: telegram || null,
      })
      .eq("id", user.id);
    setSavingDados(false);
    if (error) {
      toast.error("Erro ao atualizar dados");
    } else {
      toast.success("Dados atualizados com sucesso!");
    }
  };

  if (loading) {
    return (
      <div className="container max-w-4xl py-8 md:py-12">
        <p className="text-muted-foreground">Carregando...</p>
      </div>
    );
  }

  const planoInfo = PLANOS[plano];
  const isGratuito = plano === "gratuito";
  const isDevoto = plano === "devoto";
  const isPeregrino = plano === "peregrino";

  return (
    <div className="container max-w-4xl py-8 md:py-12">
      <header className="mb-8 animate-fade-up">
        <h1 className="font-serif text-4xl text-primary md:text-5xl">Meu Plano</h1>
        <p className="mt-2 text-muted-foreground">
          Gerencie sua assinatura e preferências de envio.
        </p>
      </header>

      {/* Plano atual */}
      <Card className="mb-6 border-gold bg-primary p-8 text-primary-foreground shadow-elegant">
        <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
          <div>
            <div className="mb-2 inline-flex items-center gap-2 rounded-full bg-gold/20 px-3 py-1 text-xs uppercase tracking-wider text-gold">
              <Star className="h-3 w-3 fill-current" /> {planoInfo.nome}
            </div>
            {isGratuito && diasTrialRestantes !== null && (
              <div className="mb-2 inline-flex items-center gap-2 rounded-full bg-primary-foreground/15 px-3 py-1 text-xs uppercase tracking-wider md:ml-2">
                Trial 7 dias · {diasTrialRestantes} {diasTrialRestantes === 1 ? "dia restante" : "dias restantes"}
              </div>
            )}
            <h2 className="font-serif text-3xl">
              {planoInfo.preco}
              {planoInfo.precoLabel && (
                <span className="text-base text-primary-foreground/70">
                  {planoInfo.precoLabel}
                </span>
              )}
            </h2>
            {!isGratuito && dataProximaCobranca && (
              <p className="mt-2 text-sm text-primary-foreground/75">
                Próxima cobrança em {formatarData(dataProximaCobranca)}
              </p>
            )}
            {isGratuito && (
              <p className="mt-2 text-sm text-primary-foreground/75">
                Faça upgrade para acesso completo
              </p>
            )}
          </div>
          <div className="flex gap-2">
            <Button variant="gold-outline" asChild>
              <Link to="/assinar">{isGratuito ? "Ver planos" : "Trocar plano"}</Link>
            </Button>
            {!isGratuito && (
              <Button
                variant="ghost"
                className="text-primary-foreground hover:bg-primary-foreground/10"
              >
                Cancelar
              </Button>
            )}
          </div>
        </div>
      </Card>

      {/* Preferências */}
      <Card className="mb-6 border-border p-8 shadow-card">
        <h3 className="mb-6 font-serif text-2xl text-primary">Preferências de envio</h3>

        {isGratuito && (
          <div className="mb-6 rounded-md border border-gold/30 bg-gold/10 p-4 text-sm text-foreground">
            Faça upgrade para personalizar canais e horários de envio.{" "}
            <Link to="/assinar" className="font-medium text-gold-deep underline">
              Ver planos
            </Link>
          </div>
        )}

        <div className="space-y-6">
          {/* E-mail */}
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-start gap-3">
              <Mail className="mt-0.5 h-5 w-5 text-gold-deep" />
              <div>
                <Label className="text-base">E-mail</Label>
                <p className="text-sm text-muted-foreground">
                  Receba a liturgia no seu e-mail
                </p>
              </div>
            </div>
            <Switch
              checked={canalEmail}
              onCheckedChange={setCanalEmail}
              disabled={isGratuito}
            />
          </div>

          {/* Telegram */}
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-start gap-3">
              <Send className="mt-0.5 h-5 w-5 text-gold-deep" />
              <div className="flex-1">
                <Label className="text-base flex items-center gap-2">
                  Telegram {isGratuito && <Lock className="h-3 w-3" />}
                </Label>
                <p className="text-sm text-muted-foreground">
                  {isGratuito
                    ? "Disponível nos planos pagos"
                    : "Receba pelo Telegram"}
                </p>
                {!isGratuito && canalTelegram && (
                  <Input
                    value={telegram}
                    onChange={(e) => setTelegram(e.target.value)}
                    placeholder="@seu_usuario"
                    className="mt-2 max-w-xs"
                  />
                )}
              </div>
            </div>
            <Switch
              checked={canalTelegram}
              onCheckedChange={setCanalTelegram}
              disabled={isGratuito}
            />
          </div>

          {/* WhatsApp */}
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-start gap-3">
              <MessageCircle className="mt-0.5 h-5 w-5 text-gold-deep" />
              <div className="flex-1">
                <Label className="text-base flex items-center gap-2">
                  WhatsApp {!isPeregrino && <Lock className="h-3 w-3" />}
                </Label>
                <p className="text-sm text-muted-foreground">
                  {isPeregrino
                    ? "Receba pelo WhatsApp"
                    : "Disponível no plano Peregrino"}
                </p>
                {isPeregrino && canalWhatsapp && (
                  <Input
                    value={whatsapp}
                    onChange={(e) => setWhatsapp(e.target.value)}
                    placeholder="+55 (11) 99999-9999"
                    className="mt-2 max-w-xs"
                  />
                )}
              </div>
            </div>
            <Switch
              checked={canalWhatsapp}
              onCheckedChange={setCanalWhatsapp}
              disabled={!isPeregrino}
            />
          </div>

          {/* Horário */}
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-start gap-3">
              <Clock className="mt-0.5 h-5 w-5 text-gold-deep" />
              <div>
                <Label className="text-base flex items-center gap-2">
                  Horário de envio {isGratuito && <Lock className="h-3 w-3" />}
                </Label>
                <p className="text-sm text-muted-foreground">
                  {isGratuito
                    ? "Disponível nos planos pagos"
                    : "Quando você quer receber a leitura"}
                </p>
              </div>
            </div>
            <Select value={horario} onValueChange={setHorario} disabled={isGratuito}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {HORARIOS.map((h) => (
                  <SelectItem key={h} value={h}>
                    {h}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <Button
          variant="gold"
          className="mt-8"
          onClick={salvarPreferencias}
          disabled={saving || isGratuito}
        >
          {saving ? "Salvando..." : "Salvar preferências"}
        </Button>
      </Card>

      {/* Conta */}
      <Card className="border-border p-8 shadow-card">
        <h3 className="mb-6 font-serif text-2xl text-primary">Dados da conta</h3>
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <Label htmlFor="name">Nome</Label>
            <Input
              id="name"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              className="mt-1.5"
            />
          </div>
          <div>
            <Label htmlFor="email">E-mail</Label>
            <Input
              id="email"
              type="email"
              value={user?.email || ""}
              disabled
              className="mt-1.5"
            />
            <p className="mt-1 text-xs text-muted-foreground">
              O e-mail não pode ser alterado.
            </p>
          </div>
          <div>
            <Label htmlFor="whatsapp">Telefone / WhatsApp</Label>
            <Input
              id="whatsapp"
              value={whatsapp}
              onChange={(e) => setWhatsapp(e.target.value)}
              placeholder="+55 (11) 99999-9999"
              className="mt-1.5"
            />
          </div>
        </div>
        <Button
          variant="outline"
          className="mt-6"
          onClick={atualizarDados}
          disabled={savingDados}
        >
          {savingDados ? "Atualizando..." : "Atualizar dados"}
        </Button>
      </Card>
    </div>
  );
};

export default MeuPlano;
