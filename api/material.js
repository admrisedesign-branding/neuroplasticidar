// api/material.js — versão corrigida (preview WhatsApp/Facebook)
//
// O QUE MUDOU EM RELAÇÃO À VERSÃO ATUAL:
// 1. A resposta para bots NÃO redireciona mais (removidos o <meta http-equiv="refresh">
//    e o window.location). O crawler do WhatsApp seguia esse redirect, caía na home
//    — que não tem OG tags — e descartava o preview.
// 2. Não declara mais og:image:width/height/type fixos em 1200x630/jpeg. Isso só batia
//    com as imagens do Unsplash; com cover_image própria (PNG, outra proporção) o
//    WhatsApp recusava por divergência. Agora só declara se a imagem for o fallback.
// 3. Título e descrição passam por escape de HTML (aspas, &, <, >) — antes, um título
//    com aspas quebrava as meta tags.
// 4. Descrição vira linha única (sem quebras) e limite de 200 caracteres.

const SUPABASE_URL  = 'https://cifndytwoehbnmjllrml.supabase.co';
const SUPABASE_ANON = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNpZm5keXR3b2VoYm5tamxscm1sIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzg5NjM1OTIsImV4cCI6MjA5NDUzOTU5Mn0.Rkd_5t52cuQEJVPPN3sXPUukL6aEcGrwLtR2qx78Rto';
const SITE_URL      = 'https://neuroplasticidar.gruposja.com';

// escape obrigatório antes de injetar em atributo HTML
function esc(s = '') {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function slugify(text) {
  return text.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
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
  } catch (e) { console.error(e); }

  if (!material) { res.redirect(302, '/'); return; }

  // ---- imagem de capa ----
  const CATEGORY_COVERS = {
    'Redução de telas':    'https://images.unsplash.com/photo-1596495578065-6e0763fa1178?w=1200&h=630&fit=crop&q=80',
    'Funções executivas':  'https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=1200&h=630&fit=crop&q=80',
    'Aprendizagem lúdica': 'https://images.unsplash.com/photo-1471286174890-9c112ac6823f?w=1200&h=630&fit=crop&q=80',
    'Sono & Rotina':       'https://images.unsplash.com/photo-1555252333-9f8e92e65df9?w=1200&h=630&fit=crop&q=80',
    'Regulação emocional': 'https://images.unsplash.com/photo-1516627145497-ae6968895b74?w=1200&h=630&fit=crop&q=80',
    'Linguagem':           'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=1200&h=630&fit=crop&q=80',
  };

  let coverImage = material.cover_image;
  let isFallback = false;
  if (!coverImage) {
    coverImage = CATEGORY_COVERS[material.category] || CATEGORY_COVERS['Aprendizagem lúdica'];
    isFallback = true;
  }
  // og:image precisa ser URL absoluta
  if (coverImage && !/^https?:\/\//i.test(coverImage)) {
    coverImage = SITE_URL + (coverImage.startsWith('/') ? '' : '/') + coverImage;
  }

  const preco = material.is_free
    ? 'Gratuito'
    : `R$ ${Number(material.price).toFixed(2).replace('.', ',')}`;

  const descShort = (material.description || '')
    .replace(/\s+/g, ' ')   // tira quebras de linha
    .trim()
    .slice(0, 200);

  const ogTitle = esc(`${material.title} — Neuroplasticidar`);
  const ogDesc  = esc([preco, material.age_range, descShort].filter(Boolean).join(' · '));
  const ogImg   = esc(coverImage);
  const pageUrl = esc(`${SITE_URL}/m/${slug}`);
  const openUrl = `${SITE_URL}/?open=${material.id}`;

  // ---- bot ou usuário real? ----
  const ua = (req.headers['user-agent'] || '').toLowerCase();
  const isBot = /whatsapp|facebookexternalhit|facebot|twitterbot|telegrambot|linkedinbot|slackbot|discordbot|googlebot|bingbot|embedly|redditbot|pinterest|vkshare|crawler|spider|preview|curl|wget/i.test(ua);

  if (!isBot) {
    res.setHeader('Cache-Control', 'no-cache');
    res.redirect(302, openUrl);
    return;
  }

  // Só declara dimensões/tipo quando temos certeza (fallback Unsplash 1200x630 jpeg).
  const dimTags = isFallback ? `
  <meta property="og:image:width" content="1200">
  <meta property="og:image:height" content="630">
  <meta property="og:image:type" content="image/jpeg">` : '';

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
  <meta property="og:image:alt" content="${ogTitle}">${dimTags}
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${ogTitle}">
  <meta name="twitter:description" content="${ogDesc}">
  <meta name="twitter:image" content="${ogImg}">
</head>
<body>
  <!-- Página servida apenas para crawlers. NÃO redirecionar aqui:
       o robô do WhatsApp segue o redirect e perde as OG tags. -->
  <h1>${ogTitle}</h1>
  <p>${ogDesc}</p>
  <p><a href="${esc(openUrl)}">Abrir material</a></p>
</body>
</html>`);
}
