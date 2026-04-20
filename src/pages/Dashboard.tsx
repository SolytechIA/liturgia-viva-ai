import { Link } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Cross, BookOpen, Calendar, Mail, ArrowRight, Flame } from "lucide-react";

const today = new Date().toLocaleDateString("pt-BR", {
  weekday: "long",
  day: "numeric",
  month: "long",
  year: "numeric",
});

const Dashboard = () => (
  <div className="container py-8 md:py-12">
    <div className="mb-8 animate-fade-up">
      <p className="text-xs uppercase tracking-[0.22em] text-gold-deep">{today}</p>
      <h1 className="mt-2 font-serif text-4xl text-primary md:text-5xl">Bem-vindo(a) de volta</h1>
      <p className="mt-2 text-muted-foreground">
        Que a Palavra ilumine seu dia. Aqui está sua jornada espiritual.
      </p>
    </div>

    {/* Hero card — leitura do dia */}
    <Card className="mb-8 overflow-hidden border-gold/20 bg-primary text-primary-foreground shadow-elegant">
      <div className="grid gap-0 md:grid-cols-[1fr_auto]">
        <div className="p-8 md:p-10">
          <p className="text-xs uppercase tracking-[0.22em] text-gold">Leitura de hoje</p>
          <h2 className="mt-3 font-serif text-3xl md:text-4xl">XXIX Domingo do Tempo Comum</h2>
          <p className="mt-4 scripture text-lg italic text-primary-foreground/85">
            "Fazei tudo o que ele vos disser." — Jo 2, 5
          </p>
          <Button asChild variant="gold" size="lg" className="mt-6">
            <Link to="/dashboard/leitura">
              Ler agora <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
        <div className="hidden items-center justify-center bg-primary-glow/40 p-10 md:flex">
          <Cross className="h-32 w-32 text-gold/30" />
        </div>
      </div>
    </Card>

    {/* Stats */}
    <div className="grid gap-4 md:grid-cols-3">
      {[
        { icon: Flame, label: "Sequência", value: "12 dias", text: "Você não falta há 12 dias" },
        { icon: BookOpen, label: "Leituras", value: "47", text: "Total de leituras este mês" },
        { icon: Mail, label: "Próximo envio", value: "Amanhã, 7h", text: "Por e-mail" },
      ].map((s) => (
        <Card key={s.label} className="border-border p-6 shadow-card">
          <div className="flex items-center gap-3">
            <div className="inline-flex h-10 w-10 items-center justify-center rounded-md bg-gold/10 text-gold-deep">
              <s.icon className="h-5 w-5" />
            </div>
            <span className="text-xs uppercase tracking-wider text-muted-foreground">{s.label}</span>
          </div>
          <p className="mt-4 font-serif text-3xl text-primary">{s.value}</p>
          <p className="mt-1 text-sm text-muted-foreground">{s.text}</p>
        </Card>
      ))}
    </div>

    {/* Recent */}
    <div className="mt-10">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="font-serif text-2xl text-primary">Leituras recentes</h3>
        <Button asChild variant="link" className="text-gold-deep">
          <Link to="/dashboard/arquivo">Ver tudo</Link>
        </Button>
      </div>
      <div className="space-y-3">
        {[
          { date: "Ontem", title: "Sábado da 28ª Semana", verse: "Lc 12, 8-12" },
          { date: "Há 2 dias", title: "Sexta-feira da 28ª Semana", verse: "Lc 12, 1-7" },
          { date: "Há 3 dias", title: "Quinta-feira — Santa Teresa", verse: "Lc 11, 47-54" },
        ].map((r) => (
          <Card key={r.title} className="flex items-center justify-between border-border p-5 transition-smooth hover:border-gold/40 hover:shadow-card">
            <div className="flex items-center gap-4">
              <Calendar className="h-5 w-5 text-gold-deep" />
              <div>
                <p className="font-serif text-lg text-primary">{r.title}</p>
                <p className="text-sm text-muted-foreground">{r.date} · {r.verse}</p>
              </div>
            </div>
            <ArrowRight className="h-4 w-4 text-muted-foreground" />
          </Card>
        ))}
      </div>
    </div>
  </div>
);

export default Dashboard;
