-- ═══════════════════════════════════════════════════════════
--  Brinquedos — preço de varejo a partir do custo
--
--  Regra:  preço = (custo × 2,5 + 6,00) ÷ 0,96
--          arredondado para terminação ,90, com piso de R$ 19,90
--
--  O + 6,00 cobre embalagem e manuseio, que não escalam com o
--  custo do item. O ÷ 0,96 embute 4% do Simples Nacional
--  (Anexo I, primeira faixa) — confirme a alíquota com a
--  contabilidade e ajuste aqui se a sua for outra.
--
--  Resultado: margem líquida entre 61% e 84%, maior nos itens
--  baratos (onde o piso manda) e menor nos caros.
-- ═══════════════════════════════════════════════════════════

-- ── PASSO 1 — confira antes de gravar ──────────────────────
with calc as (
  select id, nome, custo, preco_venda as preco_hoje,
         (custo * 2.5 + 6.00) / 0.96 as bruto
  from public.brinquedos
  where custo is not null
)
select nome, custo, preco_hoje,
       greatest(19.90, floor(bruto)
         + case when bruto - floor(bruto) <= 0.90 then 0.90 else 1.90 end
       ) as preco_novo
from calc
order by custo;

-- ── PASSO 2 — grava (rode só depois de conferir o passo 1) ──
-- with calc as (
--   select id, (custo * 2.5 + 6.00) / 0.96 as bruto
--   from public.brinquedos
--   where custo is not null
-- )
-- update public.brinquedos b
-- set preco_venda = greatest(19.90, floor(c.bruto)
--       + case when c.bruto - floor(c.bruto) <= 0.90 then 0.90 else 1.90 end)
-- from calc c
-- where b.id = c.id;
