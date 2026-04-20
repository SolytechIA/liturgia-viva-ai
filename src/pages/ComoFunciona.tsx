import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { UserPlus, Settings2, Mail, BookMarked, ArrowRight } from "lucide-react";

const steps = [
  { icon: UserPlus, title: "1. Cadastre-se", text: "Crie sua conta em menos de um minuto, gratuitamente, e teste por 7 dias." },
  { icon: Settings2, title: "2. Personalize", text: "Escolha o canal (e-mail ou WhatsApp) e o horário ideal para receber a leitura." },
  { icon: Mail, title: "3. Receba diariamente", text: "Toda manhã, a liturgia do dia chega com primeira leitura, salmo, evangelho e reflexão." },
  { icon: BookMarked, title: "4. Reze e guarde", text: "Acesse o arquivo completo no seu painel e revisite passagens marcantes." },
];

const ComoFunciona = () => (
  <div className="bg-background">
    <section className="bg-gradient-warm py-20">
      <div className="container max-w-3xl text-center">
        <p className="mb-3 text-xs uppercase tracking-[0.22em] text-gold-deep">Como funciona</p>
        <h1 className="font-serif text-5xl text-primary md:text-6xl">Sua rotina espiritual, sem esforço</h1>
        <p className="mt-5 text-lg text-muted-foreground">
          Liturgia Viva foi pensado para integrar a Palavra no seu cotidiano de
          forma simples, bonita e profunda.
        </p>
      </div>
    </section>

    <section className="container py-20">
      <div className="grid gap-6 md:grid-cols-2">
        {steps.map((s) => (
          <Card key={s.title} className="border-gold/20 p-8 shadow-card">
            <div className="mb-5 inline-flex h-12 w-12 items-center justify-center rounded-md bg-primary text-gold">
              <s.icon className="h-6 w-6" />
            </div>
            <h3 className="mb-2 font-serif text-2xl text-primary">{s.title}</h3>
            <p className="text-muted-foreground">{s.text}</p>
          </Card>
        ))}
      </div>
    </section>

    <section className="bg-surface py-20">
      <div className="container max-w-3xl">
        <h2 className="mb-10 text-center font-serif text-4xl text-primary">O que você recebe todos os dias</h2>
        <div className="space-y-4">
          {[
            "Primeira leitura completa, conforme calendário da CNBB",
            "Salmo responsorial com refrão",
            "Segunda leitura (quando houver)",
            "Evangelho do dia",
            "Reflexão e comentário gerados com inteligência artificial cuidadosa",
            "Memória do santo do dia ou tempo litúrgico",
          ].map((item) => (
            <div key={item} className="flex items-start gap-3 rounded-md border border-border bg-background p-4">
              <div className="mt-1 h-2 w-2 shrink-0 rounded-full bg-gold" />
              <p className="text-sm text-foreground">{item}</p>
            </div>
          ))}
        </div>
      </div>
    </section>

    <section className="bg-primary py-20 text-center text-primary-foreground">
      <div className="container">
        <h2 className="font-serif text-4xl md:text-5xl">Pronto para começar?</h2>
        <p className="mx-auto mt-4 max-w-xl text-primary-foreground/80">
          Junte-se a milhares de fiéis que começam o dia com a Palavra.
        </p>
        <Button asChild size="xl" variant="gold" className="mt-8">
          <Link to="/assinar">Assinar agora <ArrowRight className="h-4 w-4" /></Link>
        </Button>
      </div>
    </section>
  </div>
);

export default ComoFunciona;
