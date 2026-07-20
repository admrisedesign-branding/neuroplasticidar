// api/material.js — V3 (preview sem depender de detectar robô)
//
// POR QUE MUDOU DE NOVO:
// A V2 decidia pelo user-agent: robô conhecido → OG tags; qualquer outro → redirect.
// Só que WhatsApp Web/Desktop, Instagram, iMessage e vários outros geram o preview
// com user-agent de NAVEGADOR comum. Eles caíam no redirect e perdiam as tags.
//
// SOLUÇÃO: servir as OG tags para TODO MUNDO e redirecionar a pessoa real só com
// JavaScript. Robôs não executam JavaScript — então eles leem as tags e param ali.
// A pessoa real é redirecionada instantaneamente e nem percebe.
//
// IMPORTANTE: não usar <meta http-equiv="refresh"> aqui. Robô SEGUE meta refresh
// (foi o que quebrava a versão original), mas NÃO executa <script>.

const SUPABASE_URL  = 'https://cifndytwoehbnmjllrml.supabase.co';
const SUPABASE_ANON = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNpZm5keXR3b2VoYm5tamxscm1sIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzg5NjM1OTIsImV4cCI6MjA5NDUzOTU5Mn0.Rkd_5t52cuQEJVPPN3sXPUukL6aEcGrwLtR2qx78Rto';
const SITE_URL      = 'https://neuroplasticidar.gruposja.com';
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

async function isPublicImage(url, ms = 2000) {
  if (!url) return false;
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), ms);
  try {
    let r = await fetch(url, { method: 'HEAD', signal: ctrl.signal, redirect: 'follow' });
    if (r.status === 405 || r.status === 501) {
      r = await fetch(url, { method: 'GET', headers: { Range: 'bytes=0-1023' }, signal: ctrl.signal });
    }
    if (!r.ok) return false;
    return (r.headers.get('content-type') || '').toLowerCase().startsWith('image/');
  } catch { return false; }
  finally { clearTimeout(t); }
}

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

  const coverImage = await pickCover([
    material.cover_image,
    DEFAULT_COVER,
    CATEGORY_COVERS[material.category],
  ]);

  const preco = material.is_free
    ? 'Gratuito'
    : `R$ ${Number(material.price).toFixed(2).replace('.', ',')}`;

  const descShort = (material.description || '').replace(/\s+/g, ' ').trim().slice(0, 200);

  const ogTitle = esc(`${material.title} — Neuroplasticidar`);
  const ogDesc  = esc([preco, material.age_range, descShort].filter(Boolean).join(' · '));
  const ogImg   = esc(coverImage);
  const pageUrl = esc(`${SITE_URL}/m/${slug}`);
  const openEsc = esc(openUrl);

  // MESMA resposta para todos. Robô lê as tags; pessoa é levada pelo <script>.
  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  res.setHeader('Cache-Control', 'public, max-age=300');
  res.status(200).send(`<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
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
  <link rel="canonical" href="${pageUrl}">
  <style>
    body{margin:0;min-height:100vh;display:flex;align-items:center;justify-content:center;
         font-family:system-ui,-apple-system,'Segoe UI',sans-serif;background:#FFF9F0;color:#2E7D32;text-align:center}
    .box{padding:24px}
    img{width:96px;height:96px;border-radius:50%}
    p{margin:14px 0 0;font-size:15px;color:#666}
    a{color:#4C7DF0}
  </style>
</head>
<body>
  <div class="box">
    <img src="${SITE_URL}/assets/dino-icon.png" alt="Neuroplasticidar">
    <p>Abrindo o material…</p>
    <p><a href="${openEsc}">Clique aqui se não abrir automaticamente</a></p>
  </div>
  <!-- Só JavaScript. Robôs não executam isso, então eles ficam com as OG tags acima. -->
  <script>window.location.replace(${JSON.stringify(openUrl)});</script>
</body>
</html>`);
}
