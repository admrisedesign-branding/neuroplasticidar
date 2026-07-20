// api/material.js — versão final (preview WhatsApp/Facebook à prova de falha)
//
// MUDANÇAS EM RELAÇÃO À VERSÃO ANTERIOR:
// 1. A função agora TESTA a imagem de capa antes de usá-la (HEAD com timeout de 2,5s).
//    Se a URL não responder 200 com content-type de imagem — bucket privado, arquivo
//    apagado, link quebrado — ela cai automaticamente para uma capa pública do próprio
//    site. Resultado: o preview nunca mais quebra por causa da imagem.
// 2. Ordem de fallback: cover_image → /capas/og-default.jpg (no repositório) → Unsplash.
// 3. Mantém: sem redirect na resposta do bot, escape de HTML, sem dimensões fixas.
//
// PARA FUNCIONAR 100%, coloque no repositório o arquivo:
//    capas/og-default.jpg   (1200x630, JPEG — use o og-kit-atividades-1200x630.jpg)

const SUPABASE_URL  = 'https://cifndytwoehbnmjllrml.supabase.co';
const SUPABASE_ANON = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNpZm5keXR3b2VoYm5tamxscm1sIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzg5NjM1OTIsImV4cCI6MjA5NDUzOTU5Mn0.Rkd_5t52cuQEJVPPN3sXPUukL6aEcGrwLtR2qx78Rto';
const SITE_URL      = 'https://neuroplasticidar.gruposja.com';

// capa padrão do site — precisa existir em capas/og-default.jpg
const DEFAULT_COVER = `${SITE_URL}/capas/og-default.jpg`;

const CATEGORY_COVERS = {
  'Redução de telas':    'https://images.unsplash.com/photo-1596495578065-6e0763fa1178?w=1200&h=630&fit=crop&q=80',
  'Funções executivas':  'https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=1200&h=630&fit=crop&q=80',
  'Aprendizagem lúdica': 'https://images.unsplash.com/photo-1471286174890-9c112ac6823f?w=1200&h=630&fit=crop&q=80',
  'Sono & Rotina':       'https://images.unsplash.com/photo-1555252333-9f8e92e65df9?w=1200&h=630&fit=crop&q=80',
  'Regulação emocional': 'https://images.unsplash.com/photo-1516627145497-ae6968895b74?w=1200&h=630&fit=crop&q=80',
  'Linguagem':           'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=1200&h=630&fit=crop&q=80',
};

function esc(s = '') {
  return String(s)
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
}

function slugify(text) {
  return text.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

function absolutize(url) {
  if (!url) return null;
  if (/^https?:\/\//i.test(url)) return url;
  return SITE_URL + (url.startsWith('/') ? '' : '/') + url;
}

// Testa se a URL responde como imagem pública. Timeout curto: o robô do
// WhatsApp desiste rápido, então não podemos travar aqui.
async function isPublicImage(url, ms = 2500) {
  if (!url) return false;
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), ms);
  try {
    let r = await fetch(url, { method: 'HEAD', signal: ctrl.signal, redirect: 'follow' });
    // alguns storages não aceitam HEAD — tenta GET parcial
    if (r.status === 405 || r.status === 501) {
      r = await fetch(url, { method: 'GET', headers: { Range: 'bytes=0-1023' }, signal: ctrl.signal });
    }
    if (!r.ok) return false;
    const ct = (r.headers.get('content-type') || '').toLowerCase();
    return ct.startsWith('image/');
  } catch (e) {
    return false;
  } finally {
    clearTimeout(t);
  }
}

// Devolve a primeira imagem da lista que realmente funciona.
async function pickCover(candidates) {
  for (const url of candidates) {
    const abs = absolutize(url);
    if (abs && await isPublicImage(abs)) return abs;
  }
  return absolutize(DEFAULT_COVER);
}

export default async function handler(req, res) {
  const { slug } = req.query;
  if (!slug) { res.redirect(302, '/'); return; }

  let material = null;
  try {
    const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(slug);
    if (isUUID) {
      const r = await fetch(`${SUPABASE_URL}/rest/v1/materials?id=eq.${slug}&select=*&limit=1`,
        { headers: { apikey: SUPABASE_ANON, Authorization: `Bearer ${SUPABASE_ANON}` } });
      const d = await r.json();
      material = d[0] || null;
    }
    if (!material) {
      const r = await fetch(`${SUPABASE_URL}/rest/v1/materials?active=eq.true&select=*`,
        { headers: { apikey: SUPABASE_ANON, Authorization: `Bearer ${SUPABASE_ANON}` } });
      const all = await r.json();
      material = all.find(m => slugify(m.title) === slug) || all[0];
    }
  } catch (e) { console.error('supabase:', e); }

  if (!material) { res.redirect(302, '/'); return; }

  const openUrl = `${SITE_URL}/?open=${material.id}`;

  // ---- usuário real: redireciona (não precisa validar imagem, é mais rápido) ----
  const ua = (req.headers['user-agent'] || '').toLowerCase();
  const isBot = /whatsapp|facebookexternalhit|facebot|twitterbot|telegrambot|linkedinbot|slackbot|discordbot|googlebot|bingbot|embedly|redditbot|pinterest|vkshare|whatsapp-preview|crawler|spider|preview|curl|wget/i.test(ua);

  if (!isBot) {
    res.setHeader('Cache-Control', 'no-cache');
    res.redirect(302, openUrl);
    return;
  }

  // ---- bot: escolhe uma imagem que comprovadamente funciona ----
  const coverImage = await pickCover([
    material.cover_image,
    DEFAULT_COVER,
    CATEGORY_COVERS[material.category],
    CATEGORY_COVERS['Aprendizagem lúdica'],
  ]);

  const preco = material.is_free
    ? 'Gratuito'
    : `R$ ${Number(material.price).toFixed(2).replace('.', ',')}`;

  const descShort = (material.description || '').replace(/\s+/g, ' ').trim().slice(0, 200);

  const ogTitle = esc(`${material.title} — Neuroplasticidar`);
  const ogDesc  = esc([preco, material.age_range, descShort].filter(Boolean).join(' · '));
  const ogImg   = esc(coverImage);
  const pageUrl = esc(`${SITE_URL}/m/${slug}`);

  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  res.setHeader('Cache-Control', 'public, max-age=300');
  res.status(200).send(`<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <title>${ogTitle}</title>
  <meta name="description" content="${ogDesc}">
  <meta property="og:type" content="website">
  <meta property="og:site_name" content="Neuroplasticidar">
  <meta property="og:locale" content="pt_BR">
  <meta property="og:url" content="${pageUrl}">
  <meta property="og:title" content="${ogTitle}">
  <meta property="og:description" content="${ogDesc}">
  <meta property="og:image" content="${ogImg}">
  <meta property="og:image:secure_url" content="${ogImg}">
  <meta property="og:image:alt" content="${ogTitle}">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${ogTitle}">
  <meta name="twitter:description" content="${ogDesc}">
  <meta name="twitter:image" content="${ogImg}">
</head>
<body>
  <!-- Página servida só para crawlers. NÃO redirecionar daqui:
       o robô do WhatsApp segue o redirect e perde as OG tags. -->
  <h1>${ogTitle}</h1>
  <p>${ogDesc}</p>
  <p><a href="${esc(openUrl)}">Abrir material</a></p>
</body>
</html>`);
}
