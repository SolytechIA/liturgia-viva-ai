interface LogoProps {
  className?: string;
  showText?: boolean;
  variant?: "light" | "dark";
}

export const Logo = ({ className = "", showText = true, variant = "dark" }: LogoProps) => {
  const textColor = variant === "light" ? "text-primary-foreground" : "text-primary";
  const subColor = variant === "light" ? "text-gold" : "text-gold";

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <div className="relative flex h-11 w-11 shrink-0 items-center justify-center rounded-md bg-primary shadow-card">
        <svg viewBox="0 0 40 40" className="h-7 w-7" aria-hidden="true">
          {/* Cruz */}
          <rect x="18.5" y="5" width="3" height="18" rx="0.5" fill="hsl(var(--gold))" />
          <rect x="13" y="10.5" width="14" height="3" rx="0.5" fill="hsl(var(--gold))" />
          {/* Livro aberto */}
          <path
            d="M6 26 C 12 24, 17 24, 20 26 C 23 24, 28 24, 34 26 L 34 34 C 28 32, 23 32, 20 34 C 17 32, 12 32, 6 34 Z"
            fill="hsl(var(--gold))"
            opacity="0.95"
          />
          <path d="M20 26 L 20 34" stroke="hsl(var(--primary))" strokeWidth="0.8" />
        </svg>
      </div>
      {showText && (
        <div className="flex flex-col leading-none">
          <span className={`font-serif text-xl font-semibold tracking-tight ${textColor}`}>
            Liturgia Viva
          </span>
          <span className={`mt-1 text-[11px] uppercase tracking-[0.18em] ${subColor}`}>
            Fica Comigo, Senhor
          </span>
        </div>
      )}
    </div>
  );
};
