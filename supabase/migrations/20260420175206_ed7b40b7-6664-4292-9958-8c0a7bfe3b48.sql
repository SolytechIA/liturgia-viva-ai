
-- profiles
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  nome TEXT,
  whatsapp TEXT,
  telegram_username TEXT,
  canal_entrega TEXT NOT NULL DEFAULT 'email',
  horario_envio TEXT NOT NULL DEFAULT 'manha',
  plano TEXT NOT NULL DEFAULT 'gratuito',
  status_assinatura TEXT NOT NULL DEFAULT 'trial',
  data_cadastro TIMESTAMPTZ NOT NULL DEFAULT now(),
  data_proxima_cobranca DATE
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Usuários podem ver o próprio perfil"
  ON public.profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Usuários podem inserir o próprio perfil"
  ON public.profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Usuários podem atualizar o próprio perfil"
  ON public.profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Usuários podem deletar o próprio perfil"
  ON public.profiles FOR DELETE
  TO authenticated
  USING (auth.uid() = id);

-- leituras
CREATE TABLE public.leituras (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  data DATE NOT NULL,
  referencia TEXT,
  texto_passagem TEXT,
  reflexao_ia TEXT,
  explicacao_ia TEXT,
  cor_liturgica TEXT,
  tempo_liturgico TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE UNIQUE INDEX leituras_data_referencia_idx ON public.leituras (data, COALESCE(referencia, ''));

ALTER TABLE public.leituras ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Leituras visíveis para autenticados"
  ON public.leituras FOR SELECT
  TO authenticated
  USING (true);

-- trigger: cria profile no signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, nome)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'nome', NEW.raw_user_meta_data->>'name', '')
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
