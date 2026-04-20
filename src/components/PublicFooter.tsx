import { Link } from "react-router-dom";
import { Logo } from "@/components/Logo";

export const PublicFooter = () => (
  <footer className="border-t border-border bg-primary text-primary-foreground">
    <div className="container grid gap-10 py-14 md:grid-cols-4">
      <div className="md:col-span-2">
        <Logo variant="light" />
        <p className="mt-5 max-w-sm text-sm leading-relaxed text-primary-foreground/75">
          Caminhe com a Palavra todos os dias. Recebemos juntos as leituras do
          calendário litúrgico oficial da CNBB, com reflexões que tocam o coração.
        </p>
      </div>
      <div>
        <h4 className="mb-4 font-serif text-base text-gold">Navegação</h4>
        <ul className="space-y-2 text-sm text-primary-foreground/80">
          <li><Link to="/" className="hover:text-gold transition-smooth">Início</Link></li>
          <li><Link to="/como-funciona" className="hover:text-gold transition-smooth">Como funciona</Link></li>
          <li><Link to="/assinar" className="hover:text-gold transition-smooth">Assinar</Link></li>
          <li><Link to="/sobre" className="hover:text-gold transition-smooth">Sobre e contato</Link></li>
        </ul>
      </div>
      <div>
        <h4 className="mb-4 font-serif text-base text-gold">Conta</h4>
        <ul className="space-y-2 text-sm text-primary-foreground/80">
          <li><Link to="/login" className="hover:text-gold transition-smooth">Entrar</Link></li>
          <li><Link to="/cadastro" className="hover:text-gold transition-smooth">Criar conta</Link></li>
        </ul>
      </div>
    </div>
    <div className="border-t border-primary-foreground/10">
      <div className="container flex flex-col items-center justify-between gap-2 py-6 text-xs text-primary-foreground/60 md:flex-row">
        <p>© {new Date().getFullYear()} Liturgia Viva. Todos os direitos reservados.</p>
        <p className="italic">"Fica comigo, Senhor" — Lc 24, 29</p>
      </div>
    </div>
  </footer>
);
