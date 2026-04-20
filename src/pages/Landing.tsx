import { Link } from "react-router-dom";
import { ArrowRight, BookOpen, Sparkles, Mail, Calendar, Heart, Quote } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import heroImage from "@/assets/hero-liturgia.jpg";

const Landing = () => {
  return (
    <>
      {/* HERO */}
      <section className="relative isolate overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <img
            src={heroImage}
            alt="Vitral iluminado em catedral católica"
            width={1920}
            height={1280}
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-hero" />
        </div>

        <div className="container relative flex min-h-[88vh] flex-col items-center justify-center py-24 text-center">
          <span className="mb-6 inline-flex items-center gap-2 rounded-full border border-gold/40 bg-primary/30 px-4 py-1.5 text-xs uppercase tracking-[0.22em] text-gold backdrop-blur animate-fade-in">
            <Sparkles className="h-3.5 w-3.5" /> Calendário Litúrgico CNBB
          </span>

          <h1 className="max-w-4xl font-serif text-5xl font-semibold leading-tight text-primary-foreground md:text-7xl animate-fade-up">
            Liturgia Viva
          </h1>

          <p className="mt-4 font-serif text-2xl italic text-gold md:text-3xl animate-fade-up">
            "Fica Comigo, Senhor"
          </p>

          <p className="mt-8 max-w-2xl text-lg leading-relaxed text-primary-foreground/85 md:text-xl animate-fade-up">
            Receba todos os dias as leituras da Bíblia Católica do calendário
            litúrgico oficial, acompanhadas de reflexões inspiradoras — direto
            no seu e-mail e WhatsApp.
          </p>

          <div className="mt-10 flex flex-col items-center gap-3 sm:flex-row animate-fade-up">
            <Button asChild size="xl" variant="gold">
              <Link to="/cadastro">
                Começar minha jornada <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button asChild size="xl" variant="gold-outline">
              <Link to="/como-funciona">Como funciona</Link>
            </Button>
          </div>

          <p className="mt-8 text-xs uppercase tracking-widest text-primary-foreground/60">
            Mais de 10.000 fiéis já caminham conosco
          </p>
        </div>
      </section>

      {/* BENEFITS */}
      <section className="bg-surface py-24">
        <div className="container">
          <div className="mx-auto mb-16 max-w-2xl text-center">
            <p className="mb-3 text-xs uppercase tracking-[0.22em] text-gold-deep">A Palavra todos os dias</p>
            <h2 className="font-serif text-4xl text-primary md:text-5xl">
              Um momento sagrado <em className="text-gold-deep">no seu dia</em>
            </h2>
            <p className="mt-4 text-muted-foreground">
              A vida moderna é corrida. Liturgia Viva traz a Palavra até você,
              com cuidado, beleza e profundidade.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {[
              { icon: BookOpen, title: "Leituras oficiais", text: "Primeira leitura, salmo responsorial, segunda leitura e Evangelho do dia, conforme o calendário da CNBB." },
              { icon: Sparkles, title: "Reflexões inteligentes", text: "Comentários e meditações geradas com IA cuidadosa, para iluminar o sentido espiritual de cada passagem." },
              { icon: Mail, title: "Entrega diária", text: "No seu e-mail e WhatsApp, no horário que você preferir. Sem barulho, só Palavra." },
            ].map((b) => (
              <Card key={b.title} className="border-gold/20 bg-card p-8 shadow-card transition-smooth hover:-translate-y-1 hover:shadow-elegant">
                <div className="mb-5 inline-flex h-12 w-12 items-center justify-center rounded-md bg-gold/10 text-gold-deep">
                  <b.icon className="h-6 w-6" />
                </div>
                <h3 className="mb-2 font-serif text-xl text-primary">{b.title}</h3>
                <p className="text-sm leading-relaxed text-muted-foreground">{b.text}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* SCRIPTURE QUOTE */}
      <section className="relative bg-primary py-24 text-primary-foreground">
        <div className="container max-w-3xl text-center">
          <Quote className="mx-auto mb-6 h-10 w-10 text-gold" />
          <p className="scripture text-2xl leading-relaxed text-primary-foreground/95 md:text-3xl">
            "Fica conosco, Senhor, porque é tarde e o dia já declina."
          </p>
          <p className="mt-6 text-xs uppercase tracking-[0.25em] text-gold">— Lucas 24, 29</p>
        </div>
      </section>

      {/* HOW IT WORKS PREVIEW */}
      <section className="bg-background py-24">
        <div className="container">
          <div className="mb-14 text-center">
            <p className="mb-3 text-xs uppercase tracking-[0.22em] text-gold-deep">Em três passos</p>
            <h2 className="font-serif text-4xl text-primary md:text-5xl">Simples como rezar</h2>
          </div>
          <div className="grid gap-8 md:grid-cols-3">
            {[
              { n: "01", icon: Heart, title: "Crie sua conta", text: "Em menos de um minuto, você define seu canal preferido e horário de envio." },
              { n: "02", icon: Calendar, title: "Receba diariamente", text: "Todas as manhãs, a liturgia do dia chega até você com beleza e profundidade." },
              { n: "03", icon: BookOpen, title: "Reze e medite", text: "Aprofunde sua fé com explicações claras e reflexões pessoais." },
            ].map((s) => (
              <div key={s.n} className="relative rounded-lg border border-border bg-surface p-8">
                <span className="absolute -top-4 left-8 rounded-full bg-primary px-3 py-1 font-serif text-xs text-gold">{s.n}</span>
                <s.icon className="mb-4 h-8 w-8 text-gold-deep" />
                <h3 className="mb-2 font-serif text-xl text-primary">{s.title}</h3>
                <p className="text-sm text-muted-foreground">{s.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative overflow-hidden bg-gradient-warm py-24">
        <div className="container">
          <div className="mx-auto max-w-3xl rounded-2xl bg-primary p-12 text-center shadow-elegant md:p-16">
            <h2 className="font-serif text-4xl text-primary-foreground md:text-5xl">
              Comece hoje sua <span className="text-gold">caminhada diária</span>
            </h2>
            <p className="mx-auto mt-5 max-w-xl text-primary-foreground/80">
              Experimente 7 dias grátis. Sem compromisso. Apenas a Palavra,
              entregue com carinho.
            </p>
            <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
              <Button asChild size="xl" variant="gold">
                <Link to="/cadastro">Começar gratuitamente <ArrowRight className="h-4 w-4" /></Link>
              </Button>
              <Button asChild size="xl" variant="ghost" className="text-primary-foreground hover:bg-primary-foreground/10 hover:text-gold">
                <Link to="/login">Já tenho conta</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Landing;
