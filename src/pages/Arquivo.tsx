import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Calendar, Search, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const items = Array.from({ length: 12 }).map((_, i) => {
  const d = new Date();
  d.setDate(d.getDate() - i);
  return {
    date: d.toLocaleDateString("pt-BR", { day: "2-digit", month: "long", year: "numeric" }),
    weekday: d.toLocaleDateString("pt-BR", { weekday: "long" }),
    title: i === 0 ? "XXIX Domingo do Tempo Comum" : `Memória do dia ${i + 1}`,
    verse: ["Lc 18, 1-8", "Lc 12, 8-12", "Lc 11, 47-54", "Mt 13, 1-9"][i % 4],
  };
});

const Arquivo = () => (
  <div className="container py-8 md:py-12">
    <header className="mb-8 animate-fade-up">
      <h1 className="font-serif text-4xl text-primary md:text-5xl">Arquivo de Leituras</h1>
      <p className="mt-2 text-muted-foreground">
        Revisite todas as liturgias que você recebeu.
      </p>
    </header>

    <div className="relative mb-6 max-w-md">
      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
      <Input placeholder="Buscar por data, livro ou passagem..." className="pl-10" />
    </div>

    <div className="space-y-3">
      {items.map((it) => (
        <Card key={it.date} className="flex items-center justify-between border-border p-5 transition-smooth hover:border-gold/40 hover:shadow-card">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-md bg-gold/10 text-gold-deep">
              <Calendar className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs uppercase tracking-wider text-muted-foreground">{it.weekday} · {it.date}</p>
              <p className="font-serif text-lg text-primary">{it.title}</p>
              <p className="text-sm text-muted-foreground">{it.verse}</p>
            </div>
          </div>
          <Link to="/dashboard/leitura" className="text-gold-deep hover:text-gold">
            <ArrowRight className="h-5 w-5" />
          </Link>
        </Card>
      ))}
    </div>
  </div>
);

export default Arquivo;
