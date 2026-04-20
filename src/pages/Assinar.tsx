import { Link } from "react-router-dom";
import { Check, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

const plans = [
  {
    name: "Gratuito",
    price: "R$ 0",
    period: "para sempre",
    desc: "Para começar a caminhada com a Palavra.",
    features: [
      "Leitura do Evangelho do dia (sempre)",
      "Reflexão com IA — apenas nos primeiros 7 dias",
      "Entrega por e-mail — apenas nos primeiros 7 dias",
      "Acesso ao arquivo dos últimos 7 dias",
    ],
    cta: "Começar grátis",
    href: "/cadastro",
    variant: "outline" as const,
  },
  {
    name: "Devoto",
    price: "R$ 19,90",
    period: "/mês",
    priceAlt: "ou R$ 189/ano (economize 20%)",
    desc: "A experiência completa, todos os dias.",
    features: [
      "Liturgia completa todos os dias",
      "Reflexão e comentário com IA",
      "Envio por e-mail e Telegram",
      "Arquivo histórico ilimitado",
      "Horário personalizado de envio",
    ],
    cta: "Assinar agora",
    variant: "gold" as const,
    highlight: true,
  },
  {
    name: "Peregrino",
    price: "R$ 39,90",
    period: "/mês",
    priceAlt: "ou R$ 379/ano (economize 20%)",
    desc: "Para quem quer a Palavra também no WhatsApp.",
    features: [
      "Tudo do plano Devoto",
      "Envio por WhatsApp",
      "Suporte prioritário",
    ],
    cta: "Assinar agora",
    variant: "outline" as const,
  },
];

const Assinar = () => (
  <div className="bg-background">
    <section className="bg-gradient-warm py-20 text-center">
      <div className="container max-w-3xl">
        <p className="mb-3 text-xs uppercase tracking-[0.22em] text-gold-deep">Planos</p>
        <h1 className="font-serif text-5xl text-primary md:text-6xl">Escolha seu plano</h1>
        <p className="mt-5 text-lg text-muted-foreground">
          Comece grátis ou apoie o projeto e tenha acesso completo à Palavra,
          todos os dias.
        </p>
      </div>
    </section>

    <section className="container py-20">
      <div className="grid gap-6 md:grid-cols-3">
        {plans.map((p) => (
          <Card
            key={p.name}
            className={cn(
              "relative flex flex-col p-8 transition-smooth",
              p.highlight
                ? "border-gold bg-primary text-primary-foreground shadow-elegant md:-mt-4 md:scale-105"
                : "border-border shadow-card hover:-translate-y-1 hover:shadow-elegant"
            )}
          >
            {p.highlight && (
              <span className="absolute -top-3 left-1/2 inline-flex -translate-x-1/2 items-center gap-1 rounded-full bg-gold px-4 py-1 text-xs font-medium uppercase tracking-wider text-gold-foreground">
                <Star className="h-3 w-3 fill-current" /> Mais popular
              </span>
            )}
            <h3 className={cn("font-serif text-2xl", p.highlight ? "text-gold" : "text-primary")}>{p.name}</h3>
            <p className={cn("mt-1 text-sm", p.highlight ? "text-primary-foreground/70" : "text-muted-foreground")}>{p.desc}</p>
            <div className="mt-6 flex items-baseline gap-1">
              <span className="font-serif text-4xl">{p.price}</span>
              <span className={cn("text-sm", p.highlight ? "text-primary-foreground/70" : "text-muted-foreground")}>{p.period}</span>
            </div>
            {p.priceAlt && (
              <p className={cn("mt-1 text-xs", p.highlight ? "text-gold" : "text-gold-deep")}>{p.priceAlt}</p>
            )}
            <ul className="mt-6 flex-1 space-y-3">
              {p.features.map((f) => (
                <li key={f} className="flex items-start gap-2 text-sm">
                  <Check className={cn("mt-0.5 h-4 w-4 shrink-0", p.highlight ? "text-gold" : "text-gold-deep")} />
                  <span>{f}</span>
                </li>
              ))}
            </ul>
            {p.href ? (
              <Button asChild variant={p.variant} size="lg" className="mt-8">
                <Link to={p.href}>{p.cta}</Link>
              </Button>
            ) : (
              <Button variant={p.variant} size="lg" className="mt-8">
                {p.cta}
              </Button>
            )}
          </Card>
        ))}
      </div>

      <p className="mx-auto mt-10 max-w-xl text-center text-xs text-muted-foreground">
        Pagamento seguro. Cancele quando quiser. O checkout dos planos pagos
        será habilitado em breve.
      </p>
    </section>
  </div>
);

export default Assinar;
