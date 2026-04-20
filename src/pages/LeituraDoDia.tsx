import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Share2, Bookmark, Sparkles } from "lucide-react";

const today = new Date().toLocaleDateString("pt-BR", {
  weekday: "long", day: "numeric", month: "long", year: "numeric",
});

const LeituraDoDia = () => (
  <div className="container max-w-3xl py-8 md:py-12">
    <header className="mb-10 text-center animate-fade-up">
      <p className="text-xs uppercase tracking-[0.22em] text-gold-deep">{today}</p>
      <h1 className="mt-3 font-serif text-4xl text-primary md:text-5xl">XXIX Domingo do Tempo Comum</h1>
      <p className="mt-3 text-sm text-muted-foreground">Cor litúrgica: verde · Ano C</p>
    </header>

    <div className="mb-6 flex justify-end gap-2">
      <Button variant="outline" size="sm"><Bookmark className="h-4 w-4" /> Salvar</Button>
      <Button variant="outline" size="sm"><Share2 className="h-4 w-4" /> Compartilhar</Button>
    </div>

    <article className="space-y-10">
      {[
        { tag: "Primeira Leitura", ref: "Ex 17, 8-13", title: "Leitura do livro do Êxodo",
          text: "Naqueles dias, os amalecitas vieram combater Israel em Rafidim. Moisés disse a Josué: «Escolhe alguns homens e amanhã sairás a combater os amalecitas...»" },
        { tag: "Salmo Responsorial", ref: "Sl 120 (121)",
          text: "— O socorro me virá do Senhor, que fez os céus e a terra.\n\nElevo os meus olhos para os montes: de onde me virá o socorro?" },
        { tag: "Segunda Leitura", ref: "2Tm 3, 14 — 4, 2", title: "Leitura da segunda carta de São Paulo a Timóteo",
          text: "Caríssimo, persevera nas coisas que aprendeste e nas quais foste instruído..." },
        { tag: "Evangelho", ref: "Lc 18, 1-8", title: "Proclamação do Evangelho de Jesus Cristo segundo Lucas",
          text: "Naquele tempo, Jesus contou uma parábola aos discípulos sobre a necessidade de orarem sempre, sem desfalecer..." },
      ].map((s) => (
        <section key={s.tag}>
          <div className="mb-3 flex items-center gap-3">
            <span className="rounded-full bg-gold/15 px-3 py-1 text-xs font-medium uppercase tracking-wider text-gold-deep">
              {s.tag}
            </span>
            <span className="text-xs text-muted-foreground">{s.ref}</span>
          </div>
          {s.title && <h2 className="mb-3 font-serif text-xl text-primary">{s.title}</h2>}
          <p className="scripture whitespace-pre-line text-lg leading-relaxed text-foreground/90">
            {s.text}
          </p>
        </section>
      ))}

      {/* Reflexão IA */}
      <Card className="border-gold/30 bg-gradient-warm p-8 shadow-card">
        <div className="mb-4 flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-gold-deep" />
          <h2 className="font-serif text-2xl text-primary">Reflexão do dia</h2>
        </div>
        <div className="space-y-4 text-base leading-relaxed text-foreground/90">
          <p>
            A liturgia de hoje nos convida à perseverança na oração. Como Moisés
            ergue suas mãos sobre o monte, sustentado por Aarão e Hur, somos
            chamados a interceder uns pelos outros, sem desfalecer.
          </p>
          <p>
            A parábola da viúva insistente nos ensina que Deus, longe de ser um
            juiz indiferente, é Pai amoroso que escuta seus filhos. Nossa oração
            não dobra Deus — ela transforma a nós mesmos.
          </p>
          <p className="border-l-2 border-gold pl-4 italic text-muted-foreground">
            Hoje, ofereça uma oração silenciosa por alguém que precise. A Palavra
            que recebeu, leve-a no coração ao longo do dia.
          </p>
        </div>
      </Card>
    </article>
  </div>
);

export default LeituraDoDia;
