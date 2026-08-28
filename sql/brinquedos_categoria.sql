-- ═══════════════════════════════════════════════════════════
--  Brinquedos: coluna de categoria + leitura pública
--  Rode no SQL Editor do Supabase, uma vez.
-- ═══════════════════════════════════════════════════════════

-- 1. A coluna que as páginas /brinquedos/ e /materiais/ usam para filtrar
alter table public.brinquedos
  add column if not exists categoria text;

create index if not exists brinquedos_categoria_idx on public.brinquedos(categoria);

-- 2. Leitura pública
-- As páginas do site leem com a chave anônima. Sem uma política de select
-- para o público, a listagem volta vazia — sem erro, o que é pior,
-- porque parece que não há brinquedos cadastrados.
alter table public.brinquedos enable row level security;

drop policy if exists brinquedos_leitura_publica on public.brinquedos;
create policy brinquedos_leitura_publica on public.brinquedos
  for select using (true);

-- Se você quiser esconder os que estão sem estoque do site público,
-- troque a política acima por esta:
--
--   create policy brinquedos_leitura_publica on public.brinquedos
--     for select using (coalesce(estoque_atual, 0) > 0);

-- 3. Sugestão de preenchimento inicial
-- Depois de rodar, abra o admin em Estoque e defina o objetivo de cada
-- brinquedo já cadastrado. Enquanto a categoria estiver vazia, o brinquedo
-- aparece na listagem como "Geral" e não entra em nenhum filtro.
--
-- Para conferir quantos ainda faltam:
--   select count(*) filter (where categoria is null) as sem_categoria,
--          count(*) as total
--   from public.brinquedos;
