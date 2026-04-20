import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export type AdminProfile = {
  id: string;
  nome: string | null;
  plano: string;
  status_assinatura: string;
  data_cadastro: string;
  data_proxima_cobranca: string | null;
  whatsapp: string | null;
  telegram_username: string | null;
  canal_entrega: string;
  horario_envio: string;
  is_admin: boolean;
  email?: string | null;
};

const PRICES: Record<string, number> = {
  gratuito: 0,
  devoto: 19.9,
  peregrino: 39.9,
};

const normalizePlan = (p: string | null | undefined) => {
  const v = (p ?? "gratuito").toLowerCase();
  return ["gratuito", "devoto", "peregrino"].includes(v) ? v : "gratuito";
};

export const useAdminProfiles = () => {
  const [profiles, setProfiles] = useState<AdminProfile[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = async () => {
    setLoading(true);
    setError(null);
    try {
      // Try to fetch via edge function (gets emails too)
      const { data: fnData, error: fnErr } = await supabase.functions.invoke("admin-list-users");
      if (!fnErr && fnData?.users) {
        setProfiles(fnData.users as AdminProfile[]);
      } else {
        // Fallback: profiles only
        const { data, error: pErr } = await supabase
          .from("profiles")
          .select("*")
          .order("data_cadastro", { ascending: false });
        if (pErr) throw pErr;
        setProfiles((data ?? []) as AdminProfile[]);
      }
    } catch (e: any) {
      setError(e.message ?? String(e));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refresh();
  }, []);

  return { profiles, loading, error, refresh };
};

export const formatBRL = (v: number) =>
  v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

export const getPlanPrice = (plan: string) => PRICES[normalizePlan(plan)];

export const computeMetrics = (profiles: AdminProfile[]) => {
  const now = Date.now();
  const SEVEN_DAYS = 7 * 24 * 60 * 60 * 1000;

  let total = 0;
  const porPlano = { gratuito: 0, devoto: 0, peregrino: 0 };
  let trialsAtivos = 0;
  let trialsExpirados = 0;
  let pagantes = 0;
  let cancelamentos = 0;
  let cancelamentosNoMes = 0;

  const monthStart = new Date();
  monthStart.setDate(1);
  monthStart.setHours(0, 0, 0, 0);

  for (const p of profiles) {
    total++;
    const plano = normalizePlan(p.plano);
    porPlano[plano as keyof typeof porPlano]++;

    if (plano === "gratuito") {
      const cadastro = new Date(p.data_cadastro).getTime();
      const idade = now - cadastro;
      if (idade < SEVEN_DAYS) trialsAtivos++;
      else trialsExpirados++;
    } else {
      pagantes++;
    }

    if (p.status_assinatura === "cancelado") {
      cancelamentos++;
      // Use data_cadastro as proxy when no canceled-at column exists
      const ts = new Date(p.data_cadastro).getTime();
      if (ts >= monthStart.getTime()) cancelamentosNoMes++;
    }
  }

  const mrr =
    porPlano.devoto * PRICES.devoto + porPlano.peregrino * PRICES.peregrino;

  return {
    total,
    porPlano,
    trialsAtivos,
    trialsExpirados,
    pagantes,
    cancelamentos,
    cancelamentosNoMes,
    mrr,
  };
};

export const MetricCard = ({
  title,
  value,
  hint,
}: {
  title: string;
  value: string | number;
  hint?: string;
}) => (
  <Card>
    <CardHeader className="pb-2">
      <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
    </CardHeader>
    <CardContent>
      <div className="text-3xl font-semibold text-primary">{value}</div>
      {hint && <p className="mt-1 text-xs text-muted-foreground">{hint}</p>}
    </CardContent>
  </Card>
);

export const MetricsSkeleton = () => (
  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
    {Array.from({ length: 6 }).map((_, i) => (
      <Skeleton key={i} className="h-28 w-full" />
    ))}
  </div>
);

export const useMetrics = (profiles: AdminProfile[] | null) =>
  useMemo(() => (profiles ? computeMetrics(profiles) : null), [profiles]);
