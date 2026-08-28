-- ═══════════════════════════════════════════════════════════
--  Neuroplasticidar — tabela de artigos (/sinais/ e /blog/)
--  Rode isto no SQL Editor do Supabase, uma vez.
-- ═══════════════════════════════════════════════════════════

create table if not exists public.artigos (
  id           uuid primary key default gen_random_uuid(),

  -- Identidade e URL
  slug         text not null unique,          -- meu-filho-nao-fala
  pasta        text not null default 'sinais',-- 'sinais' ou 'blog'
  status       text not null default 'rascunho', -- rascunho | publicado

  -- Cabeçalho
  h1           text not null,                 -- título grande na página
  title_seo    text not null,                 -- <title> — pode diferir do h1
  descricao    text not null,                 -- meta description + subtítulo
  keywords     text default '',
  badge        text default '',               -- categoria mostrada no topo
  autor        text default 'Equipe Neuroplasticidar',
  tempo_leitura text default '6 min de leitura',

  -- Corpo (JSONB — a estrutura da página de sinal)
  lead         text default '',
  por_tras     jsonb default '[]'::jsonb,     -- [{titulo, texto}]
  quando       jsonb default '[]'::jsonb,     -- ["item", ...]
  quando_nota  text default '',
  profissionais jsonb default '[]'::jsonb,    -- [{titulo, texto}]
  em_casa      jsonb default '[]'::jsonb,     -- [{titulo, texto}]
  objetivos    jsonb default '[]'::jsonb,     -- ["avd","sensorial"]
  faq          jsonb default '[]'::jsonb,     -- [{pergunta, resposta}]

  -- Controle
  publicado_em timestamptz,
  publicado_por text,
  sha_github   text,        -- sha do arquivo no repo, para update
  created_at   timestamptz default now(),
  updated_at   timestamptz default now()
);

create index if not exists artigos_status_idx on public.artigos(status);
create index if not exists artigos_pasta_idx  on public.artigos(pasta);

-- updated_at automático
create or replace function public.artigos_touch()
returns trigger language plpgsql as $$
begin new.updated_at = now(); return new; end $$;

drop trigger if exists artigos_touch_trg on public.artigos;
create trigger artigos_touch_trg before update on public.artigos
for each row execute function public.artigos_touch();

-- ── RLS ────────────────────────────────────────────────────
-- Leitura pública só do que está publicado (o site estático nem precisa,
-- mas deixa a porta aberta para um índice dinâmico no futuro).
alter table public.artigos enable row level security;

drop policy if exists artigos_leitura_publica on public.artigos;
create policy artigos_leitura_publica on public.artigos
  for select using (status = 'publicado');

-- Escrita e leitura total só para quem está logado como equipe.
-- Ajuste o predicado abaixo se a sua tabela team_members usar outra coluna.
drop policy if exists artigos_equipe_total on public.artigos;
create policy artigos_equipe_total on public.artigos
  for all
  using (
    auth.role() = 'authenticated'
    and exists (select 1 from public.team_members t where t.email = auth.email())
  )
  with check (
    auth.role() = 'authenticated'
    and exists (select 1 from public.team_members t where t.email = auth.email())
  );
