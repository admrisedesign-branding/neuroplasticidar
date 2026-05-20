// api/material.js
// Página dinâmica por material — Open Graph + compartilhamento WhatsApp

const SUPABASE_URL  = 'https://cifndytwoehbnmjllrml.supabase.co';
const SUPABASE_ANON = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNpZm5keXR3b2VoYm5tamxscm1sIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzg5NjM1OTIsImV4cCI6MjA5NDUzOTU5Mn0.Rkd_5t52cuQEJVPPN3sXPUukL6aEcGrwLtR2qx78Rto';
const SITE_URL      = 'https://neuroplasticidar.vercel.app';

export default async function handler(req, res) {
  const { slug } = req.query;

  if (!slug) {
    res.redirect(302, '/');
    return;
  }

  // Buscar material no Supabase pelo slug (título normalizado)
  let material = null;
  try {
    const response = await fetch(
      `${SUPABASE_URL}/rest/v1/materials?active=eq.true&select=*`,
      { headers: { apikey: SUPABASE_ANON, Authorization: `Bearer ${SUPABASE_ANON}` } }
    );
    const materials = await response.json();

    // Achar pelo slug gerado do título
    material = materials.find(m => slugify(m.title) === slug);
    if (!material) material = materials[0]; // fallback
  } catch (e) {
    console.error(e);
  }

  if (!material) {
    res.redirect(302, '/');
    return;
  }

  const pageUrl    = `${SITE_URL}/m/${slug}`;
  const siteUrl    = `${SITE_URL}/?material=${material.id}`;
  const coverImage = material.cover_image || `${SITE_URL}/og-default.png`;
  const preco      = material.is_free ? 'Gratuito' : `R$ ${Number(material.price).toFixed(2).replace('.', ',')}`;
  const precoOrig  = material.original_price ? `~~R$ ${Number(material.original_price).toFixed(2).replace('.', ',')}~~` : '';
  const descShort  = (material.description || '').slice(0, 120) + (material.description?.length > 120 ? '...' : '');
  const tags       = (material.tags || []).join(' · ');
  const emoji      = material.emoji || '📄';
  const bgColor    = material.cover_color || '#EEF2FF';

  const html = `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <title>${material.title} — Neuroplasticidar</title>

  <!-- Open Graph (WhatsApp, Instagram, Facebook, Telegram) -->
  <meta property="og:type"        content="product">
  <meta property="og:url"         content="${pageUrl}">
  <meta property="og:title"       content="${material.title}">
  <meta property="og:description" content="${descShort}">
  <meta property="og:image"       content="${coverImage}">
  <meta property="og:image:width" content="1200">
  <meta property="og:image:height" content="630">
  <meta property="og:site_name"   content="Neuroplasticidar">
  <meta property="og:locale"      content="pt_BR">

  <!-- Twitter Card -->
  <meta name="twitter:card"        content="summary_large_image">
  <meta name="twitter:title"       content="${material.title}">
  <meta name="twitter:description" content="${descShort}">
  <meta name="twitter:image"       content="${coverImage}">

  <!-- WhatsApp usa og: acima -->
  <meta name="description" content="${descShort}">

  <style>
    *{box-sizing:border-box;margin:0;padding:0}
    body{font-family:-apple-system,'Helvetica Neue',Arial,sans-serif;background:#FAF9F6;min-height:100vh;display:flex;flex-direction:column;align-items:center;justify-content:center;padding:20px}
    .card{background:#fff;border-radius:20px;box-shadow:0 8px 40px rgba(0,0,0,0.10);max-width:440px;width:100%;overflow:hidden}
    .cover{width:100%;height:220px;display:flex;align-items:center;justify-content:center;background:${bgColor};position:relative}
    .cover img{width:100%;height:100%;object-fit:cover}
    .cover-emoji{font-size:72px}
    .badge{position:absolute;top:16px;right:16px;background:rgba(255,255,255,0.92);backdrop-filter:blur(8px);border-radius:50px;padding:6px 14px;font-size:12px;font-weight:700;color:#1A3FBF}
    .body{padding:28px}
    .category{font-size:11px;font-weight:600;text-transform:uppercase;letter-spacing:1.5px;color:#A8A29E;margin-bottom:8px}
    .title{font-size:22px;font-weight:700;color:#0F0E0C;margin-bottom:10px;line-height:1.2;letter-spacing:-0.3px}
    .desc{font-size:14px;color:#44403C;line-height:1.7;font-weight:300;margin-bottom:16px}
    .tags{display:flex;flex-wrap:wrap;gap:6px;margin-bottom:20px}
    .tag{background:#F3EDE0;color:#44403C;font-size:11px;font-weight:500;padding:4px 10px;border-radius:50px}
    .price-row{display:flex;align-items:center;gap:12px;margin-bottom:24px}
    .price{font-size:28px;font-weight:700;color:#0F0E0C;font-family:Georgia,serif}
    .price.free{color:#2E6B3E}
    .price-orig{font-size:14px;color:#A8A29E;text-decoration:line-through}
    .btn{display:block;width:100%;text-align:center;background:#D4900A;color:#fff;text-decoration:none;padding:16px;border-radius:50px;font-size:15px;font-weight:600;letter-spacing:0.3px;transition:background .2s}
    .btn:hover{background:#B87A08}
    .btn.free{background:#2E6B3E}
    .btn.free:hover{background:#1d4d28}
    .footer{padding:16px 28px;border-top:1px solid #F3EDE0;display:flex;align-items:center;justify-content:space-between}
    .brand{display:flex;align-items:center;gap:8px;text-decoration:none}
    .brand-name{font-size:13px;font-weight:600;color:#0F0E0C}
    .brand-name span{color:#D4900A}
    .share-again{font-size:12px;color:#A8A29E;cursor:pointer;background:none;border:none;font-family:inherit}
    .share-again:hover{color:#0F0E0C}
  </style>
</head>
<body>
  <div class="card">
    <div class="cover">
      ${material.cover_image
        ? `<img src="${material.cover_image}" alt="${material.title}" onerror="this.parentElement.innerHTML='<span class=cover-emoji>${emoji}</span>'">`
        : `<span class="cover-emoji">${emoji}</span>`}
      <div class="badge">${material.category}</div>
    </div>
    <div class="body">
      <p class="category">${material.age_range || ''}</p>
      <h1 class="title">${material.title}</h1>
      <p class="desc">${material.description || ''}</p>
      ${tags ? `<div class="tags">${(material.tags||[]).map(t=>`<span class="tag">${t}</span>`).join('')}</div>` : ''}
      <div class="price-row">
        <span class="price ${material.is_free ? 'free' : ''}">${preco}</span>
        ${material.original_price ? `<span class="price-orig">R$ ${Number(material.original_price).toFixed(2).replace('.', ',')}</span>` : ''}
      </div>
      <a href="${siteUrl}" class="btn ${material.is_free ? 'free' : ''}">
        ${material.is_free ? '📥 Baixar gratuitamente' : `🛒 Comprar — ${preco}`}
      </a>
    </div>
    <div class="footer">
      <a href="${SITE_URL}" class="brand">
        <span style="font-size:18px">🦕</span>
        <span class="brand-name"><span>Neuro</span>plasticidar</span>
      </a>
      <button class="share-again" onclick="shareThis()">Compartilhar ↗</button>
    </div>
  </div>

  <script>
    async function shareThis(){
      const data = {
        title: '${material.title} — Neuroplasticidar',
        text: '${emoji} *${material.title}*\\n${material.category} · ${material.age_range}\\n${preco}\\n\\n${descShort}',
        url: '${pageUrl}'
      };
      if(navigator.share){
        try{ await navigator.share(data); }catch(e){}
      } else {
        const wpp = 'https://wa.me/?text=' + encodeURIComponent(data.text + '\\n\\n👉 ' + data.url);
        window.open(wpp, '_blank');
      }
    }
    // Auto redireciona para o site abrindo a dialog após 0ms se vier de compartilhamento
    // (não redireciona imediatamente para que o OG preview funcione)
  </script>
</body>
</html>`;

  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  res.setHeader('Cache-Control', 's-maxage=3600, stale-while-revalidate');
  res.status(200).send(html);
}

function slugify(text) {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}
