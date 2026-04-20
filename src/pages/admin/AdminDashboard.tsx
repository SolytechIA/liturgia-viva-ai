import { useAdminProfiles, useMetrics, MetricCard, MetricsSkeleton, formatBRL } from "./_shared";

const AdminDashboard = () => {
  const { profiles, loading, error } = useAdminProfiles();
  const metrics = useMetrics(profiles);

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 lg:px-10">
      <header className="mb-8">
        <h1 className="font-serif text-3xl font-semibold text-primary">Dashboard Admin</h1>
        <p className="mt-1 text-sm text-muted-foreground">Visão geral da plataforma Liturgia Viva</p>
      </header>

      {error && (
        <div className="mb-6 rounded-md border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive">
          Erro ao carregar dados: {error}
        </div>
      )}

      {loading || !metrics ? (
        <MetricsSkeleton />
      ) : (
        <>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <MetricCard title="Total de usuários" value={metrics.total} />
            <MetricCard title="Pagantes (Devoto + Peregrino)" value={metrics.pagantes} />
            <MetricCard title="MRR" value={formatBRL(metrics.mrr)} hint="Receita mensal recorrente" />
            <MetricCard title="Trials ativos" value={metrics.trialsAtivos} hint="Gratuito com menos de 7 dias" />
            <MetricCard title="Trials expirados" value={metrics.trialsExpirados} hint="Gratuito sem upgrade" />
            <MetricCard title="Cancelamentos" value={metrics.cancelamentos} />
          </div>

          <h2 className="mb-3 mt-10 font-serif text-xl font-semibold text-primary">Usuários por plano</h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <MetricCard title="Gratuito" value={metrics.porPlano.gratuito} />
            <MetricCard title="Devoto" value={metrics.porPlano.devoto} hint="R$ 19,90/mês" />
            <MetricCard title="Peregrino" value={metrics.porPlano.peregrino} hint="R$ 39,90/mês" />
          </div>
        </>
      )}
    </div>
  );
};

export default AdminDashboard;
