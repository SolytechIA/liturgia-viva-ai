import {
  useAdminProfiles,
  useMetrics,
  MetricCard,
  MetricsSkeleton,
  formatBRL,
} from "./_shared";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const PRICES: Record<string, number> = {
  gratuito: 0,
  devoto: 19.9,
  peregrino: 39.9,
};

const AdminFinanceiro = () => {
  const { profiles, loading, error } = useAdminProfiles();
  const metrics = useMetrics(profiles);

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 lg:px-10">
      <header className="mb-8">
        <h1 className="font-serif text-3xl font-semibold text-primary">Financeiro</h1>
        <p className="mt-1 text-sm text-muted-foreground">Faturamento e métricas de receita</p>
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
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <MetricCard
              title="Faturamento mensal"
              value={formatBRL(metrics.mrr)}
              hint={`(${metrics.porPlano.devoto} × R$19,90) + (${metrics.porPlano.peregrino} × R$39,90)`}
            />
            <MetricCard title="MRR total" value={formatBRL(metrics.mrr)} />
            <MetricCard title="Cancelamentos no mês" value={metrics.cancelamentosNoMes} />
          </div>

          <Card className="mt-8">
            <CardHeader>
              <CardTitle className="text-lg">Receita por plano</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Plano</TableHead>
                    <TableHead className="text-right">Qtd. usuários</TableHead>
                    <TableHead className="text-right">Preço</TableHead>
                    <TableHead className="text-right">Receita</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {(["gratuito", "devoto", "peregrino"] as const).map((plano) => {
                    const qtd = metrics.porPlano[plano];
                    const preco = PRICES[plano];
                    const receita = qtd * preco;
                    return (
                      <TableRow key={plano}>
                        <TableCell className="capitalize font-medium">{plano}</TableCell>
                        <TableCell className="text-right">{qtd}</TableCell>
                        <TableCell className="text-right">{formatBRL(preco)}</TableCell>
                        <TableCell className="text-right font-semibold">
                          {formatBRL(receita)}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                  <TableRow>
                    <TableCell colSpan={3} className="text-right font-semibold">
                      Total MRR
                    </TableCell>
                    <TableCell className="text-right font-semibold text-primary">
                      {formatBRL(metrics.mrr)}
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
};

export default AdminFinanceiro;
