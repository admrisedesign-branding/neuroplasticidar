// api/material.js
// Redireciona direto para o site abrindo a dialog do produto
// com OG tags para preview no WhatsApp

const SUPABASE_URL  = 'https://cifndytwoehbnmjllrml.supabase.co';
const SUPABASE_ANON = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNpZm5keXR3b2VoYm5tamxscm1sIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzg5NjM1OTIsImV4cCI6MjA5NDUzOTU5Mn0.Rkd_5t52cuQEJVPPN3sXPUukL6aEcGrwLtR2qx78Rto';
const SITE_URL      = 'https://neuroplasticidar.vercel.app';

export default async function handler(req, res) {
  const { slug } = req.query;
  if (!slug) { res.redirect(302, '/'); return; }

  // Buscar material no Supabase
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
  } catch(e) { console.error(e); }

  if (!material) { res.redirect(302, '/'); return; }

  // Imagem de capa — usa placeholder temático se não tiver
  const TITLE_COVERS = {
    'menos tela':        'https://images.unsplash.com/photo-1596495578065-6e0763fa1178?w=1200&h=630&fit=crop&q=80',
    'atenção':           'https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?w=1200&h=630&fit=crop&q=80',
    'foco':              'https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?w=1200&h=630&fit=crop&q=80',
    'funções executivas':'https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=1200&h=630&fit=crop&q=80',
    'brincadeiras':      'https://images.unsplash.com/photo-1471286174890-9c112ac6823f?w=1200&h=630&fit=crop&q=80',
    'rotina':            'https://images.unsplash.com/photo-1555252333-9f8e92e65df9?w=1200&h=630&fit=crop&q=80',
    'sono':              'https://images.unsplash.com/photo-1555252333-9f8e92e65df9?w=1200&h=630&fit=crop&q=80',
    'emoções':           'https://images.unsplash.com/photo-1516627145497-ae6968895b74?w=1200&h=630&fit=crop&q=80',
    'sentimentos':       'https://images.unsplash.com/photo-1516627145497-ae6968895b74?w=1200&h=630&fit=crop&q=80',
    'linguagem':         'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=1200&h=630&fit=crop&q=80',
  };
  const CATEGORY_COVERS = {
    'Redução de telas':    'https://images.unsplash.com/photo-1596495578065-6e0763fa1178?w=1200&h=630&fit=crop&q=80',
    'Funções executivas':  'https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=1200&h=630&fit=crop&q=80',
    'Aprendizagem lúdica': 'https://images.unsplash.com/photo-1471286174890-9c112ac6823f?w=1200&h=630&fit=crop&q=80',
    'Sono & Rotina':       'https://images.unsplash.com/photo-1555252333-9f8e92e65df9?w=1200&h=630&fit=crop&q=80',
    'Regulação emocional': 'https://images.unsplash.com/photo-1516627145497-ae6968895b74?w=1200&h=630&fit=crop&q=80',
    'Linguagem':           'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=1200&h=630&fit=crop&q=80',
  };

  const title = (material.title || '').toLowerCase();
  let coverImage = material.cover_image;
  if (!coverImage) {
    for (const [kw, url] of Object.entries(TITLE_COVERS)) {
      if (title.includes(kw)) { coverImage = url; break; }
    }
    if (!coverImage) coverImage = CATEGORY_COVERS[material.category] || CATEGORY_COVERS['Aprendizagem lúdica'];
  }

  const preco = material.is_free ? 'Gratuito' : `R$ ${Number(material.price).toFixed(2).replace('.', ',')}`;
  const descShort = (material.description || '').slice(0, 160);
  const ogTitle = `${material.title} — Neuroplasticidar`;
  const ogDesc = `${preco} · ${material.age_range || ''} · ${descShort}`;
  const pageUrl = `${SITE_URL}/m/${slug}`;
  const openUrl = `${SITE_URL}/?open=${material.id}`;

  // Detecta se é bot/crawler (WhatsApp, Facebook, etc) ou usuário real
  const ua = (req.headers['user-agent'] || '').toLowerCase();
  const isBot = /whatsapp|facebookexternalhit|twitterbot|telegrambot|linkedinbot|slackbot|discordbot|googlebot|bingbot|crawler|spider|curl|wget/i.test(ua);

  if (!isBot) {
    // Usuário real — redireciona direto para o site abrindo a dialog
    res.setHeader('Cache-Control', 'no-cache');
    res.redirect(302, openUrl);
    return;
  }

  // Bot/crawler — serve página com OG tags para preview
  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
  res.status(200).send(`<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <title>${ogTitle}</title>
  <meta property="og:type" content="website">
  <meta property="og:url" content="${pageUrl}">
  <meta property="og:title" content="${ogTitle}">
  <meta property="og:description" content="${ogDesc}">
  <meta property="og:image" content="${coverImage}">
  <meta property="og:image:secure_url" content="${coverImage}">
  <meta property="og:image:width" content="1200">
  <meta property="og:image:height" content="630">
  <meta property="og:image:type" content="image/jpeg">
  <meta property="og:site_name" content="Neuroplasticidar">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${ogTitle}">
  <meta name="twitter:description" content="${ogDesc}">
  <meta name="twitter:image" content="${coverImage}">
  <meta http-equiv="refresh" content="0;url=${openUrl}">
</head>
<body>
  <script>window.location.href = '${openUrl}';</script>
</body>
</html>`);
}

function slugify(text) {
  return text.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}
