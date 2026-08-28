// api/publicar-artigo.js
//
// UMA função, dois modos:
//   POST { id, preview:true }  → devolve o HTML renderizado, não grava nada.
//   POST { id }                → renderiza, commita no GitHub e marca publicado.
//
// O Vercel republica sozinho a cada commit. Jaque nunca abre o GitHub.
//
// Variáveis de ambiente necessárias na Vercel:
//   GITHUB_TOKEN   — Personal Access Token (fine-grained) com Contents: Read+Write
//                    APENAS neste repositório.
//   GITHUB_REPO    — ex: admrisedesign-branding/neuroplasticidar
//   GITHUB_BRANCH  — ex: main
//   SUPABASE_SERVICE_KEY — service_role key (NUNCA no front-end).
//
// AUTENTICAÇÃO: o admin manda o access_token da sessão Supabase de quem está
// logado. A função valida o token e confere se o e-mail está em team_members.
// Nada de segredo compartilhado no front-end — ele vazaria em qualquer inspeção.

const SUPABASE_URL = 'https://cifndytwoehbnmjllrml.supabase.co';
const SITE = 'https://neuroplasticidar.gruposja.com';
const GA = 'G-0XB74DEMLS';

const OBJ_LABEL = {
  'linguagem': 'Falar e se expressar',
  'comunicacao': 'Se fazer entender',
  'vocabulario': 'Aprender palavras novas',
  'motora-fina': 'Mãos, pinça e traçado',
  'motora-grossa': 'Corpo, equilíbrio e força',
  'sensorial': 'Sons, texturas e toque',
  'avd': 'Vestir, comer e higiene',
  'emocoes': 'Lidar com o que sente',
  'pre-alfa': 'Preparar para ler',
  'alfa': 'Ler e escrever',
  'reforcadores': 'Motivar e engajar',
  'simbolico': 'Faz de conta',
  'funcoes': 'Atenção, foco e planejamento',
  'telas': 'Menos telas',
  'sono': 'Sono e rotina'
};

const esc = s => String(s == null ? '' : s)
  .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

// Parágrafos: aceita texto simples com quebras de linha duplas.
const paras = t => String(t || '').trim().split(/\n{2,}/)
  .filter(Boolean).map(p => `<p>${p.replace(/\n/g, '<br>')}</p>`).join('\n');

const dataBR = d => new Date(d || Date.now())
  .toLocaleDateString('pt-BR', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'America/Manaus' });

function renderArtigo(a, irmas, css) {
  const url = `${SITE}/${a.pasta}/${a.slug}`;
  const objetivos = Array.isArray(a.objetivos) ? a.objetivos : [];
  const ids = objetivos.join(',');

  const faq = {
    '@context': 'https://schema.org', '@type': 'FAQPage',
    mainEntity: (a.faq || []).map(f => ({
      '@type': 'Question', name: f.pergunta,
      acceptedAnswer: { '@type': 'Answer', text: f.resposta }
    }))
  };
  const art = {
    '@context': 'https://schema.org', '@type': 'Article',
    headline: a.h1, description: a.descricao, inLanguage: 'pt-BR',
    mainEntityOfPage: url, image: `${SITE}/dino-logo.png`, articleSection: a.badge || '',
    author: { '@type': 'Organization', name: a.autor || 'Neuroplasticidar' },
    publisher: {
      '@type': 'Organization', name: 'Neuroplasticidar',
      logo: { '@type': 'ImageObject', url: `${SITE}/dino-logo.png` }
    },
    datePublished: (a.publicado_em || a.created_at || new Date().toISOString()).slice(0, 10),
    dateModified: (a.updated_at || new Date().toISOString()).slice(0, 10)
  };
  const bc = {
    '@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Início', item: SITE + '/' },
      { '@type': 'ListItem', position: 2, name: 'Sinais', item: `${SITE}/${a.pasta}/` },
      { '@type': 'ListItem', position: 3, name: a.h1, item: url }]
  };

  const bloco = arr => (arr || []).map(b =>
    `<div class="sinal-bloco"><h3>${esc(b.titulo)}</h3><p>${b.texto}</p></div>`).join('\n');

  return `<!DOCTYPE html>
<html lang="pt-BR">
<head>
<script async src="https://www.googletagmanager.com/gtag/js?id=${GA}"></script>
<script>window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${GA}');</script>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${esc(a.title_seo)} &mdash; Neuroplasticidar</title>
<meta name="description" content="${esc(a.descricao)}">
<meta name="keywords" content="${esc(a.keywords)}">
<meta name="author" content="${esc(a.autor)}">
<meta property="og:type" content="article">
<meta property="og:title" content="${esc(a.title_seo)}">
<meta property="og:description" content="${esc(a.descricao)}">
<meta property="og:url" content="${url}">
<meta property="og:image" content="${SITE}/dino-logo.png">
<meta property="og:site_name" content="Neuroplasticidar">
<meta property="og:locale" content="pt_BR">
<meta property="article:section" content="${esc(a.badge)}">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${esc(a.title_seo)}">
<meta name="twitter:description" content="${esc(a.descricao)}">
<meta name="twitter:image" content="${SITE}/dino-logo.png">
<link rel="canonical" href="${url}">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400&family=DM+Sans:wght@300;400;500;600&display=swap" rel="stylesheet">
<script type="application/ld+json">${JSON.stringify([art, faq, bc])}</script>
<style>${css}</style>
</head>
<body>

<nav class="blog-nav">
  <div class="blog-nav-inner">
    <a href="/" class="blog-logo">
      <img src="/dino-logo.png" alt="Neuroplasticidar">
      <span>Neuroplasticidar</span>
    </a>
    <div class="blog-nav-links">
      <a href="/sinais/">Sinais</a>
      <a href="/blog/">Blog</a>
      <a href="/#objetivos">Objetivos</a>
      <a href="/#kits">Kits</a>
      <a href="/#especialista">Sessões</a>
    </div>
    <a href="/" class="btn-back">&larr; Voltar ao site</a>
  </div>
</nav>

<p class="bc"><a href="/">Início</a> &rsaquo; <a href="/${a.pasta}/">Sinais</a> &rsaquo; ${esc(a.h1)}</p>

<article>
  <header class="article-hero">
    <div class="article-hero-inner">
      ${a.badge ? `<div class="category-badge">${esc(a.badge)}</div>` : ''}
      <h1 class="article-title">${esc(a.h1)}</h1>
      <p class="article-subtitle">${esc(a.descricao)}</p>
      <div class="article-meta">
        <span>${dataBR(a.publicado_em)}</span>
        <span>${esc(a.tempo_leitura)}</span>
        <span>${esc(a.autor)}</span>
      </div>
    </div>
  </header>

<div class="disclaimer"><div><p>Esta página é informativa e <strong>não faz diagnóstico</strong>. Ela serve para você chegar na consulta sabendo o que observar &mdash; não para substituí-la.</p></div></div>

  <div class="article-body">
${paras(a.lead)}

${(a.por_tras || []).length ? `<h2>O que costuma estar por trás</h2>\n${bloco(a.por_tras)}` : ''}

${(a.quando || []).length ? `<h2>Quando procurar avaliação</h2>\n<ul>\n${(a.quando || []).map(i => `  <li>${i}</li>`).join('\n')}\n</ul>` : ''}
${a.quando_nota ? `<div class="callout"><div class="callout-title">Vale saber</div><p>${a.quando_nota}</p></div>` : ''}

${(a.profissionais || []).length ? `<h2>Qual profissional avalia isso</h2>\n<div class="prof-lista">\n${(a.profissionais || []).map(p => `  <div><h3>${esc(p.titulo)}</h3><p>${p.texto}</p></div>`).join('\n')}\n</div>` : ''}

${(a.em_casa || []).length ? `<h2>O que dá para fazer em casa esta semana</h2>\n${bloco(a.em_casa)}` : ''}

${objetivos.length ? `<h2>Materiais para trabalhar isso</h2>
<p>No acervo, tudo é organizado por objetivo de desenvolvimento. Para o que você acabou de ler, os objetivos relacionados são:</p>
<div class="obj-links">
${objetivos.map(o => `  <a href="/?plano=${o}">${esc(OBJ_LABEL[o] || o)}</a>`).join('\n')}
</div>
<p><a href="/?plano=${ids}"><strong>Ver todos os materiais desses objetivos juntos &rarr;</strong></a></p>` : ''}

${(a.faq || []).length ? `<h2>Perguntas frequentes</h2>\n${(a.faq || []).map(f => `<details class="sinal-faq"><summary>${esc(f.pergunta)}</summary><p>${f.resposta}</p></details>`).join('\n')}` : ''}

    <div class="article-cta">
      <h3>Não sabe por onde começar?</h3>
      <p>Faça o quiz e receba a indicação da nossa especialista &mdash; ou veja os materiais dos objetivos ligados a este sinal.</p>
      <div class="btns">
        <a href="/#quiz" class="cta-primary">Fazer o quiz gratuito</a>
        <a href="/#especialista" class="cta-secondary">Sessão em casa (Manaus)</a>
      </div>
    </div>
  </div>
</article>

${irmas && irmas.length ? `<section class="related">
  <h2>Outros sinais que pais costumam pesquisar</h2>
  <div class="related-grid">
${irmas.map(o => `    <a href="/${o.pasta}/${o.slug}" class="related-card">
      <div class="related-cat">${esc(o.badge || '')}</div>
      <h3>${esc(o.h1)}</h3>
      <p>${esc((o.descricao || '').slice(0, 110))}&hellip;</p>
    </a>`).join('\n')}
  </div>
</section>` : ''}

<footer class="blog-footer">
  <p style="max-width:680px;margin:0 auto 10px;line-height:1.6">Este conteúdo é informativo e não substitui avaliação profissional. Nenhuma informação aqui serve para diagnosticar.</p>
  <p>&copy; 2026 Neuroplasticidar &middot; Manaus, AM &middot; <a href="/sinais/">Todos os sinais</a> &middot; <a href="/blog/">Blog</a> &middot; <a href="/">Voltar ao site</a></p>
</footer>

</body>
</html>`;
}

// ── Supabase REST (service key, server-side) ──────────────
async function sb(path, opts = {}) {
  const key = process.env.SUPABASE_SERVICE_KEY;
  const r = await fetch(`${SUPABASE_URL}/rest/v1/${path}`, {
    ...opts,
    headers: {
      apikey: key, Authorization: `Bearer ${key}`,
      'Content-Type': 'application/json', Prefer: 'return=representation',
      ...(opts.headers || {})
    }
  });
  if (!r.ok) throw new Error(`Supabase ${r.status}: ${await r.text()}`);
  return r.status === 204 ? null : r.json();
}

// ── GitHub Contents API ───────────────────────────────────
async function ghGet(caminho) {
  const r = await fetch(
    `https://api.github.com/repos/${process.env.GITHUB_REPO}/contents/${caminho}?ref=${process.env.GITHUB_BRANCH || 'main'}`,
    { headers: { Authorization: `Bearer ${process.env.GITHUB_TOKEN}`, Accept: 'application/vnd.github+json' } }
  );
  if (r.status === 404) return null;
  if (!r.ok) throw new Error(`GitHub GET ${r.status}: ${await r.text()}`);
  return r.json();
}

async function ghPut(caminho, conteudo, mensagem, sha) {
  const r = await fetch(
    `https://api.github.com/repos/${process.env.GITHUB_REPO}/contents/${caminho}`,
    {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
        Accept: 'application/vnd.github+json', 'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        message: mensagem,
        content: Buffer.from(conteudo, 'utf-8').toString('base64'),
        branch: process.env.GITHUB_BRANCH || 'main',
        ...(sha ? { sha } : {})
      })
    }
  );
  if (!r.ok) throw new Error(`GitHub PUT ${r.status}: ${await r.text()}`);
  return r.json();
}

// O CSS vive num arquivo só no repositório — assim admin e site nunca divergem.
let cssCache = null;
async function pegarCss() {
  if (cssCache) return cssCache;
  const f = await ghGet('assets/artigo.css');
  if (!f) throw new Error('assets/artigo.css não encontrado no repositório');
  cssCache = Buffer.from(f.content, 'base64').toString('utf-8');
  return cssCache;
}

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ erro: 'Use POST' });
  const token = (req.headers.authorization || '').replace(/^Bearer\s+/i, '');
  if (!token) return res.status(401).json({ erro: 'Sem token de sessão' });

  try {
    // 1. O token é válido?
    const ru = await fetch(`${SUPABASE_URL}/auth/v1/user`, {
      headers: { apikey: process.env.SUPABASE_SERVICE_KEY, Authorization: `Bearer ${token}` }
    });
    if (!ru.ok) return res.status(401).json({ erro: 'Sessão inválida ou expirada' });
    const usuario = await ru.json();

    // 2. Essa pessoa é da equipe?
    const equipe = await sb(`team_members?email=eq.${encodeURIComponent(usuario.email)}&select=email`);
    if (!equipe || !equipe.length) {
      return res.status(403).json({ erro: 'Seu e-mail não está cadastrado na equipe' });
    }
    const { id, preview } = req.body || {};
    const publicado_por = usuario.email;
    if (!id) return res.status(400).json({ erro: 'Falta o id do artigo' });

    const [a] = await sb(`artigos?id=eq.${id}&select=*`);
    if (!a) return res.status(404).json({ erro: 'Artigo não encontrado' });

    const irmas = await sb(
      `artigos?status=eq.publicado&pasta=eq.${a.pasta}&id=neq.${id}` +
      `&select=slug,h1,descricao,badge,pasta&order=publicado_em.desc&limit=3`
    );

    const css = await pegarCss();
    const html = renderArtigo(a, irmas, css);

    // PREVIEW: devolve e sai. Nada é gravado.
    if (preview) return res.status(200).json({ html });

    // PUBLICAR: commita no repositório.
    const caminho = `${a.pasta}/${a.slug}.html`;
    const atual = await ghGet(caminho);
    const commit = await ghPut(
      caminho, html,
      `Publica artigo: ${a.slug}${publicado_por ? ` (via ${publicado_por})` : ''}`,
      atual ? atual.sha : undefined
    );

    await sb(`artigos?id=eq.${id}`, {
      method: 'PATCH',
      body: JSON.stringify({
        status: 'publicado',
        publicado_em: new Date().toISOString(),
        publicado_por: publicado_por || null,
        sha_github: commit.content.sha
      })
    });

    return res.status(200).json({
      ok: true, url: `${SITE}/${a.pasta}/${a.slug}`,
      commit: commit.commit.html_url,
      aviso: 'A Vercel republica em cerca de um minuto.'
    });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ erro: String(e.message || e) });
  }
}
