import { Mail, Heart, Cross } from "lucide-react";
import { Card } from "@/components/ui/card";

const Sobre = () => (
  <div className="bg-background">
    <section className="bg-primary py-20 text-primary-foreground">
      <div className="container max-w-3xl text-center">
        <Cross className="mx-auto mb-6 h-10 w-10 text-gold" />
        <h1 className="font-serif text-5xl md:text-6xl">Nossa missão</h1>
        <p className="mt-6 scripture text-xl leading-relaxed text-primary-foreground/85 md:text-2xl">
          "A tua Palavra é lâmpada para meus pés, luz para o meu caminho."
        </p>
        <p className="mt-3 text-xs uppercase tracking-[0.25em] text-gold">— Salmo 119, 105</p>
      </div>
    </section>

    <section className="container max-w-3xl py-20">
      <div className="space-y-6 text-lg leading-relaxed text-foreground">
        <p>
          Liturgia Viva nasceu do desejo simples de levar a Palavra de Deus ao
          coração de cada fiel — todos os dias, com beleza e cuidado. Em um mundo
          ruidoso, queremos oferecer um pequeno santuário diário no seu e-mail.
        </p>
        <p>
          Seguimos fielmente o calendário litúrgico oficial da Conferência
          Nacional dos Bispos do Brasil (CNBB), trazendo as leituras completas
          de cada dia, acompanhadas de reflexões cuidadosamente elaboradas com o
          auxílio de inteligência artificial — sempre com o devido respeito à
          tradição e ao Magistério da Igreja.
        </p>
        <p>
          Acreditamos que pequenos gestos diários transformam a vida espiritual.
          Que a leitura da Palavra, antes do café da manhã, seja o seu primeiro
          encontro do dia com Cristo.
        </p>
      </div>
    </section>

    <section className="bg-surface py-20">
      <div className="container max-w-4xl">
        <h2 className="mb-10 text-center font-serif text-4xl text-primary">Fale conosco</h2>
        <div className="grid gap-6 md:grid-cols-2">
          <Card className="border-gold/20 p-8 shadow-card">
            <Mail className="mb-4 h-7 w-7 text-gold-deep" />
            <h3 className="mb-2 font-serif text-xl text-primary">E-mail</h3>
            <p className="mb-3 text-sm text-muted-foreground">
              Para dúvidas, sugestões ou pedidos de oração.
            </p>
            <a href="mailto:contato.liturgiaviva@gmail.com" className="font-medium text-gold-deep hover:underline">
              contato.liturgiaviva@gmail.com
            </a>
          </Card>
          <Card className="border-gold/20 p-8 shadow-card">
            <Heart className="mb-4 h-7 w-7 text-gold-deep" />
            <h3 className="mb-2 font-serif text-xl text-primary">Apoie o projeto</h3>
            <p className="text-sm text-muted-foreground">
              Liturgia Viva é mantido por assinantes que acreditam na missão de
              levar a Palavra a mais corações. Sua assinatura é o nosso combustível.
            </p>
          </Card>
        </div>
      </div>
    </section>
  </div>
);

export default Sobre;
