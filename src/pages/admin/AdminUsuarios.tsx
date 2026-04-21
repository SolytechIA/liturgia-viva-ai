import { useMemo, useState } from "react";
import { useAdminProfiles, AdminProfile } from "./_shared";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

const PLANOS = ["gratuito", "devoto", "peregrino"] as const;
const STATUSES = ["ativo", "trial", "cancelado", "inadimplente"] as const;
const PAGE_SIZE = 10;

type Edits = Record<string, { plano?: string; status_assinatura?: string }>;

const formatDate = (s: string | null) =>
  s ? new Date(s).toLocaleDateString("pt-BR") : "—";

const AdminUsuarios = () => {
  const { profiles, loading, error, refresh } = useAdminProfiles();
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [edits, setEdits] = useState<Edits>({});
  const [savingId, setSavingId] = useState<string | null>(null);

  const filtered = useMemo(() => {
    if (!profiles) return [];
    const q = search.trim().toLowerCase();
    if (!q) return profiles;
    return profiles.filter((p) => {
      return (
        (p.nome ?? "").toLowerCase().includes(q) ||
        (p.email ?? "").toLowerCase().includes(q)
      );
    });
  }, [profiles, search]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const pageItems = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const setEdit = (id: string, patch: Partial<Edits[string]>) =>
    setEdits((prev) => ({ ...prev, [id]: { ...prev[id], ...patch } }));

  const salvar = async (p: AdminProfile) => {
    const e = edits[p.id];
    if (!e || (e.plano === undefined && e.status_assinatura === undefined)) {
      toast.info("Nenhuma alteração para salvar");
      return;
    }
    setSavingId(p.id);
    const update: {
      plano?: string;
      status_assinatura?: string;
      data_proxima_cobranca?: string | null;
    } = {};
    if (e.plano !== undefined) update.plano = e.plano;
    if (e.status_assinatura !== undefined) update.status_assinatura = e.status_assinatura;

    const planoFinal = e.plano ?? p.plano;
    const statusFinal = e.status_assinatura ?? p.status_assinatura;

    if (
      statusFinal === "ativo" &&
      (planoFinal === "devoto" || planoFinal === "peregrino")
    ) {
      const proxima = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
      update.data_proxima_cobranca = proxima.toISOString().split("T")[0];
    } else if (statusFinal === "cancelado" || statusFinal === "inadimplente") {
      update.data_proxima_cobranca = null;
    }

    const { error: upErr } = await supabase
      .from("profiles")
      .update(update)
      .eq("id", p.id);
    setSavingId(null);
    if (upErr) {
      toast.error("Erro ao salvar: " + upErr.message);
      return;
    }
    toast.success("Usuário atualizado!");
    setEdits((prev) => {
      const cp = { ...prev };
      delete cp[p.id];
      return cp;
    });
    refresh();
  };

  const statusBadge = (status: string) => {
    const map: Record<string, string> = {
      ativo: "bg-emerald-100 text-emerald-800",
      trial: "bg-blue-100 text-blue-800",
      cancelado: "bg-red-100 text-red-800",
      inadimplente: "bg-amber-100 text-amber-800",
    };
    return (
      <Badge variant="secondary" className={map[status] ?? ""}>
        {status}
      </Badge>
    );
  };

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-10">
      <header className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-serif text-3xl font-semibold text-primary">Usuários</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {profiles ? `${profiles.length} usuários cadastrados` : "Carregando..."}
          </p>
        </div>
        <div className="w-full sm:w-72">
          <Input
            placeholder="Buscar por nome ou e-mail..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
          />
        </div>
      </header>

      {error && (
        <div className="mb-6 rounded-md border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive">
          Erro ao carregar dados: {error}
        </div>
      )}

      <div className="overflow-hidden rounded-lg border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nome</TableHead>
              <TableHead>E-mail</TableHead>
              <TableHead>Plano</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Cadastro</TableHead>
              <TableHead>Próx. Cobrança</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <TableRow key={i}>
                  {Array.from({ length: 7 }).map((__, j) => (
                    <TableCell key={j}>
                      <Skeleton className="h-5 w-full" />
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : pageItems.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center text-muted-foreground py-10">
                  Nenhum usuário encontrado
                </TableCell>
              </TableRow>
            ) : (
              pageItems.map((p) => {
                const planoAtual = edits[p.id]?.plano ?? p.plano;
                const statusAtual = edits[p.id]?.status_assinatura ?? p.status_assinatura;
                const dirty =
                  edits[p.id] &&
                  ((edits[p.id].plano !== undefined && edits[p.id].plano !== p.plano) ||
                    (edits[p.id].status_assinatura !== undefined &&
                      edits[p.id].status_assinatura !== p.status_assinatura));
                return (
                  <TableRow key={p.id}>
                    <TableCell className="font-medium">
                      {p.nome || <span className="text-muted-foreground">—</span>}
                      {p.is_admin && (
                        <Badge variant="secondary" className="ml-2 bg-gold/20 text-primary">
                          admin
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {p.email ?? "—"}
                    </TableCell>
                    <TableCell>
                      <Select
                        value={planoAtual}
                        onValueChange={(v) => setEdit(p.id, { plano: v })}
                      >
                        <SelectTrigger className="h-8 w-[130px]">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {PLANOS.map((pl) => (
                            <SelectItem key={pl} value={pl} className="capitalize">
                              {pl}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {statusBadge(statusAtual)}
                        <Select
                          value={statusAtual}
                          onValueChange={(v) => setEdit(p.id, { status_assinatura: v })}
                        >
                          <SelectTrigger className="h-8 w-[130px]">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {STATUSES.map((s) => (
                              <SelectItem key={s} value={s} className="capitalize">
                                {s}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </TableCell>
                    <TableCell className="text-sm">{formatDate(p.data_cadastro)}</TableCell>
                    <TableCell className="text-sm">{formatDate(p.data_proxima_cobranca)}</TableCell>
                    <TableCell className="text-right">
                      <Button
                        size="sm"
                        disabled={!dirty || savingId === p.id}
                        onClick={() => salvar(p)}
                      >
                        {savingId === p.id ? "Salvando..." : "Salvar"}
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>

      {!loading && filtered.length > PAGE_SIZE && (
        <div className="mt-4 flex items-center justify-between text-sm">
          <span className="text-muted-foreground">
            Página {page} de {totalPages}
          </span>
          <div className="flex gap-2">
            <Button
              size="sm"
              variant="outline"
              disabled={page === 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
            >
              Anterior
            </Button>
            <Button
              size="sm"
              variant="outline"
              disabled={page >= totalPages}
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            >
              Próxima
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminUsuarios;
