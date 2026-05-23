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
  const siteUrl    = `${SITE_URL}/?open=${material.id}`;
  const buyUrl     = `${SITE_URL}/?buy=${material.id}`;
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
  const title = (material.title||'').toLowerCase();
  let coverImage = material.cover_image;
  if(!coverImage){
    for(const [kw,url] of Object.entries(TITLE_COVERS)){
      if(title.includes(kw)){coverImage=url;break;}
    }
    if(!coverImage) coverImage = CATEGORY_COVERS[material.category] || CATEGORY_COVERS['Aprendizagem lúdica'];
  }
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
  <meta property="og:type"        content="website">
  <meta property="og:url"         content="${pageUrl}">
  <meta property="og:title"       content="${material.title} — Neuroplasticidar">
  <meta property="og:description" content="${descShort}">
  <meta property="og:image"       content="${coverImage}">
  <meta property="og:image:secure_url" content="${coverImage}">
  <meta property="og:image:width" content="1200">
  <meta property="og:image:height" content="630">
  <meta property="og:image:type"  content="image/jpeg">
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
      <a href="${material.is_free ? siteUrl : buyUrl}" class="btn ${material.is_free ? 'free' : ''}">
        ${material.is_free ? '📥 Baixar gratuitamente' : `🛒 Comprar — ${preco}`}
      </a>
    </div>
    <a href="${siteUrl}" class="btn" style="margin-bottom:10px;background:#1A3FBF;display:block">
        👉 Ver material no site
      </a>
    <div class="footer">
      <a href="${SITE_URL}" class="brand">
        <img src="data:image/png;base64,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" style="width:28px;height:28px;object-fit:contain;border-radius:6px">
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
  res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
  res.setHeader('Pragma', 'no-cache');
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
