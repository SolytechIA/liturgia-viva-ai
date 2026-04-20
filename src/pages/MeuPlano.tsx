import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Star, Mail, MessageCircle, Clock } from "lucide-react";

const MeuPlano = () => (
  <div className="container max-w-4xl py-8 md:py-12">
    <header className="mb-8 animate-fade-up">
      <h1 className="font-serif text-4xl text-primary md:text-5xl">Meu Plano</h1>
      <p className="mt-2 text-muted-foreground">
        Gerencie sua assinatura e preferências de envio.
      </p>
    </header>

    {/* Plano atual */}
    <Card className="mb-6 border-gold bg-primary p-8 text-primary-foreground shadow-elegant">
      <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
        <div>
          <div className="mb-2 inline-flex items-center gap-2 rounded-full bg-gold/20 px-3 py-1 text-xs uppercase tracking-wider text-gold">
            <Star className="h-3 w-3 fill-current" /> Plano Peregrino
          </div>
          <h2 className="font-serif text-3xl">R$ 14,90 <span className="text-base text-primary-foreground/70">/mês</span></h2>
          <p className="mt-2 text-sm text-primary-foreground/75">Próxima cobrança em 15 de novembro</p>
        </div>
        <div className="flex gap-2">
          <Button variant="gold-outline">Trocar plano</Button>
          <Button variant="ghost" className="text-primary-foreground hover:bg-primary-foreground/10">Cancelar</Button>
        </div>
      </div>
    </Card>

    {/* Preferências */}
    <Card className="mb-6 border-border p-8 shadow-card">
      <h3 className="mb-6 font-serif text-2xl text-primary">Preferências de envio</h3>

      <div className="space-y-6">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-3">
            <Mail className="mt-0.5 h-5 w-5 text-gold-deep" />
            <div>
              <Label className="text-base">E-mail</Label>
              <p className="text-sm text-muted-foreground">Receba a liturgia no seu e-mail</p>
            </div>
          </div>
          <Switch defaultChecked />
        </div>

        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-3">
            <MessageCircle className="mt-0.5 h-5 w-5 text-gold-deep" />
            <div>
              <Label className="text-base">WhatsApp</Label>
              <p className="text-sm text-muted-foreground">Em breve disponível</p>
            </div>
          </div>
          <Switch disabled />
        </div>

        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-3">
            <Clock className="mt-0.5 h-5 w-5 text-gold-deep" />
            <div>
              <Label htmlFor="time" className="text-base">Horário de envio</Label>
              <p className="text-sm text-muted-foreground">Quando você quer receber a leitura</p>
            </div>
          </div>
          <Input id="time" type="time" defaultValue="07:00" className="w-32" />
        </div>
      </div>

      <Button variant="gold" className="mt-8">Salvar preferências</Button>
    </Card>

    {/* Conta */}
    <Card className="border-border p-8 shadow-card">
      <h3 className="mb-6 font-serif text-2xl text-primary">Dados da conta</h3>
      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <Label htmlFor="name">Nome</Label>
          <Input id="name" defaultValue="Maria Silva" className="mt-1.5" />
        </div>
        <div>
          <Label htmlFor="email">E-mail</Label>
          <Input id="email" type="email" defaultValue="maria@exemplo.com" className="mt-1.5" />
        </div>
      </div>
      <Button variant="outline" className="mt-6">Atualizar dados</Button>
    </Card>
  </div>
);

export default MeuPlano;
