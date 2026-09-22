
const SUPABASE_URL='https://cifndytwoehbnmjllrml.supabase.co';
const SUPABASE_ANON='eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNpZm5keXR3b2VoYm5tamxscm1sIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzg5NjM1OTIsImV4cCI6MjA5NDUzOTU5Mn0.Rkd_5t52cuQEJVPPN3sXPUukL6aEcGrwLtR2qx78Rto';
const MP_PUBLIC_KEY='APP_USR-794de7bc-2c31-494a-9bd3-645ab31ec2c8';
const IS_TEST_MODE=false;
const ADMIN_EMAIL='joicealmeida.jc@gmail.com';
const ADMIN_PASS='neuro@admin2025';
const IRMA_EMAIL='jaquelineaten@gmail.com';
const IRMA_MP_EMAIL='jaquelineaten@gmail.com';
const WPP='5592991479457';
const sb=window.supabase.createClient(SUPABASE_URL,SUPABASE_ANON);

// === Captura de interesse — multi-perfil ===
const PERFIL_CFG={
  criador:{
    titulo:'Você cria materiais para crianças neurodivergentes?',
    lead:'Terapeutas, fonoaudiólogos, pedagogos, psicólogos e outros profissionais: queremos colocar <em>seus</em> materiais nas mãos de quem precisa deles.',
    features:['Sua autoria preservada e creditada','Alcance famílias e profissionais de todo o Brasil','Você define o material; cuidamos da venda e entrega'],
    showProf:true, labelProf:'Profissão / Área', phProf:'Ex.: Fonoaudióloga, Pedagoga, Terapeuta Ocupacional...',
    showTipo:true, labelTipo:'Que tipo de material você cria?', phTipo:'Ex.: atividades de linguagem, jogos de emoções, rotinas visuais...',
    labelMsg:'Mensagem (opcional)', phMsg:'Conte um pouco sobre o que você gostaria de oferecer.'
  },
  clinica:{
    titulo:'Conteúdo científico de qualidade para sua clínica',
    lead:'Tenha à mão materiais com embasamento para usar com seus pacientes — prontos, organizados e pensados por especialistas. Menos tempo preparando, mais tempo cuidando.',
    features:['Materiais com embasamento, prontos para aplicar','Acervo organizado por objetivo e faixa etária','Condições especiais para uso recorrente'],
    showProf:true, labelProf:'Nome da clínica / especialidade', phProf:'Ex.: Clínica de Fonoaudiologia, Consultório de Psicologia...',
    showTipo:true, labelTipo:'Que tipo de material você procura?', phTipo:'Ex.: linguagem, regulação emocional, funções executivas...',
    labelMsg:'Mensagem (opcional)', phMsg:'Conte um pouco sobre a necessidade da sua clínica.'
  },
  escola:{
    titulo:'Materiais para a sua escola ou instituição',
    lead:'Apoie professores e famílias com materiais de desenvolvimento infantil prontos para aplicar — em sala de aula, no AEE ou para enviar pra casa.',
    features:['Materiais para equipe pedagógica e famílias','Apoio à inclusão e ao desenvolvimento','Condições para instituições'],
    showProf:true, labelProf:'Nome da escola / instituição', phProf:'Ex.: Escola Municipal..., Instituto...',
    showTipo:true, labelTipo:'O que você procura?', phTipo:'Ex.: materiais para AEE, rotinas visuais, atividades por faixa...',
    labelMsg:'Mensagem (opcional)', phMsg:'Conte um pouco sobre a sua escola ou instituição.'
  },
  familia:{
    titulo:'Quer receber novidades e materiais novos?',
    lead:'Deixe seu contato e avisamos quando lançarmos materiais novos, atividades gratuitas e dicas para apoiar o desenvolvimento do seu filho em casa.',
    features:['Avisos de materiais e atividades novas','Dicas práticas para o dia a dia','Conteúdo gratuito de tempos em tempos'],
    showProf:false, labelProf:'', phProf:'',
    showTipo:true, labelTipo:'O que mais te interessa? (opcional)', phTipo:'Ex.: linguagem, sono e rotina, emoções...',
    labelMsg:'Mensagem (opcional)', phMsg:'Conte um pouco sobre o que você procura.'
  }
};
function setPerfil(btn){
  document.querySelectorAll('.perfil-tab').forEach(t=>t.classList.remove('active'));
  btn.classList.add('active');
  const p=btn.dataset.perfil;
  document.getElementById('cri-perfil').value=p;
  const c=PERFIL_CFG[p];
  document.getElementById('cri-titulo').innerHTML=c.titulo;
  document.getElementById('cri-lead').innerHTML=c.lead;
  document.getElementById('cri-features').innerHTML=c.features.map(f=>`<li>${f}</li>`).join('');
  const fp=document.getElementById('field-profissao');
  fp.style.display=c.showProf?'':'none';
  document.getElementById('label-profissao').textContent=c.labelProf;
  document.getElementById('cri-profissao').placeholder=c.phProf;
  const ft=document.getElementById('field-tipo');
  ft.style.display=c.showTipo?'':'none';
  document.getElementById('label-tipo').textContent=c.labelTipo;
  document.getElementById('cri-tipo').placeholder=c.phTipo;
  document.getElementById('label-msg').textContent=c.labelMsg;
  document.getElementById('cri-msg').placeholder=c.phMsg;
}
async function enviarInteresseCriador(e){
  e.preventDefault();
  const btn=document.getElementById('cri-submit');
  const status=document.getElementById('cri-status');
  const perfil=document.getElementById('cri-perfil').value;
  const nome=document.getElementById('cri-nome').value.trim();
  const email=document.getElementById('cri-email').value.trim();
  const whatsapp=document.getElementById('cri-whatsapp').value.trim();
  const profissao=document.getElementById('cri-profissao').value.trim();
  const tipo=document.getElementById('cri-tipo').value.trim();
  const msg=document.getElementById('cri-msg').value.trim();
  status.className='criadores-status';
  status.textContent='';
  if(!nome||!email){ status.classList.add('err'); status.textContent='Preencha nome e e-mail, por favor.'; return; }
  btn.disabled=true; btn.textContent='Enviando...';
  try{
    const{error}=await sb.from('criadores_interesse').insert({
      perfil,
      nome, email,
      whatsapp: whatsapp||null,
      profissao: profissao||null,
      tipo_material: tipo||null,
      mensagem: msg||null,
      origem: (location.hash||'').includes('linkedin')?'linkedin':'site'
    });
    if(error) throw error;
    document.getElementById('criadores-form').reset();
    document.getElementById('cri-perfil').value=perfil;
    status.classList.add('ok');
    status.textContent='Recebido! 💜 Em breve a gente entra em contato.';
  }catch(err){
    status.classList.add('err');
    status.textContent='Ops, não consegui enviar agora. Tente de novo em instantes.';
  }finally{
    btn.disabled=false; btn.textContent='Tenho interesse';
  }
}

// Split config
const SPLIT={
  material:{plataforma:0.30,irma:0.70},
  kit:{plataforma:0.15,irma:0.85},
  sessao:{plataforma:0.15,irma:0.85}
};
const FRETE_FIXO=25;
const SESSAO_PRICE=200;
const CUPOM_DESCONTO=0.15; // 15% desconto para sessões

let user=null,purchases=[],materials=[],currentProduct=null,pendingAction=null,payMethod='pix';
let activeTab='todos',activeChip='todos';
let q1Selected=[],quizAnswers={},currentKitIndex=0,bagTimer=null;

const KITS=[
  {name:'Kit Equilíbrio',area:'Regulação Emocional e Sensorial',desc:'Para crianças agitadas, impulsivas ou com dificuldade de se regular.',toys:['🟡','🎯','🔴','🟠'],syms:['agitado','explosivo']},
  {name:'Kit Conviver',area:'Desenvolvimento Socioemocional',desc:'Para crianças com dificuldade de se relacionar ou que preferem brincar sozinhas.',toys:['👨‍⚕️','⭕','❌','🤝'],syms:['sozinho']},
  {name:'Kit Fala',area:'Linguagem e Cognição Verbal',desc:'Para crianças que falam pouco, esquecem palavras ou têm dificuldade de se expressar.',toys:['🎴','🧩','📖','🐷'],syms:['fala-pouco']},
  {name:'Kit Pensa',area:'Raciocínio Lógico',desc:'Para crianças que travam diante de desafios ou desistem com facilidade.',toys:['🔗','🧱','⚙️','🔷'],syms:['trava','desiste']},
  {name:'Kit Foco',area:'Funções Executivas',desc:'Para crianças impulsivas, dispersas ou que não conseguem terminar o que começam.',toys:['⭕','🎴','🧩','⚙️'],syms:['impulsivo','concentracao']},
];


const TITLE_COVERS = {
  'menos tela':       'https://images.unsplash.com/photo-1596495578065-6e0763fa1178?w=600&h=400&fit=crop&q=80',
  'atenção':          'https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?w=600&h=400&fit=crop&q=80',
  'foco':             'https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?w=600&h=400&fit=crop&q=80',
  'funções executivas':'https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=600&h=400&fit=crop&q=80',
  'brincadeiras':     'https://images.unsplash.com/photo-1471286174890-9c112ac6823f?w=600&h=400&fit=crop&q=80',
  'rotina':           'https://images.unsplash.com/photo-1555252333-9f8e92e65df9?w=600&h=400&fit=crop&q=80',
  'sono':             'https://images.unsplash.com/photo-1555252333-9f8e92e65df9?w=600&h=400&fit=crop&q=80',
  'emoções':          'https://images.unsplash.com/photo-1516627145497-ae6968895b74?w=600&h=400&fit=crop&q=80',
  'sentimentos':      'https://images.unsplash.com/photo-1516627145497-ae6968895b74?w=600&h=400&fit=crop&q=80',
  'linguagem':        'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=600&h=400&fit=crop&q=80',
};
const CATEGORY_COVERS = {
  'Redução de telas':    'https://images.unsplash.com/photo-1596495578065-6e0763fa1178?w=600&h=400&fit=crop&q=80',
  'Funções executivas':  'https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=600&h=400&fit=crop&q=80',
  'Aprendizagem lúdica': 'https://images.unsplash.com/photo-1471286174890-9c112ac6823f?w=600&h=400&fit=crop&q=80',
  'Sono & Rotina':       'https://images.unsplash.com/photo-1555252333-9f8e92e65df9?w=600&h=400&fit=crop&q=80',
  'Regulação emocional': 'https://images.unsplash.com/photo-1516627145497-ae6968895b74?w=600&h=400&fit=crop&q=80',
  'Linguagem':           'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=600&h=400&fit=crop&q=80',
};
function getCover(material){
  if(material.cover_image) return material.cover_image;
  // Busca por palavras-chave no título
  const title=(material.title||'').toLowerCase();
  for(const [kw,url] of Object.entries(TITLE_COVERS)){
    if(title.includes(kw)) return url;
  }
  return CATEGORY_COVERS[material.category] || CATEGORY_COVERS['Aprendizagem lúdica'];
}
const FALLBACK_MATERIALS=[
  {id:'p1',title:'Guia: Menos Tela, Mais Conexão',description:'Rotinas, atividades e estratégias práticas para reduzir o tempo de tela e criar alternativas significativas no dia a dia.',category:'Redução de telas',age_range:'2–8 anos',tags:['PDF · 14 páginas','Imprimível','Gratuito'],emoji:'📱',cover_color:'#FEF3C7',is_free:true,price:0,original_price:null,file_url:'#'},
  {id:'p2',title:'Mini-guia: Atenção e Foco em Casa',description:'Cinco atividades simples para estimular a atenção e o foco infantil sem precisar de materiais especiais.',category:'Funções executivas',age_range:'3–7 anos',tags:['PDF · 8 páginas','Imprimível','Gratuito'],emoji:'🧩',cover_color:'#D1FAE5',is_free:true,price:0,original_price:null,file_url:'#'},
  {id:'p3',title:'Kit Funções Executivas Completo',description:'Jogos, roteiros e fichas de atividade para desenvolver atenção, memória de trabalho, planejamento e autorregulação.',category:'Funções executivas',age_range:'3–10 anos',tags:['PDF + fichas','36 páginas','Acesso imediato'],emoji:'🧩',cover_color:'#EEF2FF',is_free:false,price:47,original_price:67,file_url:'#'},
  {id:'p4',title:'30 Brincadeiras Intencionais',description:'Trinta brincadeiras com propósito pedagógico explicado, materiais caseiros e dicas de condução respeitosa por faixa etária.',category:'Aprendizagem lúdica',age_range:'1–6 anos',tags:['PDF · 40 páginas','Imprimível'],emoji:'🎲',cover_color:'#EEF2FF',is_free:false,price:27,original_price:39,file_url:'#'},
  {id:'p5',title:'Guia de Rotina e Sono Infantil',description:'Como criar uma rotina consistente que respeita o ritmo da criança e melhora naturalmente a qualidade do sono.',category:'Sono & Rotina',age_range:'0–7 anos',tags:['PDF · 22 páginas','Quadro de rotina imprimível'],emoji:'💤',cover_color:'#FEF3C7',is_free:false,price:29,original_price:39,file_url:'#'},
  {id:'p6',title:'Kit Emoções: Entendendo Sentimentos',description:'Cartões, atividades e roteiros de conversa para ajudar crianças a nomear, compreender e regular suas emoções.',category:'Regulação emocional',age_range:'2–8 anos',tags:['PDF + cartões imprimíveis'],emoji:'❤️',cover_color:'#FEF3C7',is_free:false,price:39,original_price:55,file_url:'#'},
];

document.addEventListener('DOMContentLoaded',async()=>{
  // Verifica retorno do Mercado Pago
  const _p=new URLSearchParams(window.location.search);
  // Pagamento e links de compartilhamento voltam para a raiz; o acervo vive em /materiais/
  if(!document.getElementById('products-grid')&&(_p.get('payment')||_p.get('open')||_p.get('buy'))){
    location.replace('/materiais/'+location.search);return;
  }
  if(_p.get('payment')==='success'){
    const _pid=_p.get('preference_id')||'';
    window.history.replaceState({},'',location.pathname);
    if(currentProduct){releaseDownload();ckStep(3);openDialog('dlg-checkout');}
  }
  // Abre produto direto via ?open=ID (da página de compartilhamento)
  const _openId=_p.get('open');
  const _buyId=_p.get('buy');
  if(_openId||_buyId){
    window.history.replaceState({},'',location.pathname);
    // Aguarda materiais carregarem para abrir o produto
    const _targetId=_openId||_buyId;
    const _isBuy=!!_buyId;
const _waitAndOpen=setInterval(()=>{
      if(materials.length>0){
        if(_isBuy){
          clearInterval(_waitAndOpen);
          currentProduct=materials.find(m=>m.id===_targetId);
          if(currentProduct){ if(user){openCheckout();} else{openDialog('dlg-auth');} }
        } else {
          const _card=document.getElementById('card-'+_targetId);
          if(_card){
            clearInterval(_waitAndOpen);
            _card.scrollIntoView({behavior:'smooth',block:'center'});
            _card.classList.add('card-highlight');
            openProduct(_targetId);
            setTimeout(()=>_card.classList.remove('card-highlight'),2600);
          }
        }
      }
    },200);
    setTimeout(()=>clearInterval(_waitAndOpen),5000);
  }
  loadSession();
  let modoSalvo='familia';
  try{modoSalvo=localStorage.getItem('np_modo')||'familia';}catch(e){}
  if(new URLSearchParams(location.search).get('plano'))modoSalvo='familia';
  setModo(modoSalvo);
  await loadMaterials();
  lerPlanoDaURL();
  renderChips();
  renderProducts();
  renderBag();
  renderKitsList();
  window.addEventListener('scroll',()=>document.getElementById('nav').classList.toggle('scrolled',window.scrollY>20));
  // Vídeo hero — fade-in quando pronto, pulado no mobile (hero azul já fica ótimo)
  const heroVid=document.getElementById('hero-video');
  if(heroVid && !window.matchMedia('(max-width:768px)').matches){
    heroVid.addEventListener('canplay',()=>heroVid.classList.add('ready'),{once:true});
    heroVid.src='https://cifndytwoehbnmjllrml.supabase.co/storage/v1/object/public/videos/6264294-uhd_3840_2160_25fps.mp4';
    heroVid.load();
    heroVid.play().catch(()=>{});
  }
});

function loadSession(){
  const s=localStorage.getItem('np_user');
  if(s){
    try{
      const data=JSON.parse(s);
      // Verifica expiração — 30 dias
      if(data.expires&&Date.now()>data.expires){localStorage.removeItem('np_user');return;}
      user=data.user||data;
      purchases=JSON.parse(localStorage.getItem('np_p_'+(user.email||''))||'[]');
      updateNavUI();
      // Se era admin, volta para o admin automaticamente
      if((user.role==='admin'||user.role==='editor')&&document.getElementById('admin-panel')){showAdmin();}
    }catch(e){localStorage.removeItem('np_user');}
  }
}
function saveSession(){
  const expires=Date.now()+(30*24*60*60*1000); // 30 dias
  localStorage.setItem('np_user',JSON.stringify({user,expires}));
  localStorage.setItem('np_p_'+(user.email||''),JSON.stringify(purchases));
}
function logout(){user=null;purchases=[];localStorage.removeItem('np_user');updateNavUI();showSite();}
let _previewingsite=false;
function toggleSitePreview(){
  _previewingsite=!_previewingsite;
  if(_previewingsite){
    document.getElementById('admin-panel').style.display='none';
    document.getElementById('site-main').style.display='block';
    document.getElementById('nav').style.display='flex';
    if(!document.getElementById('back-to-admin')){
      const fab=document.createElement('button');
      fab.id='back-to-admin';
      fab.textContent='⚙️ Voltar ao Admin';
      fab.style.cssText='position:fixed;bottom:24px;right:24px;z-index:9999;background:#0F0E0C;color:#fff;border:none;padding:12px 20px;border-radius:50px;font-family:"DM Sans",sans-serif;font-size:13px;font-weight:600;cursor:pointer;box-shadow:0 4px 20px rgba(0,0,0,0.3)';
      fab.onclick=()=>toggleSitePreview();
      document.body.appendChild(fab);
    }
    document.getElementById('back-to-admin').style.display='block';
  } else {
    document.getElementById('site-main').style.display='none';
    document.getElementById('nav').style.display='none';
    document.getElementById('admin-panel').style.display='grid';
    const fab=document.getElementById('back-to-admin');
    if(fab) fab.style.display='none';
  }
}
function showSite(){if(!document.getElementById('site-main')){location.href='/';return;}document.getElementById('site-main').style.display='block';document.getElementById('admin-panel').style.display='none';document.getElementById('nav').style.display='flex';}
function updateNavUI(){
  const _pn=document.getElementById('nav-painel');
  if(_pn)_pn.style.display=(user&&(user.role==='admin'||user.role==='editor'))?'':'none';
  const li=!!user;
  document.getElementById('nav-user').style.display=li?'flex':'none';
  document.getElementById('nav-login-btn').style.display=li?'none':'block';
  if(li){document.getElementById('nav-av').textContent=user.name.charAt(0).toUpperCase();document.getElementById('nav-un').textContent=user.name.split(' ')[0];}
}
function showAdmin(){
  if(!document.getElementById('admin-panel')){location.href='/admin/';return;}
  document.getElementById('site-main')&&(document.getElementById('site-main').style.display='none');
  document.getElementById('admin-panel').style.display='grid';
  document.getElementById('nav').style.display='none';
  const isAdmin=user?.role==='admin';
  // Abas restritas — só admin vê
  ['tab-leads','tab-sessoes','tab-pedidos','tab-compras','tab-equipe'].forEach(id=>{
    const el=document.getElementById(id);
    if(el) el.style.display=isAdmin?'':'none';
  });
  // Título do painel
  const barTitle=document.querySelector('.admin-bar h1');
  if(barTitle) barTitle.textContent=isAdmin?'Neuroplasticidar — Painel Admin':'Neuroplasticidar — Editor de Conteúdo';
  // Ativa aba inicial correta
  document.querySelectorAll('.admin-section').forEach(s=>s.classList.remove('active'));
  document.querySelectorAll('.admin-tab-btn').forEach(b=>b.classList.remove('active'));
  const firstTab=isAdmin?'dashboard':'materiais';
  document.getElementById('adm-'+firstTab)?.classList.add('active');
  // Update role badge and user name in admin bar
  const badge=document.getElementById('admin-role-badge');
  const uname=document.getElementById('admin-user-name');
  if(badge) badge.textContent=user?.isOwner?'Proprietária':isAdmin?'Administrador':'Editor';
  if(uname) uname.textContent=user?.name||'';
  const visibleBtns=[...document.querySelectorAll('.admin-tab-btn')].filter(b=>b.style.display!=='none');
  if(visibleBtns[0]) visibleBtns[0].classList.add('active');
  loadAdminData();
}

function adminTab(tab,el){
  document.querySelectorAll('.admin-tab-btn').forEach(t=>t.classList.remove('active'));
  if(el) el.classList.add('active');
  document.querySelectorAll('.admin-section').forEach(s=>s.classList.remove('active'));
  document.getElementById('adm-'+tab)?.classList.add('active');
  // Recarrega dados da aba clicada (mantém tudo conectado e fresco)
  const reloaders={
    'dashboard':()=>{loadDashboard();loadAdminRepasse();renderGraficos();},
    'leads':loadAdminLeads,
    'sessoes':loadAdminSessoes,
    'compras':loadAdminCompras,
    'pedidos':loadAdminPedidos,
    'repasse':()=>{loadAdminRepasse();renderGraficoRepasseMensal();},
    'estoque':loadAdminBrinquedos,
    'pesquisas':loadAdminPesquisas,
    'equipe':loadEquipe,
    'materiais':loadAdminMateriais,
    'kits':loadAdminKits,
    'artigos':loadAdminArtigos
  };
  if(reloaders[tab])try{reloaders[tab]();}catch(e){console.error('Erro carregando aba',tab,e);}
}
async function loadAdminData(){
  const isAdmin=user?.role==='admin';
  await loadAdminMateriais();
  await loadAdminKits();
  if(isAdmin){
    await Promise.all([loadDashboard(),loadAdminLeads(),loadAdminSessoes(),loadAdminCompras(),loadAdminPedidos(),loadAdminRepasse(),loadEquipe()]);
    // Renderiza gráficos depois que tudo carregou
    setTimeout(()=>{renderGraficos();},300);
  }
}

/* PEDIDOS KITS */
let allPedidosData=[];

async function loadAdminPedidos(){
  // 1) Solicitações de curadoria (leads de kit não-pagos)
  const{data:leads}=await sb.from('leads')
    .select('*')
    .or('contact_preference.eq.kit,recommended_kit.eq.curadoria')
    .order('created_at',{ascending:false});
  allLeadsKitData=(leads||[]).filter(l=>l.contact_preference!=='sessao_presencial'&&l.recommended_kit!=='sessao');

  // 2) Pedidos com link gerado (pedidos_kit)
  const{data:pedidos}=await sb.from('pedidos_kit')
    .select('*')
    .order('created_at',{ascending:false});
  allPedidosKitData=pedidos||[];

  // Stats
  const aguardando=allLeadsKitData.filter(l=>!l.status||l.status==='new').length;
  const aguardandoPag=allPedidosKitData.filter(p=>p.status==='aguardando_pagamento').length;
  const pagos=allPedidosKitData.filter(p=>['pago','preparando','enviado','entregue'].includes(p.status)).length;
  const receita=allPedidosKitData.filter(p=>['pago','preparando','enviado','entregue'].includes(p.status)).reduce((s,p)=>s+Number(p.valor_total||0),0);
  const set=(id,v)=>{const e=document.getElementById(id);if(e)e.textContent=v;};
  set('pk-total',pagos);
  set('pk-preparando',allPedidosKitData.filter(p=>p.status==='preparando'||(p.status==='pago')).length);
  set('pk-receita','R$ '+receita.toFixed(2).replace('.',','));

  // Sub-aba labels
  const t1=document.querySelector('#adm-pedidos .sub-tab-btn:nth-child(1)');
  const t2=document.querySelector('#adm-pedidos .sub-tab-btn:nth-child(2)');
  if(t1)t1.innerHTML=`📥 Solicitações (${allLeadsKitData.length})`;
  if(t2)t2.innerHTML=`💳 Pedidos (${allPedidosKitData.length})`;

  renderSolicitacoesKitTable(allLeadsKitData);
  renderPedidosKitTable(allPedidosKitData);
}

function renderSolicitacoesKitTable(list){
  const tbody=document.getElementById('adm-solic-kit-tbody');
  if(!tbody)return;
  if(!list.length){tbody.innerHTML='<tr><td colspan="7" style="text-align:center;color:var(--ink-lt);padding:32px;font-weight:300">Nenhuma solicitação de kit ainda.</td></tr>';return;}
  tbody.innerHTML=list.map(l=>{
    let det={};try{det=typeof l.child_age==='string'&&l.child_age.startsWith('{')?JSON.parse(l.child_age):{};}catch(e){}
    const local=det.cidade?`${det.cidade}/${det.uf||'AM'}${det.bairro?', '+det.bairro:''}`:'—';
    const idade=det.idade||l.child_age||'—';
    const foco=det.foco||(l.symptoms||[]).join(', ')||'—';
    const kitPref=det.kit_preferido||(l.recommended_kit&&l.recommended_kit!=='curadoria'?l.recommended_kit:'A definir');
    const dia=new Date(l.created_at);
    const dataStr=dia.toLocaleDateString('pt-BR');
    return `<tr>
    <td style="font-weight:500">${l.name||'—'}<div style="font-size:11px;color:var(--ink-lt)">${l.email||''}</div></td>
    <td style="font-size:12px">${kitPref}</td>
    <td style="font-size:12px">${idade}</td>
    <td style="font-size:11px;color:var(--ink-md);max-width:180px">${foco}</td>
    <td style="font-size:11px">${local}</td>
    <td style="font-size:11px;color:var(--ink-lt)">${dataStr}</td>
    <td style="white-space:nowrap">
      <button onclick='openMontarKit(${JSON.stringify(l).replace(/'/g,"&apos;")})' style="background:var(--blue);color:#fff;border:none;padding:6px 10px;border-radius:6px;font-size:11px;cursor:pointer;margin-right:4px;font-weight:500" title="Montar kit + gerar link">🧸 Montar</button>
      ${l.whatsapp?`<a href="https://wa.me/55${l.whatsapp.replace(/\D/g,'')}" target="_blank" style="background:#25D366;color:#fff;padding:6px 10px;border-radius:6px;font-size:11px;text-decoration:none">💬</a>`:''}
    </td>
  </tr>`;}).join('');
}

function renderPedidosKitTable(list){
  const tbody=document.getElementById('adm-pedidos-tbody');
  if(!list.length){tbody.innerHTML='<tr><td colspan="8" style="text-align:center;color:var(--ink-lt);padding:32px;font-weight:300">Nenhum pedido de kit gerado ainda.</td></tr>';return;}
  const statusLabels={
    'aguardando_curadoria':{label:'⏳ Aguardando curadoria',color:'#92400E'},
    'aguardando_pagamento':{label:'💳 Aguardando pagamento',color:'#92400E'},
    'pago':{label:'✅ Pago',color:'#16A34A'},
    'preparando':{label:'📦 Preparando',color:'#1A3FBF'},
    'enviado':{label:'🚚 Enviado',color:'#7C3AED'},
    'entregue':{label:'✅ Entregue',color:'#16A34A'},
    'cancelado':{label:'❌ Cancelado',color:'#991B1B'}
  };
  tbody.innerHTML=list.map(p=>{
    const status=statusLabels[p.status]||{label:p.status,color:'#666'};
    const dia=new Date(p.created_at).toLocaleDateString('pt-BR');
    const endereco=`${p.endereco_rua||'—'}${p.endereco_numero?', '+p.endereco_numero:''}<br><span style="font-size:11px">${p.endereco_bairro||''} · ${p.endereco_cidade}/${p.endereco_uf}</span>`;
    const linkPagar=`https://neuroplasticidar.gruposja.com/pagar-kit.html?id=${p.id}`;
    return `<tr>
    <td style="font-weight:500">${p.cliente_nome}<div style="font-size:11px;color:var(--ink-lt)">${p.cliente_email}</div></td>
    <td style="font-family:'Playfair Display',serif;font-weight:700">R$ ${Number(p.valor_total).toFixed(2)}<div style="font-size:10px;color:var(--ink-lt);font-weight:300">kit ${Number(p.valor_kit||0).toFixed(2)} + frete ${Number(p.valor_frete||0).toFixed(2)}</div></td>
    <td style="font-size:11px;color:var(--ink-md);max-width:200px">${endereco}</td>
    <td>${p.cliente_whatsapp?`<a class="btn-wpp-sm" href="https://wa.me/55${p.cliente_whatsapp.replace(/\D/g,'')}" target="_blank" style="font-size:11px">💬 ${p.cliente_whatsapp}</a>`:'—'}</td>
    <td style="font-size:11px;color:var(--ink-lt)">${dia}</td>
    <td><span style="font-size:11px;font-weight:500;color:${status.color}">${status.label}</span></td>
    <td><select class="status-sel" onchange="updatePedidoKitStatus('${p.id}',this.value)">
      <option value="aguardando_pagamento" ${p.status==='aguardando_pagamento'?'selected':''}>Aguardando pagamento</option>
      <option value="pago" ${p.status==='pago'?'selected':''}>Pago</option>
      <option value="preparando" ${p.status==='preparando'?'selected':''}>Preparando</option>
      <option value="enviado" ${p.status==='enviado'?'selected':''}>Enviado</option>
      <option value="entregue" ${p.status==='entregue'?'selected':''}>Entregue</option>
      <option value="cancelado" ${p.status==='cancelado'?'selected':''}>Cancelado</option>
    </select></td>
    <td style="white-space:nowrap">
      ${p.status==='aguardando_pagamento'?`<button onclick="copiarLinkPedidoKit('${linkPagar}')" style="background:var(--blue);color:#fff;border:none;padding:5px 9px;border-radius:5px;font-size:11px;cursor:pointer;margin-right:4px" title="Copiar link de pagamento">🔗</button>`:''}
      ${p.cliente_whatsapp?`<a href="https://wa.me/55${p.cliente_whatsapp.replace(/\D/g,'')}" target="_blank" style="background:#25D366;color:#fff;padding:5px 9px;border-radius:5px;font-size:11px;text-decoration:none">💬</a>`:''}
    </td>
  </tr>`;}).join('');
}

function subTabPedidos(tab,el){
  document.querySelectorAll('#adm-pedidos .sub-tab-btn').forEach(b=>{
    b.style.borderBottomColor='transparent';b.style.color='var(--ink-lt)';
  });
  el.style.borderBottomColor='var(--blue)';
  el.style.color='var(--blue)';
  document.getElementById('sub-solic-kit').style.display=tab==='solicitacoes'?'block':'none';
  document.getElementById('sub-pedidos-kit').style.display=tab==='pedidos'?'block':'none';
}

function copiarLinkPedidoKit(link){
  navigator.clipboard.writeText(link);
  alert('Link copiado! Cole no WhatsApp do cliente.');
}

async function updatePedidoKitStatus(id,status){
  await sb.from('pedidos_kit').update({status,updated_at:new Date().toISOString()}).eq('id',id);
  await loadAdminPedidos();
}

let allLeadsKitData=[];
let allPedidosKitData=[];

function renderPedidosTable(list){
  const tbody=document.getElementById('adm-pedidos-tbody');
  if(!list.length){tbody.innerHTML='<tr><td colspan="8" style="text-align:center;color:var(--ink-lt);padding:32px;font-weight:300">Nenhum kit pago ainda. Quando alguém comprar um kit, ele aparecerá aqui.</td></tr>';return;}
  tbody.innerHTML=list.map(p=>{
    const dia=new Date(p.pago_em||p.created_at);
    const dataStr=dia.toLocaleDateString('pt-BR')+' '+dia.toLocaleTimeString('pt-BR',{hour:'2-digit',minute:'2-digit'});
    const endereco=p.delivery_address||p.endereco||'—';
    const statusLabel={'preparando':'📦 Em preparo','enviado':'🚚 Enviado','entregue':'✅ Entregue'}[p.delivery_status||'preparando']||p.delivery_status;
    return `<tr>
    <td style="font-weight:500">${p.nome}<div style="font-size:11px;color:var(--ink-lt)">${p.email}</div></td>
    <td><strong>${p.kit_name||'Kit'}</strong></td>
    <td style="font-family:'Playfair Display',serif;font-weight:700">R$ ${Number(p.valor).toFixed(2)}</td>
    <td style="font-size:11px;color:var(--ink-md);max-width:160px">${endereco}</td>
    <td>${p.whatsapp?`<a class="btn-wpp-sm" href="https://wa.me/55${p.whatsapp.replace(/\D/g,'')}" target="_blank" style="font-size:11px">💬 ${p.whatsapp}</a>`:'—'}</td>
    <td style="font-size:11px;color:var(--ink-lt)">${dataStr}</td>
    <td><select class="status-sel" onchange="updateKitDeliveryStatus('${p.id}',this.value)">
      <option value="preparando" ${(p.delivery_status==='preparando'||!p.delivery_status)?'selected':''}>📦 Em preparo</option>
      <option value="enviado" ${p.delivery_status==='enviado'?'selected':''}>🚚 Enviado</option>
      <option value="entregue" ${p.delivery_status==='entregue'?'selected':''}>✅ Entregue</option>
    </select></td>
    <td>${p.whatsapp?`<a href="https://wa.me/55${p.whatsapp.replace(/\D/g,'')}" target="_blank" style="background:#25D366;color:#fff;padding:5px 9px;border-radius:5px;font-size:11px;text-decoration:none">💬</a>`:''}</td>
  </tr>`;}).join('');
}
function filterPedidos(s,el){
  document.querySelectorAll('#adm-pedidos .adm-filter-btn').forEach(b=>b.classList.remove('active'));
  el.classList.add('active');
  renderPedidosTable(s==='all'?allPedidosData:allPedidosData.filter(p=>(p.delivery_status||'preparando')===s));
}
async function updateKitDeliveryStatus(id,status){
  await sb.from('purchases').update({delivery_status:status}).eq('id',id);
  await loadAdminPedidos();
}
async function updatePedidoStatus(id,status){await sb.from('leads').update({status}).eq('id',id);await loadDashboard();}

/* ════════ BRINQUEDOS / ESTOQUE ════════ */
let allBrinquedosData=[];
let brinquedoEditandoId=null;

async function loadAdminBrinquedos(){
  const{data,error}=await sb.from('brinquedos').select('*').order('created_at',{ascending:false});
  if(error){
    const errInfo={message:error.message,code:error.code};
    console.error('[brinquedos] erro:',JSON.stringify(errInfo));
    allBrinquedosData=[];
  } else {
    allBrinquedosData=data||[];
  }
  // Stats
  const total=allBrinquedosData.length;
  const emEstoque=allBrinquedosData.filter(b=>(b.estoque_atual||0)>0).length;
  const alerta=allBrinquedosData.filter(b=>(b.estoque_atual||0)<=(b.estoque_minimo||0)).length;
  const valorTotal=allBrinquedosData.reduce((s,b)=>s+(parseFloat(b.custo||0)*parseInt(b.estoque_atual||0)),0);
  const set=(id,v)=>{const e=document.getElementById(id);if(e)e.textContent=v;};
  set('br-total',total);
  set('br-em-estoque',emEstoque);
  set('br-alerta',alerta);
  set('br-valor-total','R$ '+valorTotal.toFixed(2).replace('.',','));
  renderBrinquedosTable(allBrinquedosData);
}

function renderBrinquedosTable(list){
  const tbody=document.getElementById('adm-brinquedos-tbody');
  if(!tbody)return;
  if(!list.length){
    tbody.innerHTML='<tr><td colspan="8" style="text-align:center;color:var(--ink-lt);padding:40px;font-weight:300">Nenhum brinquedo cadastrado ainda.<br><button onclick="openBrinquedoForm()" style="margin-top:12px;background:var(--blue);color:#fff;border:none;padding:8px 16px;border-radius:6px;font-size:12px;cursor:pointer">+ Cadastrar primeiro</button></td></tr>';
    return;
  }
  tbody.innerHTML=list.map(b=>{
    const estoque=parseInt(b.estoque_atual||0);
    const min=parseInt(b.estoque_minimo||0);
    const custo=parseFloat(b.custo||0);
    const preco=parseFloat(b.preco_venda||0);
    let statusBadge='';
    if(estoque===0)statusBadge='<span style="font-size:10px;padding:3px 8px;background:#FEE2E2;color:#991B1B;border-radius:6px;font-weight:600">🚫 ZERADO</span>';
    else if(estoque<=min)statusBadge='<span style="font-size:10px;padding:3px 8px;background:#FEF3C7;color:#92400E;border-radius:6px;font-weight:600">⚠️ ABAIXO MÍN</span>';
    else statusBadge='<span style="font-size:10px;padding:3px 8px;background:#D1FAE5;color:#065F46;border-radius:6px;font-weight:600">✓ OK</span>';

    const fotoHTML=b.foto_url?`<img src="${b.foto_url}" style="width:48px;height:48px;border-radius:8px;object-fit:cover">`:`<div style="width:48px;height:48px;border-radius:8px;background:var(--parchment);display:flex;align-items:center;justify-content:center;font-size:20px">🧸</div>`;
    return `<tr>
    <td>${fotoHTML}</td>
    <td><div style="font-weight:500">${b.nome}</div>${b.tags?.length?`<div style="font-size:10px;color:var(--ink-lt);margin-top:2px">${b.tags.slice(0,3).join(' · ')}</div>`:''}</td>
    <td style="font-size:12px">${b.faixa_etaria||'—'}</td>
    <td style="font-family:'Playfair Display',serif;color:var(--ink-md);font-size:13px">R$ ${custo.toFixed(2).replace('.',',')}</td>
    <td style="font-family:'Playfair Display',serif;font-weight:600">R$ ${preco.toFixed(2).replace('.',',')}</td>
    <td style="font-weight:600;font-size:15px;text-align:center">${estoque}<div style="font-size:10px;color:var(--ink-lt);font-weight:300">mín: ${min}</div></td>
    <td>${statusBadge}</td>
    <td style="white-space:nowrap">
      <button onclick="ajustarEstoque('${b.id}',1)" style="background:var(--sage);color:#fff;border:none;padding:5px 9px;border-radius:5px;font-size:11px;cursor:pointer;margin-right:2px" title="+1">+</button>
      <button onclick="ajustarEstoque('${b.id}',-1)" style="background:#B45309;color:#fff;border:none;padding:5px 9px;border-radius:5px;font-size:11px;cursor:pointer;margin-right:2px" title="-1">−</button>
      <button onclick="editarBrinquedo('${b.id}')" style="background:var(--blue);color:#fff;border:none;padding:5px 9px;border-radius:5px;font-size:11px;cursor:pointer;margin-right:2px">✏️</button>
      <button class="btn-del" onclick="deleteBrinquedo('${b.id}')">×</button>
    </td>
  </tr>`;}).join('');
}

function filterBrinquedos(filter,el){
  document.querySelectorAll('#adm-estoque .adm-filter-btn').forEach(b=>b.classList.remove('active'));
  el.classList.add('active');
  let filtered=allBrinquedosData;
  if(filter==='em-estoque')filtered=allBrinquedosData.filter(b=>(b.estoque_atual||0)>0);
  else if(filter==='alerta')filtered=allBrinquedosData.filter(b=>(b.estoque_atual||0)<=(b.estoque_minimo||0)&&(b.estoque_atual||0)>0);
  else if(filter==='zerado')filtered=allBrinquedosData.filter(b=>(b.estoque_atual||0)===0);
  renderBrinquedosTable(filtered);
}

function searchBrinquedos(){
  const q=document.getElementById('br-search').value.toLowerCase().trim();
  if(!q){renderBrinquedosTable(allBrinquedosData);return;}
  const filtered=allBrinquedosData.filter(b=>
    (b.nome||'').toLowerCase().includes(q)||
    (b.descricao||'').toLowerCase().includes(q)||
    (b.tags||[]).some(t=>t.toLowerCase().includes(q))
  );
  renderBrinquedosTable(filtered);
}

function openBrinquedoForm(){
  brinquedoEditandoId=null;
  document.getElementById('br-form-title').textContent='🧸 Novo brinquedo';
  ['br-id','br-nome','br-descricao','br-custo','br-preco','br-estoque','br-fornecedor','br-tags','br-foto-url','br-categoria'].forEach(id=>{
    const el=document.getElementById(id);if(el)el.value='';
  });
  document.getElementById('br-estoque-min').value='2';
  document.getElementById('br-faixa').value='';
  document.getElementById('br-photo-preview').style.display='none';
  document.getElementById('br-photo-empty').style.display='block';
  openDialog('dlg-brinquedo');
}

function editarBrinquedo(id){
  const b=allBrinquedosData.find(x=>x.id===id);
  if(!b)return;
  brinquedoEditandoId=id;
  document.getElementById('br-form-title').textContent='✏️ Editar brinquedo';
  document.getElementById('br-id').value=id;
  document.getElementById('br-nome').value=b.nome||'';
  document.getElementById('br-descricao').value=b.descricao||'';
  document.getElementById('br-categoria').value=b.categoria||'';
  document.getElementById('br-custo').value=b.custo||'';
  document.getElementById('br-preco').value=b.preco_venda||'';
  document.getElementById('br-estoque').value=b.estoque_atual||0;
  document.getElementById('br-estoque-min').value=b.estoque_minimo||2;
  document.getElementById('br-faixa').value=b.faixa_etaria||'';
  document.getElementById('br-fornecedor').value=b.fornecedor||'';
  document.getElementById('br-tags').value=(b.tags||[]).join(', ');
  document.getElementById('br-foto-url').value=b.foto_url||'';
  if(b.foto_url){
    document.getElementById('br-photo-img').src=b.foto_url;
    document.getElementById('br-photo-preview').style.display='block';
    document.getElementById('br-photo-empty').style.display='none';
  } else {
    document.getElementById('br-photo-preview').style.display='none';
    document.getElementById('br-photo-empty').style.display='block';
  }
  openDialog('dlg-brinquedo');
}

async function saveBrinquedo(){
  const nome=document.getElementById('br-nome').value.trim();
  if(!nome){alert('Nome obrigatório.');return;}
  const data={
    nome,
    descricao:document.getElementById('br-descricao').value.trim(),
    categoria:document.getElementById('br-categoria').value||null,
    custo:parseFloat(document.getElementById('br-custo').value)||0,
    preco_venda:parseFloat(document.getElementById('br-preco').value)||0,
    estoque_atual:parseInt(document.getElementById('br-estoque').value)||0,
    estoque_minimo:parseInt(document.getElementById('br-estoque-min').value)||2,
    faixa_etaria:document.getElementById('br-faixa').value,
    fornecedor:document.getElementById('br-fornecedor').value.trim(),
    foto_url:document.getElementById('br-foto-url').value,
    tags:document.getElementById('br-tags').value.split(',').map(t=>t.trim()).filter(Boolean),
    updated_at:new Date().toISOString(),
  };
  let result;
  if(brinquedoEditandoId){
    result=await sb.from('brinquedos').update(data).eq('id',brinquedoEditandoId);
  } else {
    result=await sb.from('brinquedos').insert(data);
  }
  if(result.error){
    alert('Erro: '+result.error.message);return;
  }
  closeDialog('dlg-brinquedo');
  await loadAdminBrinquedos();
}

async function deleteBrinquedo(id){
  if(!confirm('Remover esse brinquedo do estoque? Esta ação não pode ser desfeita.'))return;
  await sb.from('brinquedos').delete().eq('id',id);
  await loadAdminBrinquedos();
}

async function ajustarEstoque(id,delta){
  const b=allBrinquedosData.find(x=>x.id===id);
  if(!b)return;
  const novo=Math.max(0,(b.estoque_atual||0)+delta);
  await sb.from('brinquedos').update({estoque_atual:novo,updated_at:new Date().toISOString()}).eq('id',id);
  await loadAdminBrinquedos();
}

async function handleBrinquedoPhotoSelect(input){
  const file=input.files[0];
  if(!file)return;
  await uploadBrinquedoPhoto(file);
}

async function handleBrinquedoPhotoDrop(e){
  const file=e.dataTransfer.files[0];
  if(!file)return;
  await uploadBrinquedoPhoto(file);
}

async function uploadBrinquedoPhoto(file){
  if(!file.type.startsWith('image/')){alert('Selecione uma imagem.');return;}
  const zone=document.getElementById('br-photo-zone');
  const empty=document.getElementById('br-photo-empty');
  empty.innerHTML='<div style="font-size:20px">⏳</div><p style="font-size:12px;color:var(--blue);margin-top:4px">Enviando...</p>';
  try{
    const url=await uploadToStorage(file,'materials','brinquedos');
    document.getElementById('br-foto-url').value=url;
    document.getElementById('br-photo-img').src=url;
    document.getElementById('br-photo-preview').style.display='block';
    empty.style.display='none';
  }catch(err){
    empty.innerHTML='<div style="font-size:20px">❌</div><p style="font-size:12px;color:var(--terra);margin-top:4px">Erro. Tente outra.</p>';
    console.error(err);
  }
}
function renderBag(){
  showKit(0);
  const vid=document.getElementById('bag-video');
  if(vid){
    let loaded=false;
    const obs=new IntersectionObserver((entries)=>{
      entries.forEach(e=>{
        if(e.isIntersecting){
          if(!loaded){
            vid.src='https://cifndytwoehbnmjllrml.supabase.co/storage/v1/object/public/videos/copy_54B72248-C35B-46AA-9459-C2CE33B27A76%20(22).mp4';
            vid.load();
            loaded=true;
          }
          vid.play().catch(()=>{});
        } else { vid.pause(); }
      });
    },{threshold:0.3});
    obs.observe(vid);
  }
}
function showKit(i){
  currentKitIndex=i;
  /* Só destaca o card clicado — não toca no vídeo */
  document.querySelectorAll('.kit-row').forEach((r,j)=>r.classList.toggle('active',j===i));
}
function renderKitsList(){
  if(!document.getElementById('kits-list'))return;
  document.getElementById('kits-list').innerHTML=KITS.map((k,i)=>`
    <div class="kit-row ${i===0?'active':''}" onclick="showKit(${i})">
      <span class="kit-row-num">0${i+1}</span>
      <div class="kit-row-body">
        <div class="kit-row-name">${k.name}</div>
        <div class="kit-row-area">${k.area}</div>
        <div class="kit-row-desc">${k.desc}</div>
      </div>
    </div>
  `).join('');
}

/* PRODUTOS */
/* ══ TAXONOMIA ÚNICA — objetivo de intervenção ══
   clin = nome clínico (profissional) · fam = nome em linguagem de família
   profs = especialidades que usam · match = termos que casam com category do banco */
const TAXONOMIA=[
 {id:'linguagem',      clin:'Linguagem e fala',          fam:'Falar e se expressar',        profs:['Fono'],                        match:['linguagem','fala']},
 {id:'comunicacao',    clin:'Comunicação',               fam:'Se fazer entender',           profs:['Fono'],                        match:['comunica','pecs','alternativa']},
 {id:'vocabulario',    clin:'Aquisição de vocabulário',  fam:'Aprender palavras novas',     profs:['Fono','Neuropsicoped.'],       match:['vocabul','categoriza','categorias','nomea','palavra']},
 {id:'motora-fina',    clin:'Coordenação motora fina',   fam:'Mãos, pinça e traçado',       profs:['TO'],                          match:['motora fina','fina','pinça','preens','grafo','motricidade']},
 {id:'motora-grossa',  clin:'Coordenação motora grossa', fam:'Corpo, equilíbrio e força',   profs:['Fisio'],                       match:['motora grossa','grossa','equilíb','equilib','postur']},
 {id:'sensorial',      clin:'Integração sensorial',      fam:'Sons, texturas e toque',      profs:['TO'],                          match:['sensor','tátil','tatil','vestibul','propriocep']},
 {id:'avd',            clin:'Atividades de vida diária', fam:'Vestir, comer e higiene',     profs:['TO'],                          match:['avd','vida diária','vida diaria','autonomia','higiene']},
 {id:'emocoes',        clin:'Emoções e sentimentos',     fam:'Lidar com o que sente',       profs:['Psicólogo'],                   match:['emoc','sentiment','regulação emocional','regulacao']},
 {id:'pre-alfa',       clin:'Pré-alfabetização',         fam:'Preparar para ler',           profs:['Neuropsicoped.'],              match:['pré-alfa','pre-alfa','pré alfa','fonológ','fonolog']},
 {id:'alfa',           clin:'Alfabetização',             fam:'Ler e escrever',              profs:['Neuropsicoped.'],              match:['alfabetiz','leitura','escrita','sílab','silab']},
 {id:'reforcadores',   clin:'Reforçadores lúdicos',      fam:'Motivar e engajar',           profs:['Supervisor ABA','Neuropsicoped.'], match:['reforçad','reforcad','pareamento','lúdica','ludica','ludico']},
 {id:'simbolico',      clin:'Brinquedos simbólicos',     fam:'Faz de conta',                profs:['TO','Psicólogo'],              match:['simból','simbol','faz de conta','imagina']},
 {id:'funcoes',        clin:'Funções executivas',        fam:'Atenção, foco e planejamento',profs:['Neuropsicoped.','Psicólogo'],  match:['funções executivas','funcoes','executiva','atenção','foco','memória de trabalho']},
 {id:'telas',          clin:'Redução de telas',          fam:'Menos telas',                 profs:[],                              match:['telas','tela'], soFamilia:true},
 {id:'sono',           clin:'Sono e rotina',             fam:'Sono e rotina',               profs:[],                              match:['sono','rotina'], soFamilia:true}
];
const OBJ=id=>TAXONOMIA.find(o=>o.id===id);
function matchObj(id,cat){const o=OBJ(id);if(!o)return false;const c=(cat||'').toLowerCase();return o.match.some(m=>c.includes(m.toLowerCase()));}

/* ══ MODO: familia | profissional ══ */
let modo='familia', plano=[], planoFiltro=null, planoProf='';
function rotulo(o){return modo==='profissional'?o.clin:o.fam;}
function rotuloAlt(o){return modo==='profissional'?o.fam:o.clin;}

function setModo(m,silent){
  modo='familia';m='familia';
  document.body.setAttribute('data-modo',m);
  const ot=document.getElementById('obj-titulo'),os=document.getElementById('obj-sub');
  if(ot)ot.innerHTML='O que seu filho precisa <em>desenvolver</em> agora?';
  if(os)os.textContent='Escolha o que mais faz sentido para o momento do seu filho. Se você recebeu uma indicação da terapeuta, ela já vem marcada aqui.';
  renderObjetivos();renderChips();
  if(typeof renderProducts==='function')renderProducts();
}
function entrar(m){document.getElementById('objetivos').scrollIntoView({behavior:'smooth'});}

/* ══ GRID DE OBJETIVOS ══ */
function renderObjetivos(){
  const g=document.getElementById('obj-grid');if(!g)return;
  const lista=TAXONOMIA.filter(o=>modo==='profissional'?!o.soFamilia:true);
  g.innerHTML=lista.map(o=>{
    const sel = modo==='profissional' ? plano.includes(o.id) : (planoFiltro||[]).includes(o.id);
    const alt = rotuloAlt(o)===rotulo(o) ? '' : `<p class="alt">${rotuloAlt(o)}</p>`;
    return `
    <div class="obj-card${sel?' sel':''}" onclick="tocarObjetivo('${o.id}')">
      <div class="obj-tick">✓</div>
      <h3>${rotulo(o)}</h3>
      ${alt}
      <div class="profs">${o.profs.map(pr=>`<span class="${o.profs.length>1?'shared':''}">${pr}</span>`).join('')}</div>
    </div>`;}).join('');
  const bar=document.getElementById('plano-bar');
  if(bar){bar.classList.toggle('on',plano.length>0);
    const c=document.getElementById('plano-count');
    if(c)c.textContent=plano.length+(plano.length===1?' objetivo':' objetivos');}
}
function tocarObjetivo(id){
  if(modo==='profissional'){
    plano.includes(id)?plano=plano.filter(x=>x!==id):plano.push(id);
    renderObjetivos();
  }else{
    location.href='/materiais/?plano='+id;
  }
}

/* ══ CHIPS DE MATERIAIS ══ */
function renderChips(){
  const c=document.getElementById('mat-chips');if(!c)return;
  const lista=TAXONOMIA.filter(o=>modo==='profissional'?!o.soFamilia:true);
  c.innerHTML=`<button class="chip${activeChip==='todos'?' active':''}" onclick="setChip('todos',this)">Todos os objetivos</button>`+
    lista.map(o=>`<button class="chip${activeChip===o.id?' active':''}" onclick="setChip('${o.id}',this)">${rotulo(o)}</button>`).join('');
}

/* ══ PLANO: gerar e receber ══ */
function gerarPlano(){
  if(!plano.length)return;
  const nome=(document.getElementById('plano-prof')||{}).value||'';
  const u=new URL(location.origin+'/materiais/');
  u.searchParams.set('plano',plano.join(','));
  if(nome.trim())u.searchParams.set('prof',nome.trim());
  const link=u.toString();
  const done=()=>{const b=document.querySelector('.plano-acts .pri');if(b){const t=b.textContent;b.textContent='Link copiado ✓';setTimeout(()=>b.textContent=t,2400);}};
  if(navigator.clipboard&&navigator.clipboard.writeText){navigator.clipboard.writeText(link).then(done).catch(()=>prompt('Copie o link do plano:',link));}
  else prompt('Copie o link do plano:',link);
  if(window.gtag)gtag('event','gerar_plano',{objetivos:plano.join(','),profissional:nome});
}
function limparPlano(){
  plano=[];planoFiltro=null;planoProf='';activeChip='todos';
  const b=document.getElementById('plano-banner');if(b)b.classList.remove('on');
  renderObjetivos();renderChips();renderProducts();
}
function lerPlanoDaURL(){
  const q=new URLSearchParams(location.search);
  const pl=q.get('plano');if(!pl)return;
  // links antigos de plano apontavam para a home; hoje o acervo vive em /materiais/
  if(!document.getElementById('products-grid')){location.replace('/materiais/'+location.search);return;}
  const ids=pl.split(',').map(s=>s.trim()).filter(id=>OBJ(id));
  if(!ids.length)return;
  planoFiltro=ids;planoProf=(q.get('prof')||'').trim();
  const b=document.getElementById('plano-banner'),t=document.getElementById('plano-banner-txt');
  if(b&&t){
    const nomes=ids.map(id=>rotulo(OBJ(id))).join(', ');
    t.innerHTML=(planoProf?`<b>${planoProf}</b> indicou `:'Sua terapeuta indicou ')+
      `estes objetivos para o seu filho: <b>${nomes}</b>. Os materiais abaixo já estão filtrados por essa indicação.`;
    b.classList.add('on');
  }
  renderObjetivos();
  if(window.gtag)gtag('event','abriu_plano',{objetivos:ids.join(','),profissional:planoProf});
}


function semAcento(s){return (s||'').toString().toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'');}
function isDIY(p){return (p.category||'').toLowerCase().includes('diy')||(p.tags||[]).some(t=>(t||'').toLowerCase().includes('diy'));}
function cardMaterial(p){return `
    <div class="prod-card" id="card-${p.id}" onclick="openProduct('${p.id}')">
      <div class="prod-thumb" style="background:${p.cover_color||'#EEF2FF'};position:relative;overflow:hidden">
        <img src="${getCover(p)}" loading="lazy" decoding="async" style="position:absolute;inset:0;width:100%;height:100%;object-fit:cover" onerror="this.style.display='none'">
        <span class="prod-type-badge ${p.is_free?'type-free':'type-paid'}">${((p.category||'').toLowerCase().includes('diy')||(p.tags||[]).some(t=>(t||'').toLowerCase().includes('diy')))?'DIY':(p.is_free?'Gratuito':'Completo')}</span>
      </div>
      <div class="prod-body">
        <p class="prod-cat">${p.category}</p>
        <h3>${p.title}</h3>
        <p>${(p.description||'').substring(0,80)}…</p>
        <div class="prod-meta">${(p.tags||[]).map(t=>`<span class="prod-tag">${t}</span>`).join('')}</div>
      </div>
      <div class="prod-footer">
        <div class="prod-price">
          ${p.original_price?`<span class="orig">R$ ${p.original_price},00</span>`:''}
          <span class="amt ${p.is_free?'free-p':''}">${p.is_free?'Gratuito':'R$ '+p.price+',00'}</span>
        </div>
        <div style="display:flex;flex-direction:column;gap:6px;align-items:stretch;min-width:130px">
          <button class="btn-prod ${p.is_free?'free':''}" style="width:100%" onclick="event.stopPropagation();directCheckout('${p.id}')">${p.is_free?'Baixar':'Comprar'}</button>
          <button class="btn-prod-share" onclick="event.stopPropagation();shareProduct(event,'${p.id}')" style="width:100%;justify-content:center">📲 Compartilhar</button>
        </div>
      </div>
    </div>
  `;}
function renderProducts(){
  const grid=document.getElementById('products-grid'); if(!grid)return;
  const campo=document.getElementById('search-input');
  const q=semAcento(campo?campo.value.trim():'');
  const list=materials.filter(p=>{
    const mT=activeTab==='todos'||(activeTab==='gratuito'&&p.is_free)||(activeTab==='pago'&&!p.is_free&&!isDIY(p))||(activeTab==='diy'&&isDIY(p));
    const mP=!planoFiltro||planoFiltro.some(id=>matchObj(id,p.category));
    const mC=activeChip==='todos'||matchObj(activeChip,p.category);
    const txt=semAcento([p.title,p.category,p.description,(p.tags||[]).join(' ')].join(' '));
    const mQ=!q||q.split(/\s+/).every(t=>txt.includes(t));
    return mT&&mC&&mQ&&mP;
  });
  const nr=document.getElementById('no-results'); if(nr)nr.style.display=list.length?'none':'block';
  const ct=document.getElementById('mat-count'); if(ct)ct.textContent=list.length+(list.length===1?' material':' materiais');
  grid.innerHTML=list.map(cardMaterial).join('');
}
function filterProducts(){renderProducts();}
function setTab(t,el){activeTab=t;document.querySelectorAll('.tab').forEach(x=>x.classList.remove('active'));el.classList.add('active');renderProducts();}
function setChip(c,el){activeChip=c;document.querySelectorAll('.chip').forEach(x=>x.classList.remove('active'));if(el)el.classList.add('active');renderProducts();}

/* PRODUTO DIALOG */
function slugify(text){
  return text.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'');
}
/* ── COMPARTILHAMENTO COM TOAST ── */
let _toastTimer=null;
function showToast(){
  const t=document.getElementById('share-toast');
  t.style.opacity='1';t.style.transform='translateX(-50%) translateY(0)';
  clearTimeout(_toastTimer);
  _toastTimer=setTimeout(()=>{
    t.style.opacity='0';t.style.transform='translateX(-50%) translateY(20px)';
  },3000);
}
function copyMaterialLink(id){
  const p=materials.find(m=>m.id===id);if(!p)return;
  // Usa o ID do produto na URL — mais confiável que o slug do título
const url=`https://neuroplasticidar.gruposja.com/m/${id}`;
  if(navigator.clipboard){
    navigator.clipboard.writeText(url).then(showToast).catch(()=>fallbackCopy(url));
  } else { fallbackCopy(url); }
}
function fallbackCopy(url){
  const el=document.createElement('textarea');
  el.value=url;el.style.cssText='position:fixed;opacity:0';
  document.body.appendChild(el);el.select();
  try{document.execCommand('copy');showToast();}catch(e){}
  document.body.removeChild(el);
}
function shareProduct(e, id){
  if(e) e.stopPropagation();
  copyMaterialLink(id);
}
function openProduct(id){
  currentProduct=materials.find(p=>p.id===id);if(!currentProduct)return;
  const p=currentProduct;
  const prev=document.getElementById('dp-preview');

  // Limpa estado anterior
  prev.style.background=p.cover_color||'#EEF2FF';
  // Remove old cover img if exists
  const oldImg=prev.querySelector('img.cover-fill');
  if(oldImg) oldImg.remove();
  const oldEmoji=prev.querySelector('.dp-emoji');
  if(oldEmoji) oldEmoji.remove();

  // Monta lista de fotos
  const photos=[...new Set([p.cover_image,...(p.images||[])].filter(Boolean))];

  if(photos.length>0){
    // Mostra primeira foto como cover de fundo
    const img=document.createElement('img');
    img.className='cover-fill';
    img.src=getCover(p);
    img.alt=p.title;
    prev.insertBefore(img,prev.firstChild);

    // Ativa carrossel se tiver mais de 1 foto
    const wrap=document.getElementById('dlg-carousel-wrap');
    if(photos.length>1){
      wrap.classList.add('active');
      dlgCarouselInit(photos);
    } else {
      wrap.classList.remove('active');
    }
  } else {
    // Sem foto — mostra emoji
    document.getElementById('dlg-carousel-wrap').classList.remove('active');
    const em=document.createElement('span');
    em.className='dp-emoji';em.textContent=p.emoji||'📄';
    prev.appendChild(em);
  }

  document.getElementById('dp-cat').textContent=p.category;
  document.getElementById('dp-title').textContent=p.title;
  document.getElementById('dp-for').textContent=p.age_range+' · Pais e cuidadores';
  document.getElementById('dp-desc').textContent=p.description;
  document.getElementById('dp-includes').innerHTML=(p.tags||[]).map(t=>`<li>${t}</li>`).join('');
  document.getElementById('dp-orig').textContent=p.original_price?`R$ ${p.original_price},00`:'';
  const pr=document.getElementById('dp-price');
  pr.textContent=p.is_free?'Gratuito':`R$ ${p.price},00`;
  pr.className='amt'+(p.is_free?' fp':'');
  const cta=document.getElementById('dp-cta');
  cta.textContent=p.is_free?'Baixar gratuitamente':`Comprar — R$ ${p.price},00`;
  cta.className='btn-dlg'+(p.is_free?' free':'');
  openDialog('dlg-produto');
}
function openCheckout(){
  if(!currentProduct)return;
  const p=currentProduct;
  // Gratuito — nunca mostra checkout de pagamento
  if(p.is_free){releaseDownload();return;}
  ckStep(1);
  const photos=p.images||[p.cover_image].filter(Boolean);
  initCarousel(photos);
  document.getElementById('ck-summary').innerHTML=`
    <div class="th">${p.emoji}</div>
    <div class="inf"><h4>${p.title}</h4><p>${p.category} · ${p.age_range}</p></div>
    <div class="pr">R$ ${p.price}</div>`;
  document.getElementById('dl-email').textContent=user?.email||'';
  resetCupomCheckout();
  openDialog('dlg-checkout');
}
function handleCTA(){
  if(!currentProduct)return;
  if(currentProduct.is_free){
    // Gratuito — precisa de login mas sem pagamento
    if(!user){pendingAction='free';closeDialog('dlg-produto');openAuth();}
    else{releaseDownload();}
  } else {
    // Pago — fecha dialog e abre checkout
    closeDialog('dlg-produto');
    if(!user){pendingAction='pay';openAuth();}
    else openCheckout();
  }
}

/* ── LOGIN SOCIAL ── */
function savePendingIntent(){
  if(pendingAction&&currentProduct){
    try{sessionStorage.setItem('np_pending',JSON.stringify({action:pendingAction,id:currentProduct.id}));}catch(e){}
  }
}
async function loginGoogle(){
  try{
    savePendingIntent();
    await sb.auth.signInWithOAuth({provider:'google',options:{redirectTo:window.location.origin}});
  }catch(e){showAuthError('Erro ao conectar com Google.');}
}
async function loginApple(){
  try{
    savePendingIntent();
    await sb.auth.signInWithOAuth({provider:'apple',options:{redirectTo:window.location.origin}});
  }catch(e){showAuthError('Erro ao conectar com Apple.');}
}
// Escuta retorno OAuth
sb.auth.onAuthStateChange&&sb.auth.onAuthStateChange(async(event,session)=>{
if(event==='SIGNED_IN'&&session?.user&&!user){
    const u=session.user;
    // 1º login DE VERDADE: conta recém-criada no Supabase (vale em qualquer device, não depende de localStorage)
    const created=u.created_at?new Date(u.created_at).getTime():0;
    const lastIn=u.last_sign_in_at?new Date(u.last_sign_in_at).getTime():created;
    const isFirstEver=created>0&&(lastIn-created<10000);
    const isNew=isFirstEver&&!localStorage.getItem('np_welcomed_'+u.email);
    user={name:u.user_metadata?.full_name||u.user_metadata?.name||u.email.split('@')[0],email:u.email,role:'user',firstEver:isFirstEver};
    purchases=[];saveSession();closeDialog('dlg-auth');updateNavUI();
    if(isNew){
      localStorage.setItem('np_welcomed_'+u.email,'1');
      await sendEmailAction('send_welcome',{nome:user.name,email:u.email});
    }
    afterAuth();
  }
});

/* ── EMAILS ── */
async function sendEmailAction(action,payload){
  try{
    await fetch(`${SUPABASE_URL}/functions/v1/smooth-task`,{
      method:'POST',
      headers:{'Content-Type':'application/json','apikey':SUPABASE_ANON,'Authorization':'Bearer '+SUPABASE_ANON},
      body:JSON.stringify({action,payload})
    });
  }catch(e){console.warn('Email error:',e);}
}

/* AUTH */
function togglePass(id, btn){
  const inp=document.getElementById(id);
  const show=inp.type==='password';
  inp.type=show?'text':'password';
  btn.innerHTML=show
    ?'<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>'
    :'<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>';
}
function openAuth(){switchAuthTab('cad');clearAuthError();openDialog('dlg-auth');}
function switchAuthTab(t){
  const c=t==='cad';
  ['cad','login'].forEach(x=>document.getElementById('tab-'+x).classList.toggle('active',t===x));
  document.getElementById('panel-cad').style.display=c?'block':'none';
  document.getElementById('panel-login').style.display=c?'none':'block';
  document.getElementById('auth-title').textContent=c?'Criar conta':'Bem-vinda de volta';
  document.getElementById('auth-sub').textContent=c?'Acesse seus materiais a qualquer hora, mesmo que perca o link.':'Entre para acessar seus downloads.';
  clearAuthError();
}
function showAuthError(m){const e=document.getElementById('auth-error');e.textContent=m;e.classList.add('show');}
function clearAuthError(){document.getElementById('auth-error').classList.remove('show');}
function doCad(){
  clearAuthError();
  const name=document.getElementById('cad-name').value.trim();
  const email=document.getElementById('cad-email').value.trim();
  const pass=document.getElementById('cad-pass').value;
  if(!name){showAuthError('Digite seu nome.');return;}
  if(!email||!email.includes('@')){showAuthError('E-mail inválido.');return;}
  if(pass.length<6){showAuthError('Senha deve ter pelo menos 6 caracteres.');return;}
  const acc=JSON.parse(localStorage.getItem('np_acc')||'{}');
  if(acc[email]){showAuthError('Já existe uma conta com este e-mail. Faça login.');return;}
  acc[email]={name,pw:btoa(pass)};localStorage.setItem('np_acc',JSON.stringify(acc));
  user={name,email,role:'user'};purchases=[];saveSession();closeDialog('dlg-auth');updateNavUI();
  // Email de boas-vindas
  sendEmailAction('send_welcome',{nome:name,email});
  afterAuth();
  showWelcomeIfFirstTime();
}
async function doLogin(){
  clearAuthError();
  const email=document.getElementById('lg-email').value.trim();
  const pass=document.getElementById('lg-pass').value;
  if(!email||!pass){showAuthError('Preencha e-mail e senha.');return;}

  // 1. Admin principal
  if(email===ADMIN_EMAIL&&pass===ADMIN_PASS){
    user={name:'Joice Almeida',email,role:'admin',isOwner:true};
    purchases=[];saveSession();closeDialog('dlg-auth');updateNavUI();showAdmin();return;
  }

  // 2. Membros da equipe — busca no Supabase
  try{
    const{data:members}=await sb.from('team_members').select('*').eq('email',email).limit(1);
    if(members&&members.length>0){
      const m=members[0];
      // Compara senha (salva como texto simples por ora)
      if(m.password_hash===pass){
        user={name:m.name,email,role:m.role};
        purchases=[];saveSession();closeDialog('dlg-auth');updateNavUI();showAdmin();return;
      } else {
        showAuthError('Senha incorreta.');return;
      }
    }
  }catch(e){console.warn('Team check error:',e);}

  // 3. Clientes normais
  const acc=JSON.parse(localStorage.getItem('np_acc')||'{}');
  if(!acc[email]){showAuthError('Conta não encontrada. Crie uma conta.');return;}
  if(acc[email].pw!==btoa(pass)){showAuthError('Senha incorreta.');return;}
  user={name:acc[email].name,email,role:'user'};
  purchases=JSON.parse(localStorage.getItem('np_p_'+email)||'[]');
  saveSession();closeDialog('dlg-auth');updateNavUI();afterAuth();
  showWelcomeIfFirstTime();
}

/* ════════ MODAL DE BOAS-VINDAS (1ª vez do cliente) ════════ */
let afterWelcomeRun=null;
function willShowWelcome(){
  if(!user)return false;
  if(user.role==='admin'||user.role==='editor')return false;
  if(user.firstEver===false)return false; // login social recorrente: já conhece a plataforma, não mostra
  return !localStorage.getItem('np_welcome_shown_'+(user.email||''));
}
function showWelcome(){
  const key='np_welcome_shown_'+(user.email||'');
  const firstName=(user.name||'amiga').split(' ')[0];
  const nameEl=document.getElementById('welcome-name');
  const dlgEl=document.getElementById('dlg-welcome');
  if(!dlgEl)return;
  if(nameEl)nameEl.textContent=firstName;
  openDialog('dlg-welcome');
  localStorage.setItem(key,'1');
}
// usado pelos logins por e-mail sem pendência de download
function showWelcomeIfFirstTime(){ if(willShowWelcome()) showWelcome(); }

function closeWelcomeModal(){
  closeDialog('dlg-welcome');
  // depois do "bem-vindo", leva pro material que a pessoa queria
  if(typeof afterWelcomeRun==='function'){const fn=afterWelcomeRun;afterWelcomeRun=null;setTimeout(fn,250);}
}

function _goToCardAndRun(act){
  // rola até o card que a pessoa clicou e destaca
  const card=currentProduct?document.getElementById('card-'+currentProduct.id):null;
  if(card){
    card.scrollIntoView({behavior:'smooth',block:'center'});
    card.classList.add('card-highlight');
    setTimeout(()=>card.classList.remove('card-highlight'),2600);
  }
  // espera o scroll terminar antes de abrir o download/checkout (senão o modal trava a rolagem no topo)
  setTimeout(()=>{ if(act==='free'){releaseDownload();} else if(act==='pay'){openCheckout();} },700);
}
function _runPending(){
  if(!currentProduct||!pendingAction)return;
  const act=pendingAction;
  pendingAction=null;
  if(willShowWelcome()){
    // 1ª vez: mostra o "bem-vindo" e só leva pro material quando ela fechar
    afterWelcomeRun=()=>_goToCardAndRun(act);
    showWelcome();
  } else {
    _goToCardAndRun(act);
  }
}
function afterAuth(){
  // Recupera a intenção salva antes do login social (sobrevive ao reload do OAuth)
  if(!currentProduct||!pendingAction){
    let intent=null;
    try{const raw=sessionStorage.getItem('np_pending');if(raw)intent=JSON.parse(raw);}catch(e){}
    if(intent){
      sessionStorage.removeItem('np_pending');
      pendingAction=intent.action;
      if(materials.length>0){
        currentProduct=materials.find(m=>m.id===intent.id)||currentProduct;
        _runPending();
      } else {
        const _w=setInterval(()=>{
          if(materials.length>0){
            clearInterval(_w);
            currentProduct=materials.find(m=>m.id===intent.id)||currentProduct;
            _runPending();
          }
        },200);
        setTimeout(()=>clearInterval(_w),6000);
      }
      return;
    }
  }
  _runPending();
}

/* CHECKOUT */
function ckStep(n){
  [1,2,3].forEach(i=>{
    document.getElementById('ck-step'+i).classList.toggle('active',i===n);
    const s=document.getElementById('cks'+i);s.classList.remove('active','done');
    if(i<n)s.classList.add('done');if(i===n)s.classList.add('active');
  });
}
function selPay(el,m){document.querySelectorAll('.pay-opt').forEach(o=>o.classList.remove('sel'));el.classList.add('sel');payMethod=m;}
/* ── CHECKOUT TRANSPARENTE ── */
let currentPayMethod='pix';
let pixPaymentId=null;
let pixPollInterval=null;

function selectPayMethod(method, btn){
  currentPayMethod=method;
  document.querySelectorAll('.pay-method-btn').forEach(b=>b.classList.remove('active'));
  btn.classList.add('active');
  ['pix','cartao','boleto'].forEach(m=>{
    document.getElementById('pay-'+m).style.display=m===method?'block':'none';
  });
}

function maskCard(el){
  let v=el.value.replace(/\D/g,'').slice(0,16);
  el.value=v.replace(/(\d{4})(?=\d)/g,'$1 ');
}
function maskExp(el){
  let v=el.value.replace(/\D/g,'').slice(0,4);
  if(v.length>2) v=v.slice(0,2)+'/'+v.slice(2);
  el.value=v;
}

async function gerarPix(){
  const btn=document.getElementById('btn-gerar-pix');
  btn.disabled=true;btn.innerHTML='<span class="spin"></span> Gerando...';
  try{
    const res=await fetch(`${SUPABASE_URL}/functions/v1/smooth-task`,{
      method:'POST',
      headers:{'Content-Type':'application/json','apikey':SUPABASE_ANON,'Authorization':'Bearer '+SUPABASE_ANON},
      body:JSON.stringify({
        action:'create_pix',
        payload:{
          product:{id:currentProduct.id,title:currentProduct.title,price:currentProduct.price},
          user_email:user.email,user_name:user.name,
          kind:currentProduct._kind||'material',
          coupon_code:ckCupomAplicado?.codigo||''
        }
      })
    });
    const data=await res.json();
    if(data.qr_code){
      // Mostra QR Code
      const wrap=document.getElementById('pix-qr-wrap');
      const qrImg=document.getElementById('pix-qr-img');
      const codeInput=document.getElementById('pix-copy-code');
      qrImg.innerHTML=`<img src="data:image/png;base64,${data.qr_code_base64}" style="width:180px;height:180px">`;
      codeInput.value=data.qr_code;
      wrap.style.display='block';
      btn.style.display='none';
      pixPaymentId=data.payment_id;
      // Poll para verificar pagamento
      pollPixPayment(data.payment_id);
    } else {
      throw new Error(data.error||'Erro ao gerar PIX');
    }
  }catch(e){
    btn.disabled=false;btn.innerHTML='Gerar QR Code PIX';
    alert('Erro ao gerar PIX. Tente novamente.');
  }
}

function copyPixCode(){
  const code=document.getElementById('pix-copy-code').value;
  navigator.clipboard?.writeText(code).then(()=>showToast('Código PIX copiado!')).catch(()=>{
    const el=document.createElement('textarea');
    el.value=code;document.body.appendChild(el);el.select();
    document.execCommand('copy');document.body.removeChild(el);
    showToast('Código PIX copiado!');
  });
}

function pollPixPayment(paymentId){
  clearInterval(pixPollInterval);
  let attempts=0;
  pixPollInterval=setInterval(async()=>{
    attempts++;
    if(attempts>60){clearInterval(pixPollInterval);return;}
    try{
      const res=await fetch(`${SUPABASE_URL}/functions/v1/smooth-task`,{
        method:'POST',
        headers:{'Content-Type':'application/json','apikey':SUPABASE_ANON,'Authorization':'Bearer '+SUPABASE_ANON},
        body:JSON.stringify({action:'check_payment',payload:{payment_id:paymentId}})
      });
      const data=await res.json();
      if(data.status==='approved'){
        clearInterval(pixPollInterval);
        releaseDownload();
        ckStep(3);
      }
    }catch(e){}
  },5000); // verifica a cada 5s
}

async function pagarCartao(){
  const number=document.getElementById('card-number').value.replace(/\s/g,'');
  const name=document.getElementById('card-name').value.trim();
  const exp=document.getElementById('card-exp').value;
  const cvv=document.getElementById('card-cvv').value;
  const cpf=document.getElementById('card-cpf').value.replace(/\D/g,'');
  const parcelas=document.getElementById('card-parcelas').value;
  if(!number||number.length<16){alert('Número do cartão inválido.');return;}
  if(!name){alert('Digite o nome como está no cartão.');return;}
  if(!exp||exp.length<5){alert('Data de validade inválida.');return;}
  if(!cvv){alert('CVV inválido.');return;}
  if(!cpf||cpf.length<11){alert('CPF inválido.');return;}

  const btn=document.querySelector('#pay-cartao .btn-pay');
  btn.disabled=true;btn.innerHTML='<span class="spin"></span> Processando...';

  try{
    // Tokeniza o cartão com o MP SDK
    if(!window.MercadoPago) await loadScript('https://sdk.mercadopago.com/js/v2');
    const mp=new window.MercadoPago(MP_PUBLIC_KEY,{locale:'pt-BR'});
    const [expMonth,expYear]=exp.split('/');
// Detecta bandeira do cartão usando o próprio SDK do MP (evita CORS)
    let paymentMethodId='visa';
    try{
      const bin=number.substring(0,6);
      const pmResult=await mp.getPaymentMethods({bin});
      if(pmResult.results&&pmResult.results.length>0){
        paymentMethodId=pmResult.results[0].id;
      }
    }catch(e){console.warn('PM detect error:',e);}

    const cardToken=await mp.createCardToken({
      cardNumber:number,
      cardholderName:name,
      cardExpirationMonth:expMonth,
      cardExpirationYear:'20'+expYear,
      securityCode:cvv,
      identificationType:'CPF',
      identificationNumber:cpf,
    });
    if(!cardToken.id) throw new Error('Erro ao tokenizar cartão');

    // Envia para a Edge Function
    const res=await fetch(`${SUPABASE_URL}/functions/v1/smooth-task`,{
      method:'POST',
      headers:{'Content-Type':'application/json','apikey':SUPABASE_ANON,'Authorization':'Bearer '+SUPABASE_ANON},
      body:JSON.stringify({
        action:'create_card',
        payload:{
          card_token:cardToken.id,
          installments:parseInt(parcelas),
          payment_method_id:paymentMethodId,
          product:{id:currentProduct.id,title:currentProduct.title,price:currentProduct.price},
          user_email:user.email,user_name:user.name,cpf,
          kind:currentProduct._kind||'material',
          coupon_code:ckCupomAplicado?.codigo||''
        }
      })
    });
    const data=await res.json();
    if(data.status==='approved'){
      releaseDownload();ckStep(3);
    } else if(data.status==='in_process'){
      alert('Pagamento em análise. Você receberá um e-mail quando aprovado.');
      closeDialog('dlg-checkout');
    } else {
      throw new Error(data.status_detail||'Pagamento não aprovado');
    }
  }catch(e){
    btn.disabled=false;btn.innerHTML='Pagar agora';
    alert('Erro: '+e.message+'. Verifique os dados e tente novamente.');
  }
}

async function gerarBoleto(){
  const cpf=document.getElementById('boleto-cpf').value.replace(/\D/g,'');
  const nome=document.getElementById('boleto-nome').value.trim();
  if(!cpf||cpf.length<11){alert('CPF inválido.');return;}
  if(!nome){alert('Digite seu nome completo.');return;}

  const btn=document.getElementById('btn-gerar-boleto');
  btn.disabled=true;btn.innerHTML='<span class="spin"></span> Gerando...';

  try{
    const res=await fetch(`${SUPABASE_URL}/functions/v1/smooth-task`,{
      method:'POST',
      headers:{'Content-Type':'application/json','apikey':SUPABASE_ANON,'Authorization':'Bearer '+SUPABASE_ANON},
      body:JSON.stringify({
        action:'create_boleto',
        payload:{
          product:{id:currentProduct.id,title:currentProduct.title,price:currentProduct.price},
          user_email:user.email,user_name:nome,cpf,
          kind:currentProduct._kind||'material',
          coupon_code:ckCupomAplicado?.codigo||''
        }
      })
    });
    const data=await res.json();
    if(data.barcode){
      document.getElementById('boleto-code').value=data.barcode;
      document.getElementById('boleto-link').href=data.boleto_url||'#';
      document.getElementById('boleto-result').style.display='block';
      btn.style.display='none';
    } else {
      throw new Error(data.error||'Erro ao gerar boleto');
    }
  }catch(e){
    btn.disabled=false;btn.innerHTML='Gerar boleto';
    alert('Erro ao gerar boleto: '+e.message);
  }
}

async function processPayment(){
  // Redireciona para método selecionado
  if(currentPayMethod==='pix') await gerarPix();
  else if(currentPayMethod==='cartao') await pagarCartao();
  else await gerarBoleto();
}
function loadScript(src){
  return new Promise((resolve,reject)=>{
    const s=document.createElement('script');
    s.src=src;s.onload=resolve;s.onerror=reject;
    document.head.appendChild(s);
  });
}
function releaseDownload(){
  if(!currentProduct||!user)return;
  const p=currentProduct;
  // Registra download
  if(!purchases.find(x=>x.id===p.id)){
    purchases.unshift({id:p.id,title:p.title,emoji:p.emoji,price:p.price,is_free:p.is_free,date:new Date().toLocaleDateString('pt-BR'),file_url:p.file_url});
    saveSession();
  }
  // Para gratuitos — abre dialog de sucesso com download automático
  if(p.is_free){
    // Auto-download se tiver URL
    if(p.file_url&&p.file_url!=='#'){
      const a=document.createElement('a');
      a.href=p.file_url;a.download='';a.target='_blank';
      document.body.appendChild(a);a.click();document.body.removeChild(a);
      // Email com o arquivo
      sendEmailAction('send_download',{nome:user.name,email:user.email,produto:p.title,fileUrl:p.file_url});
    }
    // Mostra tela de sucesso na dialog de checkout
    openDialog('dlg-checkout');
    ckStep(3); // Vai direto para step 3 (download)
    document.getElementById('dl-email').textContent=user.email;
    // Atualiza step 3 para mostrar mensagem de gratuito
    const dlStep=document.getElementById('ck-step3');
    if(dlStep){
      dlStep.innerHTML=`
        <div class="success-sc">
          <div class="success-mark">✓</div>
          <h3>Download disponível!</h3>
          <p>${p.emoji} <strong>${p.title}</strong></p>
          <p style="font-size:13px;color:var(--ink-lt);margin-top:8px">O arquivo foi aberto automaticamente. Se não abriu, clique abaixo.</p>
          ${p.file_url&&p.file_url!=='#'?`<a href="${p.file_url}" target="_blank" class="btn-pay" style="display:inline-flex;margin-top:20px;text-decoration:none">📥 Baixar novamente</a>`:''}
          <button onclick="closeDialog('dlg-checkout')" style="display:block;margin-top:12px;background:none;border:none;font-size:13px;color:var(--ink-lt);cursor:pointer;font-family:'DM Sans',sans-serif">Fechar</button>
        </div>`;
    }
  } else {
    // Pago — mostra email do download
    document.getElementById('dl-email').textContent=user.email;
  }
}
function doDownload(){
  if(currentProduct?.file_url&&currentProduct.file_url!=='#'){
    window.open(currentProduct.file_url,'_blank');
  } else {
    alert('O arquivo estará disponível em breve.');
  }
}

/* QUIZ */
function toggleOpt(el,v){
  el.classList.toggle('selected');
  const chk=el.querySelector('.quiz-check');
  if(el.classList.contains('selected')){q1Selected.push(v);chk.textContent='✓';}
  else{q1Selected=q1Selected.filter(x=>x!==v);chk.textContent='';}
}
function selectOpt(el,v){
  el.closest('div').querySelectorAll('.quiz-opt').forEach(o=>{o.classList.remove('selected');o.querySelector('.quiz-check').textContent='';});
  el.classList.add('selected');el.querySelector('.quiz-check').textContent='✓';
  return v;
}
function quizNext(step){
  if(step===1){if(!q1Selected.length){alert('Selecione ao menos uma opção.');return;}quizAnswers.symptoms=q1Selected;}
  if(step===2){const s=document.querySelector('#qs2 .quiz-opt.selected');if(!s){alert('Selecione a faixa etária.');return;}quizAnswers.age=s.textContent.replace('✓','').trim();}
  if(step===3){
    const s=document.querySelector('#qs3 .quiz-opt.selected');
    if(!s){alert('Selecione como prefere começar.');return;}
    quizAnswers.start=s.textContent.replace('✓','').trim();
    // Popula dropdown de kits do banco ao chegar no Q4
    populateQuizKitDropdown();
  }
  document.getElementById('qs'+step).classList.remove('active');
  const next=step<4?'qs'+(step+1):'qs-result';
  document.getElementById(next).classList.add('active');
  updateQP(step+1);
}

async function populateQuizKitDropdown(){
  const sel=document.getElementById('q-kit-pref');
  if(!sel)return;
  try{
    const{data:kits}=await sb.from('kits').select('id,name,emoji,age_range').eq('active',true).order('name');
    sel.innerHTML='<option value="">Quero a sugestão da especialista</option>'+(kits||[]).map(k=>`<option value="${k.id}">${k.emoji||'🎒'} ${k.name}${k.age_range?' ('+k.age_range+')':''}</option>`).join('');
  }catch(e){console.warn('[quiz] erro carregando kits:',e);}
}
function updateQP(step){
  document.querySelectorAll('.qp-bar').forEach((b,i)=>{b.classList.remove('active','done');if(i<step-1)b.classList.add('done');if(i===step-1)b.classList.add('active');});
}
async function submitQuiz(){
  const name=document.getElementById('q-name').value.trim();
  const email=document.getElementById('q-email').value.trim();
  const wpp=document.getElementById('q-wpp').value.trim();
  const uf=document.getElementById('q-uf').value;
  const cidade=document.getElementById('q-cidade').value.trim();
  const bairro=document.getElementById('q-bairro').value.trim();
  const kitPrefEl=document.getElementById('q-kit-pref');
  const kitPrefNome=kitPrefEl.options[kitPrefEl.selectedIndex].text;
  const kitPrefId=kitPrefEl.value;
  const foco=document.getElementById('q-foco').value.trim();

  if(!name||!email){alert('Preencha nome e e-mail para ver o resultado.');return;}
  if(!bairro){alert('Informe o bairro pra podermos calcular o frete se for kit.');return;}

  const kit=recommendKit(quizAnswers.symptoms||[]);
  quizAnswers={...quizAnswers,name,email,wpp,uf,cidade,bairro,kit_preferido:kitPrefNome,kit_preferido_id:kitPrefId,foco,kit:kit.name};
  const pref=quizAnswers.start||'kit';

  // Salvar lead (com detalhes completos)
  try{
    await sb.from('leads').insert({
      name,email,whatsapp:wpp,
      symptoms:foco?[foco,...(quizAnswers.symptoms||[])]:(quizAnswers.symptoms||[]),
      recommended_kit:pref==='acomp'?'sessao':(kitPrefId||kit.name),
      contact_preference:pref==='acomp'?'sessao_presencial':pref==='digital'?'material':'kit',
      status:'new',
      child_age:JSON.stringify({
        idade:quizAnswers.age,
        bairro,cidade,uf,
        kit_preferido:kitPrefNome,
        kit_preferido_id:kitPrefId,
        foco,
        sintomas:quizAnswers.symptoms||[]
      })
    });
  }catch(e){console.warn('[quiz] erro salvando lead:',e);}

  // Envia email do resultado do quiz
  try{
    const kitFinal=pref==='acomp'?'Sessão Presencial em Manaus':pref==='digital'?'Materiais Digitais':kit.name;
    sendEmailAction('send_quiz_result',{
      email,
      nome:name,
      kit_recomendado:kitFinal,
      is_logged_in:!!user,
      respostas:quizAnswers
    });
  }catch(e){console.warn('[quiz] erro disparando email',e);}

  // Preencher resultado
  document.getElementById('qr-marker').textContent='🎒';
  document.getElementById('qr-kit-name').textContent=pref==='acomp'?'Sessão Presencial':pref==='digital'?'Materiais Digitais':kit.name;
  document.getElementById('qr-area').textContent=pref==='acomp'?'Acompanhamento em Casa':pref==='digital'?'Guias e recursos práticos':kit.area;
  document.getElementById('qr-desc').textContent=pref==='acomp'
    ? 'Ótima escolha. Uma Assistente de Desenvolvimento Infantil irá até sua casa e trabalhará com seu filho através da brincadeira. Nossa equipe entrará em contato em até 48 horas.'
    : pref==='digital'
    ? 'Temos guias práticos, fichas de atividades e roteiros prontos para você aplicar em casa. Alguns são gratuitos — acesse agora mesmo.'
    : kit.desc+' Nossa equipe entrará em contato em até 48 horas com mais detalhes.';

  // Monta a URL do WhatsApp com mensagem natural em 1ª pessoa
  const slugify=s=>s.normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-zA-Z0-9]/g,'');
  const categoria=pref==='acomp'?'Sessao':pref==='digital'?'Material':'Kit';
  const kitFinalNome=pref==='acomp'?'Sessão Presencial em Manaus':pref==='digital'?'Materiais Digitais':kit.name;
  const sintomasLista=(quizAnswers.symptoms||[]);
  const sintomasFrase=sintomasLista.length?sintomasLista.join(', '):'gostaria de conversar sobre como podem me ajudar';
  const ageText=quizAnswers.age||'idade não informada';
  const ageTag=slugify(ageText)||'Indefinida';
  const kitTag=slugify(kitFinalNome);
  const firstName=name.split(' ')[0];
  const sintomasHashtags=sintomasLista.map(s=>'#'+slugify(s)).join(' ');
  const wppLine=wpp?`\n📱 ${wpp}`:'';
  const localStr=`${cidade}/${uf}, bairro ${bairro}`;
  const focoLine=foco?`\n🎯 Foco principal: ${foco}`:'';
  const kitPrefLine=kitPrefId?`\n🎒 Kit de interesse: ${kitPrefNome}`:'';

  // Mensagem por tipo de interesse — em 1ª pessoa
  let introMsg;
  if(pref==='acomp'){
    introMsg=`Oi, equipe Neuroplasticidar! 💜

Fiz o quiz no site e o resultado me indicou a sessão presencial. Tenho interesse em saber mais.

Sou ${firstName}, moro em ${localStr} e estou acompanhando uma criança de ${ageText}. Minhas principais preocupações são: ${sintomasFrase}.${focoLine}

Gostaria de saber sobre como funciona a sessão, disponibilidade e detalhes do atendimento.`;
  } else if(pref==='digital'){
    introMsg=`Oi, equipe Neuroplasticidar! 💜

Fiz o quiz no site e gostaria de conversar sobre os materiais digitais que vocês oferecem.

Sou ${firstName}, moro em ${localStr} e estou acompanhando uma criança de ${ageText}. Minhas principais preocupações são: ${sintomasFrase}.${focoLine}

Quero saber quais materiais combinam mais com o que estou buscando.`;
  } else {
    introMsg=`Oi, equipe Neuroplasticidar! 💜

Fiz o quiz no site e o resultado me indicou o ${kitFinalNome}. Gostaria de saber mais detalhes.

Sou ${firstName}, moro em ${localStr} e estou acompanhando uma criança de ${ageText}. Minhas principais preocupações são: ${sintomasFrase}.${focoLine}${kitPrefLine}

Quero saber como funciona, como recebo e o investimento.`;
  }

  const whatsappMsg=`${introMsg}

📧 ${email}${wppLine}

Aguardo retorno!

—
#${categoria} #${kitTag} #Idade${ageTag} #${slugify(cidade)} #${slugify(bairro)}${sintomasHashtags?' '+sintomasHashtags:''}`;
  const whatsappUrl=`https://wa.me/5592991479457?text=${encodeURIComponent(whatsappMsg)}`;

  // Botões dinâmicos por destino — Kit e Sessão vão direto pro WhatsApp
  const actionsEl=document.getElementById('qr-actions');
  if(pref==='acomp'){
    // Sessão → WhatsApp da Jaque com template do quiz
    actionsEl.innerHTML=`
      <a href="${whatsappUrl}" target="_blank" rel="noopener" class="btn-gold" style="text-decoration:none;background:#25D366;color:#fff">💬 Falar pelo WhatsApp</a>
      <a href="javascript:void(0)" onclick="closeDialog('dlg-quiz');openSessaoDialog()" style="display:inline-flex;align-items:center;padding:13px 24px;border-radius:50px;border:1.5px solid var(--border);font-size:14px;font-weight:500;color:var(--ink-md);text-decoration:none;transition:all .2s" onmouseover="this.style.borderColor='var(--blue)'" onmouseout="this.style.borderColor='var(--border)'">Ver detalhes e cupom</a>`;
  } else if(pref==='digital'){
    // Material → seção de materiais + WhatsApp opcional
    actionsEl.innerHTML=`
      <a href="#materiais" class="btn-gold" style="text-decoration:none">Ver materiais gratuitos</a>
      <a href="${whatsappUrl}" target="_blank" rel="noopener" style="display:inline-flex;align-items:center;padding:13px 24px;border-radius:50px;border:1.5px solid #25D366;background:#fff;font-size:14px;font-weight:500;color:#25D366;text-decoration:none;transition:all .2s">💬 Falar com a equipe</a>`;
  } else {
    // Kit → WhatsApp da Jaque com template do quiz
    actionsEl.innerHTML=`
      <a href="${whatsappUrl}" target="_blank" rel="noopener" class="btn-gold" style="text-decoration:none;background:#25D366;color:#fff">💬 Quero esse kit (WhatsApp)</a>
      <a href="#materiais" style="display:inline-flex;align-items:center;padding:13px 24px;border-radius:50px;border:1.5px solid var(--border);font-size:14px;font-weight:500;color:var(--ink-md);text-decoration:none;transition:all .2s" onmouseover="this.style.borderColor='var(--blue)'" onmouseout="this.style.borderColor='var(--border)'">Ver materiais gratuitos</a>`;
  }

  quizNext(4);
}
function recommendKit(syms){
  return KITS.map(k=>({...k,score:syms.filter(s=>k.syms.includes(s)).length})).sort((a,b)=>b.score-a.score)[0]||KITS[0];
}
function resetQuiz(){
  q1Selected=[];quizAnswers={};
  document.querySelectorAll('.quiz-step').forEach(s=>s.classList.remove('active'));
  document.getElementById('qs1').classList.add('active');
  document.querySelectorAll('.quiz-opt').forEach(o=>{o.classList.remove('selected');const c=o.querySelector('.quiz-check');if(c)c.textContent='';});
  updateQP(1);
}

/* CONTATO */
async function submitContact(){
  const btn=document.getElementById('ct-btn');
  const name=document.getElementById('ct-name').value.trim();
  const email=document.getElementById('ct-email').value.trim();
  const wpp=document.getElementById('ct-wpp')?.value.trim()||'';
  const perfil=document.getElementById('ct-perfil')?.value||'';
  const msg=document.getElementById('ct-msg')?.value.trim()||'';
  if(!name||!email){alert('Preencha nome e e-mail.');return;}
  btn.textContent='Enviando…';btn.disabled=true;
  // Salva lead no banco
  try{await sb.from('leads').insert({name,email,whatsapp:wpp,symptoms:[],contact_preference:'duvida_geral',recommended_kit:'contato',status:'new'});}catch(e){}
  // Dispara email pra equipe (com reply_to = email do cliente)
  try{
    await sendEmailAction('send_contact_form',{
      nome:name,email,whatsapp:wpp,perfil,mensagem:msg
    });
  }catch(e){console.warn('[contato] erro disparando email',e);}
  setTimeout(()=>{btn.textContent='✓ Mensagem enviada!';btn.style.background='var(--sage)';
    document.getElementById('ct-name').value='';document.getElementById('ct-email').value='';
    if(document.getElementById('ct-msg'))document.getElementById('ct-msg').value='';
    if(document.getElementById('ct-wpp'))document.getElementById('ct-wpp').value='';
  },500);
}

// Funções legadas mantidas vazias para compatibilidade (caso ainda haja chamadas residuais)
function selectIntent(){}
function goToSessao(){openSessaoDialog();}
function aplicarCupomContato(){}

function directCheckout(id){
  currentProduct=materials.find(p=>p.id===id);
  if(!currentProduct)return;
  if(currentProduct.is_free){
    // Gratuito — precisa de login, sem pagamento
    if(!user){pendingAction='free';openAuth();}
    else{releaseDownload();}
  } else {
    // Pago — checkout normal
    if(!user){pendingAction='pay';openAuth();}
    else openCheckout();
  }
}

/* ADMIN */
async function loadMaterials(force=false){
  try{
    // Adiciona timestamp para evitar cache quando force=true
    const query=sb.from('materials').select('*').eq('active',true).order('created_at',{ascending:false});
    const{data,error}=await query;
    if(!error&&data&&data.length){materials=data;}
    else{materials=FALLBACK_MATERIALS;}
  }catch(e){materials=FALLBACK_MATERIALS;}
}

/* BOLSA */

/* DASHBOARD */
// Cache global de compras reais (Supabase)
let _purchasesCache=[];
async function loadPurchasesFromDB(){
  try{
    const{data,error}=await sb.from('purchases').select('*').eq('payment_status','approved').order('created_at',{ascending:false});
    if(error){
      // Evita DataCloneError ao logar — pega só campos serializáveis
      const errInfo={message:error.message,code:error.code,details:error.details,hint:error.hint};
      console.error('[purchases] erro:',JSON.stringify(errInfo));
      return [];
    }
    _purchasesCache=data||[];
    return _purchasesCache;
  }catch(e){console.error('[purchases] exceção:',e);return [];}
}
function getAllPurchases(){
  // Retorna o cache do banco. Se vazio, retorna localStorage como fallback transitório.
  if(_purchasesCache.length)return _purchasesCache;
  const all=[];
  for(let i=0;i<localStorage.length;i++){const k=localStorage.key(i);if(k&&k.startsWith('np_p_')){try{JSON.parse(localStorage.getItem(k)||'[]').forEach(p=>all.push(p));}catch(e){}}}
  return all;
}
async function loadDashboard(){
  try{
    const{data:leads}=await sb.from('leads').select('*').order('created_at',{ascending:false});
    const all=leads||[];
    const quizLeads=all.filter(l=>l.recommended_kit!=='sessao'&&l.contact_preference!=='sessao_presencial');
    const sessLeads=all.filter(l=>l.recommended_kit==='sessao'||l.contact_preference==='sessao_presencial');
    const newQL=quizLeads.filter(l=>!l.status||l.status==='new');
    const newSL=sessLeads.filter(l=>!l.status||l.status==='new');
    const set=(id,v)=>{const e=document.getElementById(id);if(e)e.textContent=v;};
    set('ds-leads',quizLeads.length);
    set('ds-leads-new',newQL.length+' novos');
    set('ds-sessoes',sessLeads.length);
    set('ds-sessoes-new',newSL.length+' pendentes');
    const purch=await loadPurchasesFromDB();
    // Receita = compras (materiais+kits) + sessões pagas + kits por curadoria (pedidos_kit)
    const{data:_sessPg}=await sb.from('sessoes_agendadas').select('valor_sinal').in('status',['sinal_pago','realizada']);
    const{data:_kitPg}=await sb.from('pedidos_kit').select('valor_total').in('status',['pago','preparando','enviado','entregue']);
    const revPurch=purch.reduce((s,p)=>s+(parseFloat(p.amount||p.price||0)),0);
    const revSess=(_sessPg||[]).reduce((s,v)=>s+parseFloat(v.valor_sinal||0),0);
    const revKit=(_kitPg||[]).reduce((s,v)=>s+parseFloat(v.valor_total||0),0);
    const rev=revPurch+revSess+revKit;
    const totalCompras=purch.length+(_sessPg||[]).length+(_kitPg||[]).length;
    set('ds-revenue','R$ '+rev.toFixed(2).replace('.',','));
    set('ds-purchases',totalCompras+' compras');
    // leads list
    const ldl=document.getElementById('ds-leads-list');
    if(ldl)ldl.innerHTML=quizLeads.slice(0,5).map(l=>`
      <div class="adm-dash-item"><div><div class="di-name">${l.name||'—'}</div><div class="di-sub">${l.recommended_kit||'—'} · ${new Date(l.created_at).toLocaleDateString('pt-BR')}</div></div>
      <span class="di-badge ${l.status==='converted'?'di-converted':l.status==='contacted'?'di-contacted':'di-new'}">${l.status||'novo'}</span></div>`).join('')||'<p style="font-size:13px;color:var(--ink-lt);padding:12px 0">Nenhum lead ainda.</p>';
    // sessoes list
    const sdl=document.getElementById('ds-sessoes-list');
    if(sdl)sdl.innerHTML=sessLeads.slice(0,5).map(l=>`
      <div class="adm-dash-item"><div><div class="di-name">${l.name||'—'}</div><div class="di-sub">${l.email} · ${new Date(l.created_at).toLocaleDateString('pt-BR')}</div></div>
      <span class="di-badge di-pending">pendente</span></div>`).join('')||'<p style="font-size:13px;color:var(--ink-lt);padding:12px 0">Nenhuma solicitação ainda.</p>';
    // kits chart
    const kc={};quizLeads.forEach(l=>{if(l.recommended_kit&&!['contato','sessao','manual'].includes(l.recommended_kit))kc[l.recommended_kit]=(kc[l.recommended_kit]||0)+1;});
    const ks=Object.entries(kc).sort((a,b)=>b[1]-a[1]);
    const mx=ks[0]?.[1]||1;
    const kch=document.getElementById('ds-kits-chart');
    if(kch)kch.innerHTML=ks.length?ks.map(([k,v])=>`
      <div class="kit-bar-row"><span class="kit-bar-name">${k}</span>
      <div class="kit-bar-track"><div class="kit-bar-fill" style="width:${Math.round(v/mx*100)}%"></div></div>
      <span class="kit-bar-count">${v}</span></div>`).join(''):'<p style="font-size:13px;color:var(--ink-lt);padding:8px 0">Dados aparecem após primeiros quizzes respondidos.</p>';
  }catch(e){console.warn('[dash] erro:',e);}
}

/* ══ GRÁFICOS DO DASHBOARD ══ */
let chartVendas=null,chartTipos=null,chartSplit=null,chartRepasseMensal=null;
let graficoVendasDias=30;

let _chartJsPromise=null;
function ensureChartJs(){
  if(typeof Chart!=='undefined')return Promise.resolve();
  if(_chartJsPromise)return _chartJsPromise;
  _chartJsPromise=new Promise((resolve,reject)=>{
    const s=document.createElement('script');
    s.src='https://cdn.jsdelivr.net/npm/chart.js@4.4.0/dist/chart.umd.min.js';
    s.onload=resolve;s.onerror=reject;
    document.head.appendChild(s);
  });
  return _chartJsPromise;
}
async function renderGraficos(){
  try{await ensureChartJs();}catch(e){console.warn('Chart.js não carregou');return;}
  await renderGraficoVendas();
  await renderGraficoTipos();
  await renderGraficoSplit();
}

function filtrarGraficoVendas(dias,el){
  document.querySelectorAll('#adm-dashboard .adm-filter-btn').forEach(b=>b.classList.remove('active'));
  el.classList.add('active');
  graficoVendasDias=parseInt(dias);
  renderGraficoVendas();
}

async function renderGraficoVendas(){
  const canvas=document.getElementById('chart-vendas');
  if(!canvas||typeof Chart==='undefined')return;

  const purch=await loadPurchasesFromDB();
  const{data:sess}=await sb.from('sessoes_agendadas').select('*').in('status',['sinal_pago','realizada']);
  const allVendas=[
    ...purch.map(p=>({data:p.created_at,valor:parseFloat(p.amount||0)})),
    ...(sess||[]).map(s=>({data:s.pago_em||s.created_at,valor:parseFloat(s.valor_sinal||0)}))
  ];

  const dias=graficoVendasDias;
  const hoje=new Date();
  const labels=[],valores=[];

  // Agrupa por dia (ou mês se 365 dias)
  const groupBy=dias===365?'month':'day';
  if(groupBy==='month'){
    for(let i=11;i>=0;i--){
      const d=new Date(hoje.getFullYear(),hoje.getMonth()-i,1);
      labels.push(d.toLocaleDateString('pt-BR',{month:'short'}));
      const ym=`${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}`;
      const total=allVendas.filter(v=>v.data.startsWith(ym)).reduce((s,v)=>s+v.valor,0);
      valores.push(total);
    }
  } else {
    for(let i=dias-1;i>=0;i--){
      const d=new Date(hoje);d.setDate(d.getDate()-i);
      const ymd=d.toISOString().slice(0,10);
      labels.push(d.toLocaleDateString('pt-BR',{day:'2-digit',month:'2-digit'}));
      const total=allVendas.filter(v=>v.data.startsWith(ymd)).reduce((s,v)=>s+v.valor,0);
      valores.push(total);
    }
  }

  if(chartVendas)chartVendas.destroy();
  chartVendas=new Chart(canvas,{
    type:'line',
    data:{labels,datasets:[{
      label:'Receita',data:valores,
      borderColor:'#1A3FBF',backgroundColor:'rgba(26,63,191,0.1)',
      tension:0.3,fill:true,pointRadius:3,pointHoverRadius:6,borderWidth:2
    }]},
    options:{
      responsive:true,maintainAspectRatio:false,
      plugins:{legend:{display:false},tooltip:{callbacks:{label:c=>'R$ '+c.parsed.y.toFixed(2).replace('.',',')}}},
      scales:{y:{beginAtZero:true,ticks:{callback:v=>'R$ '+v}}}
    }
  });
}

async function renderGraficoTipos(){
  const canvas=document.getElementById('chart-tipos');
  if(!canvas||typeof Chart==='undefined')return;

  const purch=await loadPurchasesFromDB();
  const{data:sess}=await sb.from('sessoes_agendadas').select('*').in('status',['sinal_pago','realizada']);

  const materiais=purch.filter(p=>p.material_id).reduce((s,p)=>s+parseFloat(p.amount||0),0);
  const kits=purch.filter(p=>!p.material_id).reduce((s,p)=>s+parseFloat(p.amount||0),0);
  const sessoes=(sess||[]).reduce((s,v)=>s+parseFloat(v.valor_sinal||0),0);

  if(chartTipos)chartTipos.destroy();
  chartTipos=new Chart(canvas,{
    type:'doughnut',
    data:{
      labels:['📄 Materiais','🎒 Kits','🏠 Sessões'],
      datasets:[{
        data:[materiais,kits,sessoes],
        backgroundColor:['#1A3FBF','#D4900A','#2E6B3E'],
        borderWidth:2,borderColor:'#fff'
      }]
    },
    options:{
      responsive:true,maintainAspectRatio:false,
      plugins:{
        legend:{position:'bottom',labels:{font:{size:12,family:"'DM Sans',sans-serif"},padding:12,usePointStyle:true}},
        tooltip:{callbacks:{label:c=>c.label+': R$ '+c.parsed.toFixed(2).replace('.',',')}}
      }
    }
  });
}

async function renderGraficoSplit(){
  const canvas=document.getElementById('chart-split');
  if(!canvas||typeof Chart==='undefined')return;

  const purch=await loadPurchasesFromDB();
  const{data:sess}=await sb.from('sessoes_agendadas').select('*').in('status',['sinal_pago','realizada']);

  let totalJaque=0,totalJoice=0;
  purch.forEach(p=>{
    const net=parseFloat(p.net_amount||p.amount||0);
    const tipo=p.material_id?'material':'kit';
    const tx=SPLIT_RATES[tipo]||0.85;
    totalJaque+=net*tx;
    totalJoice+=net*(1-tx);
  });
  (sess||[]).forEach(s=>{
    const v=parseFloat(s.valor_sinal||0);
    totalJaque+=v*0.85;
    totalJoice+=v*0.15;
  });

  if(chartSplit)chartSplit.destroy();
  chartSplit=new Chart(canvas,{
    type:'doughnut',
    data:{
      labels:['Jaque (terapeuta)','Joice (plataforma)'],
      datasets:[{
        data:[totalJaque,totalJoice],
        backgroundColor:['#A78BFA','#1A3FBF'],
        borderWidth:2,borderColor:'#fff'
      }]
    },
    options:{
      responsive:true,maintainAspectRatio:false,
      plugins:{
        legend:{position:'bottom',labels:{font:{size:12,family:"'DM Sans',sans-serif"},padding:12,usePointStyle:true}},
        tooltip:{callbacks:{label:c=>c.label+': R$ '+c.parsed.toFixed(2).replace('.',',')}}
      }
    }
  });
}

async function renderGraficoRepasseMensal(){
  const canvas=document.getElementById('chart-repasse-mensal');
  if(!canvas||typeof Chart==='undefined')return;

  const purch=await loadPurchasesFromDB();
  const{data:sess}=await sb.from('sessoes_agendadas').select('*').in('status',['sinal_pago','realizada']);

  // Últimos 6 meses
  const hoje=new Date();
  const labels=[],valJaquePagos=[],valJaquePendentes=[];
  for(let i=5;i>=0;i--){
    const d=new Date(hoje.getFullYear(),hoje.getMonth()-i,1);
    labels.push(d.toLocaleDateString('pt-BR',{month:'short',year:'2-digit'}));
    const ym=`${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}`;
    let pagos=0,pendentes=0;
    purch.forEach(p=>{
      if(!(p.created_at||'').startsWith(ym))return;
      const net=parseFloat(p.net_amount||p.amount||0);
      const tipo=p.material_id?'material':'kit';
      const valJaque=net*(SPLIT_RATES[tipo]||0.85);
      if(p.repasse_status==='pago')pagos+=valJaque;else pendentes+=valJaque;
    });
    (sess||[]).forEach(s=>{
      const dataRef=s.pago_em||s.created_at||'';
      if(!dataRef.startsWith(ym))return;
      const valJaque=parseFloat(s.valor_sinal||0)*0.85;
      if(s.repasse_status==='pago')pagos+=valJaque;else pendentes+=valJaque;
    });
    valJaquePagos.push(pagos);
    valJaquePendentes.push(pendentes);
  }

  if(chartRepasseMensal)chartRepasseMensal.destroy();
  chartRepasseMensal=new Chart(canvas,{
    type:'bar',
    data:{
      labels,
      datasets:[
        {label:'Já repassado',data:valJaquePagos,backgroundColor:'#2E6B3E'},
        {label:'A pagar',data:valJaquePendentes,backgroundColor:'#FBBF24'}
      ]
    },
    options:{
      responsive:true,maintainAspectRatio:false,
      plugins:{
        legend:{position:'bottom',labels:{font:{size:12,family:"'DM Sans',sans-serif"},padding:12,usePointStyle:true}},
        tooltip:{callbacks:{label:c=>c.dataset.label+': R$ '+c.parsed.y.toFixed(2).replace('.',',')}}
      },
      scales:{
        x:{stacked:true},
        y:{stacked:true,beginAtZero:true,ticks:{callback:v=>'R$ '+v}}
      }
    }
  });
}

/* MATERIAIS ADMIN */
let editingMaterialId=null;


/* ══════════════════ ARTIGOS (admin) ══════════════════ */
const ART_REPS={
  por_tras:{rotulo:'O que costuma estar por trás',campos:['titulo','texto'],ph:['Ritmo próprio de desenvolvimento','Explicação em um parágrafo…']},
  quando:{rotulo:'Quando procurar avaliação',campos:['texto'],ph:['Aos 2 anos: tem menos de 50 palavras…']},
  profissionais:{rotulo:'Qual profissional avalia isso',campos:['titulo','texto'],ph:['Fonoaudiólogo','O que essa especialidade faz…']},
  em_casa:{rotulo:'O que dá para fazer em casa',campos:['titulo','texto'],ph:['Narre o que você está fazendo','Como fazer, em um parágrafo…']},
  faq:{rotulo:'Perguntas frequentes',campos:['pergunta','resposta'],ph:['Pergunta que os pais fazem?','Resposta direta…']}
};
let artAtual=null;

function artRep(chave,itens){
  const c=ART_REPS[chave], el=document.getElementById('art-rep-'+chave);
  if(!el)return;
  el.innerHTML=`<div class="field"><label>${c.rotulo}</label><div id="art-lista-${chave}"></div>
    <button class="btn-save" style="margin-top:8px;background:var(--parchment);color:var(--ink);border:1px solid var(--border-md);padding:8px 16px;font-size:12px" onclick="artAdd('${chave}')">+ Adicionar</button></div>`;
  const lista=document.getElementById('art-lista-'+chave);
  (itens&&itens.length?itens:[]).forEach(it=>artLinha(lista,chave,it));
}
function artLinha(lista,chave,it){
  const c=ART_REPS[chave], d=document.createElement('div');
  d.className='art-item';
  d.style.cssText='border:1px solid var(--border);border-radius:var(--r);padding:12px;margin-bottom:8px;background:var(--cream);position:relative';
  d.innerHTML=c.campos.map((f,i)=>
    f==='titulo'||f==='pergunta'
      ? `<input type="text" data-f="${f}" placeholder="${c.ph[i]}" value="${(it&&it[f]||'').replace(/"/g,'&quot;')}" style="margin-bottom:6px;font-weight:500">`
      : `<textarea data-f="${f}" placeholder="${c.ph[i]}" style="min-height:70px">${it&&it[f]||''}</textarea>`
  ).join('')+
  `<button onclick="this.parentNode.remove()" title="Remover" style="position:absolute;top:8px;right:8px;background:none;border:0;color:var(--ink-lt);font-size:18px;cursor:pointer;line-height:1">×</button>`;
  lista.appendChild(d);
}
function artAdd(chave){artLinha(document.getElementById('art-lista-'+chave),chave,null);}
function artLer(chave){
  const c=ART_REPS[chave];
  return [...document.querySelectorAll('#art-lista-'+chave+' .art-item')].map(d=>{
    const o={};c.campos.forEach(f=>{o[f]=(d.querySelector(`[data-f="${f}"]`)||{}).value?.trim()||'';});
    return o;
  }).filter(o=>Object.values(o).some(v=>v));
}
function artLerSimples(chave){return artLer(chave).map(o=>o.texto).filter(Boolean);}

function artObjetivos(sel){
  const el=document.getElementById('art-objetivos');if(!el)return;
  sel=sel||[];
  el.innerHTML=TAXONOMIA.map(o=>
    `<label style="display:inline-flex;align-items:center;gap:6px;background:${sel.includes(o.id)?'var(--blue-lt)':'#fff'};border:1px solid var(--border);border-radius:50px;padding:7px 14px;cursor:pointer;font-size:13px">
      <input type="checkbox" value="${o.id}" ${sel.includes(o.id)?'checked':''} onchange="this.parentNode.style.background=this.checked?'var(--blue-lt)':'#fff'">
      ${o.clin}</label>`).join('');
}
function artContaDesc(){
  const v=document.getElementById('art-desc').value.length;
  const el=document.getElementById('art-desc-count');
  el.textContent=v+'/155';
  el.style.color=v>155?'#DC2626':(v<80?'var(--ink-lt)':'var(--sage)');
}
function artMsg(t,cor){
  const el=document.getElementById('art-msg');
  el.textContent=t;el.style.color=cor||'var(--sage)';
  if(t)setTimeout(()=>{if(el.textContent===t)el.textContent='';},6000);
}

async function loadAdminArtigos(){
  const tb=document.getElementById('art-tbody');if(!tb)return;
  const{data,error}=await sb.from('artigos').select('*').order('updated_at',{ascending:false});
  if(error){tb.innerHTML='<tr><td colspan="5" style="text-align:center;color:#DC2626;padding:24px">Erro ao carregar. A tabela <code>artigos</code> já foi criada no Supabase?</td></tr>';return;}
  if(!data||!data.length){tb.innerHTML='<tr><td colspan="5" style="text-align:center;color:var(--ink-lt);padding:24px;font-weight:300">Nenhum artigo ainda.</td></tr>';return;}
  tb.innerHTML=data.map(a=>`<tr>
    <td style="font-weight:500">${a.h1||'(sem título)'}</td>
    <td style="font-size:12px;color:var(--ink-lt)">/${a.pasta}/${a.slug}</td>
    <td><span class="${a.status==='publicado'?'badge-free':'badge-paid'}">${a.status==='publicado'?'Publicado':'Rascunho'}</span></td>
    <td style="font-size:12px">${new Date(a.updated_at).toLocaleDateString('pt-BR')}</td>
    <td style="white-space:nowrap">
      <button class="btn-save" style="padding:6px 14px;font-size:12px" onclick="editarArtigo('${a.id}')">Editar</button>
      ${a.status==='publicado'?`<a class="btn-save" style="padding:6px 14px;font-size:12px;text-decoration:none;background:var(--parchment);color:var(--ink);border:1px solid var(--border-md)" href="/${a.pasta}/${a.slug}" target="_blank">Ver</a>`:''}
    </td></tr>`).join('');
}

function novoArtigo(){
  artAtual=null;
  document.getElementById('art-editor').style.display='block';
  document.getElementById('art-editor-titulo').textContent='Novo artigo';
  ['art-id','art-h1','art-title','art-slug','art-badge','art-desc','art-kw','art-lead','art-quando_nota'].forEach(i=>document.getElementById(i).value='');
  document.getElementById('art-pasta').value='sinais';
  document.getElementById('art-tempo').value='6 min de leitura';
  document.getElementById('art-autor').value='Equipe Neuroplasticidar';
  Object.keys(ART_REPS).forEach(k=>artRep(k,[]));
  artObjetivos([]);artContaDesc();
  document.getElementById('art-btn-pub').style.display='none';
  document.getElementById('art-editor').scrollIntoView({behavior:'smooth'});
}

async function editarArtigo(id){
  const{data:a,error}=await sb.from('artigos').select('*').eq('id',id).single();
  if(error||!a){artMsg('Não consegui abrir esse artigo.','#DC2626');return;}
  artAtual=a;
  document.getElementById('art-editor').style.display='block';
  document.getElementById('art-editor-titulo').textContent='Editando: '+a.h1;
  const set=(i,v)=>document.getElementById(i).value=v||'';
  set('art-id',a.id);set('art-h1',a.h1);set('art-title',a.title_seo);set('art-slug',a.slug);
  set('art-badge',a.badge);set('art-desc',a.descricao);set('art-kw',a.keywords);
  set('art-autor',a.autor);set('art-tempo',a.tempo_leitura);set('art-lead',a.lead);
  set('art-quando_nota',a.quando_nota);
  document.getElementById('art-pasta').value=a.pasta||'sinais';
  artRep('por_tras',a.por_tras);
  artRep('quando',(a.quando||[]).map(t=>({texto:t})));
  artRep('profissionais',a.profissionais);
  artRep('em_casa',a.em_casa);
  artRep('faq',a.faq);
  artObjetivos(a.objetivos||[]);artContaDesc();
  document.getElementById('art-btn-pub').style.display='';
  document.getElementById('art-editor').scrollIntoView({behavior:'smooth'});
}
function fecharEditorArtigo(){document.getElementById('art-editor').style.display='none';artAtual=null;}

function artPayload(){
  const g=i=>document.getElementById(i).value.trim();
  return{
    h1:g('art-h1'),title_seo:g('art-title')||g('art-h1'),slug:g('art-slug'),
    pasta:document.getElementById('art-pasta').value,badge:g('art-badge'),
    descricao:g('art-desc'),keywords:g('art-kw'),autor:g('art-autor'),
    tempo_leitura:g('art-tempo'),lead:g('art-lead'),quando_nota:g('art-quando_nota'),
    por_tras:artLer('por_tras'),quando:artLerSimples('quando'),
    profissionais:artLer('profissionais'),em_casa:artLer('em_casa'),faq:artLer('faq'),
    objetivos:[...document.querySelectorAll('#art-objetivos input:checked')].map(c=>c.value)
  };
}

async function salvarArtigo(){
  const p=artPayload();
  if(!p.h1||!p.slug){artMsg('Título e endereço são obrigatórios.','#DC2626');return;}
  if(!/^[a-z0-9-]+$/.test(p.slug)){artMsg('O endereço só aceita letras minúsculas, números e hífen.','#DC2626');return;}
  const id=document.getElementById('art-id').value;
  let r;
  if(id) r=await sb.from('artigos').update(p).eq('id',id).select().single();
  else    r=await sb.from('artigos').insert([{...p,status:'rascunho'}]).select().single();
  if(r.error){artMsg('Erro ao salvar: '+r.error.message,'#DC2626');return;}
  document.getElementById('art-id').value=r.data.id;
  artAtual=r.data;
  document.getElementById('art-btn-pub').style.display='';
  artMsg('Rascunho salvo.');
  loadAdminArtigos();
}

async function chamarPublicar(corpo){
  const{data:{session}}=await sb.auth.getSession();
  if(!session){throw new Error('Sua sessão expirou. Entre de novo.');}
  const r=await fetch('/api/publicar-artigo',{
    method:'POST',
    headers:{'Content-Type':'application/json','Authorization':'Bearer '+session.access_token},
    body:JSON.stringify(corpo)
  });
  const j=await r.json();
  if(!r.ok)throw new Error(j.erro||'Falhou');
  return j;
}

async function previewArtigo(){
  await salvarArtigo();
  const id=document.getElementById('art-id').value;
  if(!id)return;
  artMsg('Gerando preview…','var(--ink-lt)');
  try{
    const{html}=await chamarPublicar({id,preview:true});
    const w=window.open('','_blank');
    w.document.write(html);w.document.close();
    artMsg('Preview aberto em outra aba.');
  }catch(e){artMsg('Erro no preview: '+e.message,'#DC2626');}
}

async function publicarArtigo(){
  const id=document.getElementById('art-id').value;
  if(!id){artMsg('Salve o rascunho primeiro.','#DC2626');return;}
  const p=artPayload();
  if(!p.descricao){artMsg('A descrição é obrigatória para publicar.','#DC2626');return;}
  if(!confirm('Publicar no site?\n\nO arquivo vai para o repositório e o site republica em cerca de um minuto.'))return;
  await salvarArtigo();
  artMsg('Publicando…','var(--ink-lt)');
  try{
    const j=await chamarPublicar({id});
    artMsg('Publicado. '+j.aviso);
    loadAdminArtigos();
  }catch(e){artMsg('Erro ao publicar: '+e.message,'#DC2626');}
}

async function loadAdminMateriais(){
  const{data}=await sb.from('materials').select('*').order('created_at',{ascending:false});
  const tbody=document.getElementById('adm-mat-tbody');
  if(!data||!data.length){tbody.innerHTML='<tr><td colspan="8" style="text-align:center;color:var(--ink-lt);padding:24px;font-weight:300">Nenhum material cadastrado.</td></tr>';return;}
  tbody.innerHTML=data.map(m=>`<tr style="opacity:${m.active===false?'0.45':'1'};transition:opacity .3s">
    <td style="font-size:18px">${m.emoji||'📄'}</td>
    <td style="font-weight:500;color:${m.active===false?'var(--ink-lt)':'var(--ink)'}">${m.title}</td>
    <td style="font-size:12px">${m.category}</td>
    <td><span class="${m.is_free?'badge-free':'badge-paid'}">${m.is_free?'Gratuito':'Pago'}</span></td>
    <td style="font-size:13px">${m.is_free?'—':'R$ '+m.price}</td>
    <td>
      <label class="toggle-wrap" onclick="event.stopPropagation()" title="${m.active===false?'Ativar':'Desativar'} material">
        <div class="toggle">
          <input type="checkbox" ${m.active!==false?'checked':''} onchange="toggleMaterial('${m.id}',this.checked)">
          <div class="toggle-slider"></div>
        </div>
        <span class="toggle-label" id="tgl-lbl-${m.id}">${m.active!==false?'Ativo':'Inativo'}</span>
      </label>
    </td>
    <td style="display:flex;gap:6px;align-items:center">
      <button class="btn-wpp-sm" style="background:var(--blue-lt);color:var(--blue-dk)" onclick="editMaterial(${JSON.stringify(m).replace(/"/g,'&quot;')})">Editar</button>
      <button class="btn-del" onclick="deleteMaterial('${m.id}')">Remover</button>
    </td>
  </tr>`).join('');
}

async function toggleMaterial(id, active){
  // Atualiza visualmente na hora
  const row=document.querySelector(`#tgl-lbl-${id}`)?.closest('tr');
  if(row) row.style.opacity=active?'1':'0.45';
  const lbl=document.getElementById('tgl-lbl-'+id);
  if(lbl) lbl.textContent=active?'Ativo':'Inativo';
  // Salva no Supabase
  await sb.from('materials').update({active}).eq('id',id);
  // Atualiza o site sem recarregar toda a tabela
  await loadMaterials(true);renderProducts();
}

function editMaterial(m){
  editingMaterialId=m.id;
  document.getElementById('adm-title').value=m.title||'';
  document.getElementById('adm-desc').value=m.description||'';
  document.getElementById('adm-cat').value=m.category||'Redução de telas';
  document.getElementById('adm-age').value=m.age_range||'';
  document.getElementById('adm-emoji').value=m.emoji||'';
  document.getElementById('adm-price').value=m.price||0;
  document.getElementById('adm-orig-price').value=m.original_price||'';
  document.getElementById('adm-tags').value=(m.tags||[]).join(', ');
  document.getElementById('adm-url').value=m.file_url||'';
  // Fotos — usa m.images como fonte (já inclui a capa) e remove duplicatas
  const raw=(m.images&&m.images.length)?m.images:(m.cover_image?[m.cover_image]:[]);
  const photos=[...new Set(raw.filter(Boolean))];
  [1,2,3].forEach(n=>{
    const url=photos[n-1]||'';
    document.getElementById('adm-photo'+n).value=url;
    const preview=document.getElementById('preview-photo'+n);
    const lbl=document.getElementById('label-photo'+n);
    if(url&&preview){
      const img=preview.querySelector('img');
      if(img) img.src=url;
      preview.style.display='block';
      if(lbl) lbl.style.display='none';
    } else if(preview){
      preview.style.display='none';
      if(lbl){lbl.style.display='flex';}
    }
  });
  // PDF — mostra nome se tiver URL
  if(m.file_url&&m.file_url!=='#'){
    const label=document.getElementById('upload-pdf-label');
    const zone=document.getElementById('upload-pdf-zone');
    if(label) label.innerHTML=`<div style="font-size:20px">✅</div><p style="font-size:12px;color:var(--sage);font-weight:500">Arquivo cadastrado</p><p style="font-size:10px;color:var(--ink-lt)">Arraste novo PDF para substituir</p>`;
    if(zone){zone.style.borderColor='var(--sage)';zone.style.background='var(--sage-lt)';}
  }
  // Botão e título
  const btn=document.querySelector('button[onclick="saveMaterial()"]');
  if(btn) btn.textContent='Atualizar material';
  const h3=document.querySelector('#adm-materiais .admin-form h3');
  if(h3) h3.textContent='Editando: '+m.title;
  document.getElementById('btn-cancel-mat').style.display='inline-flex';
  document.querySelector('#adm-materiais .admin-form').scrollIntoView({behavior:'smooth'});
}

function cancelEditMaterial(){
  editingMaterialId=null;
  const btn=document.querySelector('button[onclick="saveMaterial()"]');
  if(btn) btn.textContent='Salvar material';
  const h3=document.querySelector('#adm-materiais .admin-form h3');
  if(h3) h3.textContent='Novo material digital';
  const bc=document.getElementById('btn-cancel-mat'); if(bc) bc.style.display='none';
  resetMaterialForm();
}
function resetMaterialForm(){
  ['adm-title','adm-desc','adm-age','adm-emoji','adm-tags','adm-url','adm-photo1','adm-photo2','adm-photo3'].forEach(id=>{const el=document.getElementById(id);if(el)el.value='';});
  const price=document.getElementById('adm-price'); if(price)price.value='0';
  const orig=document.getElementById('adm-orig-price'); if(orig)orig.value='';
  const cat=document.getElementById('adm-cat'); if(cat)cat.selectedIndex=0;
  ['1','2','3'].forEach(n=>{
    const pv=document.getElementById('preview-photo'+n); if(pv)pv.style.display='none';
    const lb=document.getElementById('label-photo'+n); if(lb)lb.style.display='flex';
  });
  const pdfLabel=document.getElementById('upload-pdf-label');
  if(pdfLabel)pdfLabel.innerHTML='<div style="font-size:28px;margin-bottom:8px">📄</div><p style="font-size:13px;font-weight:500;color:var(--ink-md)">Arraste o PDF aqui ou clique para selecionar</p><p style="font-size:11px;color:var(--ink-lt);margin-top:4px">Somente arquivos PDF</p>';
  const pdfZone=document.getElementById('upload-pdf-zone');
  if(pdfZone){pdfZone.style.borderColor='var(--border)';pdfZone.style.background='';}
}

async function saveMaterial(){
  const msg=document.getElementById('adm-mat-msg');
  const price=parseFloat(document.getElementById('adm-price').value)||0;
  const orig=parseFloat(document.getElementById('adm-orig-price').value)||null;
  const tags=document.getElementById('adm-tags').value.split(',').map(t=>t.trim()).filter(Boolean);
  const photo1=document.getElementById('adm-photo1').value.trim();
  const photo2=document.getElementById('adm-photo2').value.trim();
  const photo3=document.getElementById('adm-photo3').value.trim();
  const photos=[photo1,photo2,photo3].filter(Boolean);
  const payload={
    title:document.getElementById('adm-title').value.trim(),
    description:document.getElementById('adm-desc').value.trim(),
    category:document.getElementById('adm-cat').value,
    age_range:document.getElementById('adm-age').value.trim(),
    emoji:document.getElementById('adm-emoji').value||'📄',
    tags,price,original_price:orig,is_free:price===0,
    file_url:document.getElementById('adm-url').value.trim(),
    cover_image:photo1||null,
    images:photos.length?photos:null,
    active:true
  };
  const wasEditing=!!editingMaterialId;
  let error;
  if(editingMaterialId){
    // ATUALIZAR
    ({error}=await sb.from('materials').update(payload).eq('id',editingMaterialId));
    if(!error) cancelEditMaterial();
  } else {
    // INSERIR
    ({error}=await sb.from('materials').insert(payload));
  }
  msg.textContent=error?'Erro: '+error.message:(wasEditing?'✓ Material atualizado!':'✓ Material salvo!');
  msg.style.color=error?'var(--terra)':'var(--sage)';
  if(!error){
    if(!wasEditing) resetMaterialForm();
    await loadAdminMateriais();await loadMaterials(true);renderProducts();
  }
  setTimeout(()=>msg.textContent='',4000);
}
async function deleteMaterial(id){
  if(!confirm('Remover este material PERMANENTEMENTE? Esta ação não pode ser desfeita.'))return;
  const{error}=await sb.from('materials').delete().eq('id',id);
  if(error){alert('Não foi possível remover: '+error.message+'\n\nSe este material já foi vendido, ele fica no histórico de compras e não pode ser apagado — nesse caso, deixe-o "Inativo" no botão de status.');return;}
  await loadAdminMateriais();await loadMaterials();renderProducts();
}

/* KITS ADMIN */
async function loadAdminKits(){
  const{data}=await sb.from('kits').select('*').order('created_at',{ascending:false});
  const tbody=document.getElementById('adm-kit-tbody');
  if(!data||!data.length){tbody.innerHTML='<tr><td colspan="6" style="text-align:center;color:var(--ink-lt);padding:24px;font-weight:300">Nenhum kit cadastrado ainda.</td></tr>';return;}
  tbody.innerHTML=data.map(k=>`<tr>
    <td style="font-size:18px">${k.emoji||'🎒'}</td>
    <td style="font-weight:500">${k.name}</td>
    <td>${k.macro_area}</td>
    <td>${k.age_range}</td>
    <td>—</td>
    <td><button class="btn-del" onclick="deleteKit('${k.id}')">Remover</button></td>
  </tr>`).join('');
}
async function saveKit(){
  const msg=document.getElementById('adm-kit-msg');
  const name=document.getElementById('adm-kit-name').value.trim();
  if(!name){msg.textContent='Nome obrigatório.';msg.style.color='var(--terra)';return;}
  const slug=name.toLowerCase().replace(/\s+/g,'-').normalize('NFD').replace(/[\u0300-\u036f]/g,'');

  // Pega os brinquedos selecionados (snapshot)
  const brinquedosNomes=kitToysSelected.map(t=>t.nome+(t.quantidade>1?` (×${t.quantidade})`:''));

  const{data:novoKit,error}=await sb.from('kits').insert({
    name,slug,
    description:document.getElementById('adm-kit-desc').value.trim(),
    macro_area:document.getElementById('adm-kit-area').value,
    age_range:document.getElementById('adm-kit-age').value.trim(),
    emoji:document.getElementById('adm-kit-emoji').value||'🎒',
    toys:brinquedosNomes,
    pain_phrases:document.getElementById('adm-kit-pain').value.split('\n').map(t=>t.trim()).filter(Boolean),
    active:true
  }).select().single();

  if(error){
    msg.textContent='Erro: '+error.message;
    msg.style.color='var(--terra)';
    return;
  }

  // Vincula brinquedos do estoque ao kit (tabela kit_brinquedos)
  if(novoKit&&kitToysSelected.length){
    const links=kitToysSelected.map(t=>({
      kit_id:novoKit.id,
      brinquedo_id:t.id,
      quantidade:t.quantidade||1
    }));
    const{error:errLink}=await sb.from('kit_brinquedos').insert(links);
    if(errLink)console.warn('[kit] erro vinculando brinquedos:',errLink.message);
  }

  msg.textContent='✓ Kit salvo com '+kitToysSelected.length+' brinquedo(s)!';
  msg.style.color='var(--sage)';
  // Reset
  document.getElementById('adm-kit-name').value='';
  document.getElementById('adm-kit-desc').value='';
  document.getElementById('adm-kit-age').value='';
  document.getElementById('adm-kit-emoji').value='';
  document.getElementById('adm-kit-pain').value='';
  kitToysSelected=[];
  renderKitToysSelected();
  await loadAdminKits();
  setTimeout(()=>msg.textContent='',4000);
}
async function deleteKit(id){if(!confirm('Remover este kit?'))return;await sb.from('kits').update({active:false}).eq('id',id);await loadAdminKits();}

/* ════════ SELETOR DE BRINQUEDOS NO FORM DO KIT ════════ */
let kitToysSelected=[]; // {id, nome, foto_url, preco_venda, estoque_atual, quantidade}

async function ensureBrinquedosLoaded(){
  if(!allBrinquedosData||!allBrinquedosData.length){
    const{data}=await sb.from('brinquedos').select('*').eq('ativo',true).order('nome');
    allBrinquedosData=data||[];
  }
  return allBrinquedosData;
}

async function showKitToyOptions(){
  await ensureBrinquedosLoaded();
  filterKitToyOptions();
  document.getElementById('kit-toy-options').style.display='block';
}

function filterKitToyOptions(){
  const box=document.getElementById('kit-toy-options');
  if(!box)return;
  const q=document.getElementById('kit-toy-search').value.toLowerCase().trim();
  const jaSelecionadosIds=new Set(kitToysSelected.map(t=>t.id));
  const disponiveis=(allBrinquedosData||[])
    .filter(b=>!jaSelecionadosIds.has(b.id))
    .filter(b=>{
      if(!q)return true;
      return (b.nome||'').toLowerCase().includes(q)||
             (b.tags||[]).some(t=>t.toLowerCase().includes(q))||
             (b.faixa_etaria||'').toLowerCase().includes(q);
    });
  if(!disponiveis.length){
    box.innerHTML='<p style="text-align:center;padding:18px;font-size:12px;color:var(--ink-lt);font-weight:300">Nenhum brinquedo encontrado. <a onclick="adminTab(\'estoque\',document.getElementById(\'tab-estoque\'))" style="color:var(--blue);cursor:pointer;font-weight:500">Cadastrar novo →</a></p>';
    box.style.display='block';
    return;
  }
  box.innerHTML=disponiveis.map(b=>{
    const estoque=parseInt(b.estoque_atual||0);
    const min=parseInt(b.estoque_minimo||0);
    const fotoHTML=b.foto_url?`<img src="${b.foto_url}" style="width:40px;height:40px;border-radius:6px;object-fit:cover;flex-shrink:0">`:'<div style="width:40px;height:40px;border-radius:6px;background:var(--parchment);display:flex;align-items:center;justify-content:center;font-size:18px;flex-shrink:0">🧸</div>';
    let badge='';
    if(estoque===0)badge='<span style="font-size:10px;padding:2px 6px;background:#FEE2E2;color:#991B1B;border-radius:4px;font-weight:600">🚫 ZERADO</span>';
    else if(estoque<=min)badge='<span style="font-size:10px;padding:2px 6px;background:#FEF3C7;color:#92400E;border-radius:4px;font-weight:600">⚠️ '+estoque+' un</span>';
    else badge='<span style="font-size:10px;padding:2px 6px;background:#D1FAE5;color:#065F46;border-radius:4px;font-weight:600">✓ '+estoque+' un</span>';
    return `<div onclick='addToyToKit("${b.id}")' style="display:flex;align-items:center;gap:10px;padding:10px 12px;cursor:pointer;border-bottom:1px solid var(--border);transition:background .15s" onmouseover="this.style.background='var(--parchment)'" onmouseout="this.style.background='transparent'">
      ${fotoHTML}
      <div style="flex:1;min-width:0">
        <div style="font-weight:500;font-size:13px;color:var(--ink);white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${b.nome}</div>
        <div style="font-size:11px;color:var(--ink-lt);margin-top:2px">${b.faixa_etaria||'—'} · R$ ${parseFloat(b.preco_venda||0).toFixed(2).replace('.',',')}</div>
      </div>
      ${badge}
    </div>`;
  }).join('');
  box.style.display='block';
}

function addToyToKit(id){
  const b=(allBrinquedosData||[]).find(x=>x.id===id);
  if(!b)return;
  if(kitToysSelected.find(t=>t.id===id))return;
  kitToysSelected.push({
    id:b.id,nome:b.nome,foto_url:b.foto_url,
    preco_venda:parseFloat(b.preco_venda||0),
    estoque_atual:parseInt(b.estoque_atual||0),
    estoque_minimo:parseInt(b.estoque_minimo||0),
    quantidade:1
  });
  document.getElementById('kit-toy-search').value='';
  document.getElementById('kit-toy-options').style.display='none';
  renderKitToysSelected();
}

function removeToyFromKit(id){
  kitToysSelected=kitToysSelected.filter(t=>t.id!==id);
  renderKitToysSelected();
}

function changeToyQuantity(id,delta){
  const t=kitToysSelected.find(x=>x.id===id);
  if(!t)return;
  t.quantidade=Math.max(1,(t.quantidade||1)+delta);
  renderKitToysSelected();
}

function renderKitToysSelected(){
  const box=document.getElementById('kit-toys-selected');
  const empty=document.getElementById('kit-toys-empty');
  const totalEl=document.getElementById('kit-toys-total');
  if(!box)return;
  if(!kitToysSelected.length){
    box.innerHTML='<p style="font-size:12px;color:var(--ink-lt);text-align:center;font-weight:300;margin:8px 0" id="kit-toys-empty">Nenhum brinquedo adicionado ainda</p>';
    if(totalEl)totalEl.textContent='R$ 0,00';
    document.getElementById('adm-kit-brinquedo-ids').value='';
    document.getElementById('adm-kit-toys').value='';
    return;
  }
  let total=0;
  box.innerHTML=kitToysSelected.map(t=>{
    const subtotal=(t.preco_venda||0)*(t.quantidade||1);
    total+=subtotal;
    const estoqueOk=t.estoque_atual>=t.quantidade;
    const fotoHTML=t.foto_url?`<img src="${t.foto_url}" style="width:36px;height:36px;border-radius:6px;object-fit:cover;flex-shrink:0">`:'<div style="width:36px;height:36px;border-radius:6px;background:#fff;display:flex;align-items:center;justify-content:center;font-size:16px;flex-shrink:0">🧸</div>';
    const alertaEstoque=!estoqueOk?'<span style="font-size:10px;padding:2px 6px;background:#FEE2E2;color:#991B1B;border-radius:4px;font-weight:600">⚠️ '+t.estoque_atual+' em estoque</span>':'';
    return `<div style="display:flex;align-items:center;gap:10px;padding:8px;background:#fff;border-radius:6px">
      ${fotoHTML}
      <div style="flex:1;min-width:0">
        <div style="font-weight:500;font-size:13px;color:var(--ink);white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${t.nome}</div>
        <div style="font-size:11px;color:var(--ink-lt);margin-top:1px">R$ ${(t.preco_venda||0).toFixed(2).replace('.',',')} ${alertaEstoque}</div>
      </div>
      <div style="display:flex;align-items:center;gap:4px">
        <button type="button" onclick="changeToyQuantity('${t.id}',-1)" style="width:24px;height:24px;border-radius:4px;border:1px solid var(--border);background:#fff;font-size:14px;cursor:pointer;font-weight:600">−</button>
        <span style="min-width:24px;text-align:center;font-weight:600;font-size:13px">${t.quantidade}</span>
        <button type="button" onclick="changeToyQuantity('${t.id}',1)" style="width:24px;height:24px;border-radius:4px;border:1px solid var(--border);background:#fff;font-size:14px;cursor:pointer;font-weight:600">+</button>
      </div>
      <div style="font-family:'Playfair Display',serif;font-weight:700;font-size:13px;color:var(--ink);min-width:70px;text-align:right">R$ ${subtotal.toFixed(2).replace('.',',')}</div>
      <button type="button" onclick="removeToyFromKit('${t.id}')" style="background:none;border:none;color:#991B1B;font-size:18px;cursor:pointer;padding:0 4px" title="Remover">×</button>
    </div>`;
  }).join('');
  if(totalEl)totalEl.textContent='R$ '+total.toFixed(2).replace('.',',');
  // Hidden fields pra compatibilidade com saveKit antigo
  document.getElementById('adm-kit-brinquedo-ids').value=JSON.stringify(kitToysSelected.map(t=>({id:t.id,qty:t.quantidade})));
  document.getElementById('adm-kit-toys').value=kitToysSelected.map(t=>t.nome+(t.quantidade>1?` (×${t.quantidade})`:'')).join('\n');
}

// Fecha o dropdown ao clicar fora
document.addEventListener('click',function(e){
  const box=document.getElementById('kit-toy-options');
  const search=document.getElementById('kit-toy-search');
  if(box&&search&&!box.contains(e.target)&&e.target!==search){
    box.style.display='none';
  }
});

/* LEADS */
let allLeadsData=[];
async function loadAdminLeads(){
  // Quem fez quiz/contato (não-sessão, não-pedido-pago)
  const{data}=await sb.from('leads').select('*').order('created_at',{ascending:false});
  // Filtra: tira sessões (aparecem em outra aba)
  allLeadsData=(data||[]).filter(l=>
    l.recommended_kit!=='sessao' &&
    l.contact_preference!=='sessao_presencial'
  );
  // Stats
  const total=allLeadsData.length;
  const novos=allLeadsData.filter(l=>!l.status||l.status==='new').length;
  const conv=allLeadsData.filter(l=>l.status==='converted').length;
  const elT=document.getElementById('lq-total'); if(elT)elT.textContent=total;
  const elN=document.getElementById('lq-novos'); if(elN)elN.textContent=novos;
  const elC=document.getElementById('lq-convertidos'); if(elC)elC.textContent=conv;
  renderLeadsTable(allLeadsData);
}
function renderLeadsTable(list){
  const tbody=document.getElementById('adm-leads-tbody');
  if(!list.length){tbody.innerHTML='<tr><td colspan="8" style="text-align:center;color:var(--ink-lt);padding:32px;font-weight:300">Nenhum lead ainda.</td></tr>';return;}
  tbody.innerHTML=list.map(l=>{
    const dia=new Date(l.created_at);
    const dataStr=dia.toLocaleDateString('pt-BR')+' '+dia.toLocaleTimeString('pt-BR',{hour:'2-digit',minute:'2-digit'});
    const faixa=l.child_age&&typeof l.child_age==='string'&&!l.child_age.startsWith('{')?l.child_age:'—';
    const sintomas=(l.symptoms||[]).slice(0,2).join(', ')||'—';
    const wppFmt=l.whatsapp?`<br><a class="btn-wpp-sm" href="https://wa.me/55${l.whatsapp.replace(/\D/g,'')}" target="_blank" style="font-size:11px">💬 ${l.whatsapp}</a>`:'';
    const tipoLabel=l.contact_preference==='kit'?'🎒 Kit':l.contact_preference==='material'?'📄 Material':l.contact_preference==='duvida_geral'?'💬 Contato':'—';
    return `<tr>
    <td style="font-weight:500">${l.name||'—'}</td>
    <td style="font-size:12px"><a href="mailto:${l.email}" style="color:var(--blue)">${l.email||'—'}</a>${wppFmt}</td>
    <td style="font-size:12px">${faixa}</td>
    <td style="font-size:12px"><strong>${l.recommended_kit||'—'}</strong><div style="font-size:10px;color:var(--ink-lt);margin-top:2px">${tipoLabel}</div></td>
    <td style="font-size:11px;color:var(--ink-md);max-width:180px">${sintomas}</td>
    <td style="font-size:11px;color:var(--ink-lt)">${dataStr}</td>
    <td><select class="status-sel" onchange="updateLeadStatus('${l.id}',this.value)">
      <option value="new" ${(!l.status||l.status==='new')?'selected':''}>Novo</option>
      <option value="contacted" ${l.status==='contacted'?'selected':''}>Contatado</option>
      <option value="converted" ${l.status==='converted'?'selected':''}>Convertido</option>
    </select></td>
    <td style="white-space:nowrap">
      ${l.whatsapp?`<a href="https://wa.me/55${l.whatsapp.replace(/\D/g,'')}" target="_blank" style="background:#25D366;color:#fff;padding:5px 9px;border-radius:5px;font-size:11px;text-decoration:none;margin-right:4px">💬</a>`:''}
      <button class="btn-del" onclick="deleteLead('${l.id}')">×</button>
    </td>
  </tr>`;}).join('');
}
function filterLeads(s,el){document.querySelectorAll('#adm-leads .adm-filter-btn').forEach(b=>b.classList.remove('active'));el.classList.add('active');renderLeadsTable(s==='all'?allLeadsData:allLeadsData.filter(l=>(l.status||'new')===s));}
async function updateLeadStatus(id,status){await sb.from('leads').update({status}).eq('id',id);await loadDashboard();}
async function deleteLead(id){if(!confirm('Remover?'))return;await sb.from('leads').delete().eq('id',id);await loadAdminLeads();await loadDashboard();}

/* SESSÕES */
let allSessoesData=[];
let allConfirmadasData=[];

async function loadAdminSessoes(){
  // Solicitações (leads de sessão)
  const{data:leads}=await sb.from('leads').select('*').or('contact_preference.eq.sessao_presencial,recommended_kit.eq.sessao').order('created_at',{ascending:false});
  allSessoesData=leads||[];

  // Confirmadas (sessoes_agendadas)
  const{data:confirm}=await sb.from('sessoes_agendadas').select('*').order('created_at',{ascending:false});
  allConfirmadasData=confirm||[];

  // Stats
  const aguardando=allSessoesData.filter(l=>!l.status||l.status==='new').length;
  const linkEnv=allSessoesData.filter(l=>l.status==='contacted').length;
  const pagas=allConfirmadasData.filter(s=>s.status==='sinal_pago').length;
  const realizadas=allConfirmadasData.filter(s=>s.status==='realizada').length;
  const set=(id,v)=>{const e=document.getElementById(id);if(e)e.textContent=v;};
  set('se-aguardando',aguardando);
  set('se-link-enviado',linkEnv);
  set('se-pagas',pagas);
  set('se-realizadas',realizadas);

  // Sub-aba labels
  const agBtn=document.querySelector('#adm-sessoes .sub-tab-btn:nth-child(1)');
  const coBtn=document.querySelector('#adm-sessoes .sub-tab-btn:nth-child(2)');
  if(agBtn)agBtn.innerHTML=`📥 Solicitações (${allSessoesData.length})`;
  if(coBtn)coBtn.innerHTML=`✅ Confirmadas (${allConfirmadasData.length})`;

  renderSessoesTable(allSessoesData);
  renderConfirmadasTable(allConfirmadasData);
}

function renderSessoesTable(list){
  const tbody=document.getElementById('adm-sessoes-tbody');
  if(!list.length){tbody.innerHTML='<tr><td colspan="8" style="text-align:center;color:var(--ink-lt);padding:32px;font-weight:300">Nenhuma solicitação de sessão ainda.</td></tr>';return;}
  tbody.innerHTML=list.map(l=>{
    let det={};try{det=typeof l.child_age==='string'&&l.child_age.startsWith('{')?JSON.parse(l.child_age):{};}catch(e){}
    const local=det.cidade||det.bairro?`${det.cidade||'—'}${det.bairro?' / '+det.bairro:''}`:'—';
    const idade=det.idade||(typeof l.child_age==='string'&&!l.child_age.startsWith('{')?l.child_age:'—');
    const preocup=det.preocupacao||(l.symptoms||[]).slice(0,2).join(', ')||'—';
    const dia=new Date(l.created_at);
    const dataStr=dia.toLocaleDateString('pt-BR')+' '+dia.toLocaleTimeString('pt-BR',{hour:'2-digit',minute:'2-digit'});
    return `<tr>
    <td style="font-weight:500">${l.name||'—'}</td>
    <td style="font-size:12px"><a href="mailto:${l.email}" style="color:var(--blue)">${l.email||'—'}</a>${l.whatsapp?`<br><a class="btn-wpp-sm" href="https://wa.me/55${l.whatsapp.replace(/\D/g,'')}" target="_blank" style="font-size:11px">💬 ${l.whatsapp}</a>`:''}</td>
    <td style="font-size:12px">${local}</td>
    <td style="font-size:12px">${idade}</td>
    <td style="font-size:11px;color:var(--ink-md);max-width:180px">${preocup}</td>
    <td style="font-size:11px;color:var(--ink-lt)">${dataStr}</td>
    <td><select class="status-sel" onchange="updateSessaoStatus('${l.id}',this.value)">
      <option value="new" ${(!l.status||l.status==='new')?'selected':''}>Pendente</option>
      <option value="contacted" ${l.status==='contacted'?'selected':''}>Link enviado</option>
      <option value="converted" ${l.status==='converted'?'selected':''}>Convertida</option>
    </select></td>
    <td style="white-space:nowrap">
      <button onclick='openGerarLinkSessao(${JSON.stringify(l).replace(/'/g,"&apos;")})' style="background:var(--blue);color:#fff;border:none;padding:6px 10px;border-radius:6px;font-size:11px;cursor:pointer;margin-right:4px;font-family:'DM Sans',sans-serif;font-weight:500" title="Gerar link de pagamento">🔗</button>
      ${l.whatsapp?`<a href="https://wa.me/55${l.whatsapp.replace(/\D/g,'')}" target="_blank" style="background:#25D366;color:#fff;padding:6px 10px;border-radius:6px;font-size:11px;text-decoration:none;margin-right:4px">💬</a>`:''}
      <button class="btn-del" onclick="deleteSessao('${l.id}')">×</button>
    </td>
  </tr>`;}).join('');
}

function renderConfirmadasTable(list){
  const tbody=document.getElementById('adm-confirmadas-tbody');
  if(!tbody)return;
  if(!list.length){tbody.innerHTML='<tr><td colspan="8" style="text-align:center;color:var(--ink-lt);padding:32px;font-weight:300">Nenhuma sessão confirmada ainda.</td></tr>';return;}
  tbody.innerHTML=list.map(s=>{
    const data=s.data_sessao?`${s.data_sessao}${s.hora_sessao?' '+s.hora_sessao:''}`:'A combinar';
    const local=`${s.endereco_cidade||'—'}/${s.endereco_uf||'—'}${s.endereco_bairro?', '+s.endereco_bairro:''}`;
    const statusLabel={'aguardando_pagamento':'⏳ Aguardando pagamento','sinal_pago':'💰 Sinal pago','realizada':'✅ Realizada','cancelada':'❌ Cancelada'}[s.status]||s.status;
    const statusColor={'aguardando_pagamento':'#92400E','sinal_pago':'#16A34A','realizada':'#1A3FBF','cancelada':'#B45309'}[s.status]||'#666';
    const pagoEm=s.pago_em?new Date(s.pago_em).toLocaleDateString('pt-BR'):'—';
    const linkPagar=`https://neuroplasticidar.gruposja.com/pagar-sessao.html?id=${s.id}`;
    return `<tr>
    <td style="font-weight:500">${s.cliente_nome||'—'}<div style="font-size:11px;color:var(--ink-lt)">${s.cliente_email||''}</div></td>
    <td style="font-size:12px"><strong>${data}</strong></td>
    <td style="font-size:11px">${local}<div style="font-size:10px;color:var(--ink-lt);margin-top:2px">👶 ${s.crianca_idade||'—'}</div></td>
    <td style="font-family:'Playfair Display',serif;font-weight:700">R$ ${Number(s.valor_total).toFixed(2)}</td>
    <td style="font-size:12px"><strong>R$ ${Number(s.valor_sinal).toFixed(2)}</strong><div style="font-size:10px;color:var(--ink-lt)">Restante: R$ ${Number(s.valor_restante).toFixed(2)}</div></td>
    <td><span style="font-size:11px;font-weight:500;color:${statusColor}">${statusLabel}</span></td>
    <td style="font-size:11px;color:var(--ink-lt)">${pagoEm}</td>
    <td style="white-space:nowrap">
      ${s.status==='aguardando_pagamento'?`<button onclick="copiarLinkConfirmada('${linkPagar}')" style="background:var(--blue);color:#fff;border:none;padding:5px 9px;border-radius:5px;font-size:11px;cursor:pointer;margin-right:4px" title="Copiar link de pagamento">🔗</button>`:''}
      ${s.cliente_whatsapp?`<a href="https://wa.me/55${s.cliente_whatsapp.replace(/\D/g,'')}" target="_blank" style="background:#25D366;color:#fff;padding:5px 9px;border-radius:5px;font-size:11px;text-decoration:none;margin-right:4px">💬</a>`:''}
      ${s.status==='sinal_pago'?`<button onclick="marcarRealizada('${s.id}')" style="background:var(--sage);color:#fff;border:none;padding:5px 9px;border-radius:5px;font-size:11px;cursor:pointer" title="Marcar como realizada">✅</button>`:''}
    </td>
  </tr>`;}).join('');
}

function subTabSessoes(tab,el){
  document.querySelectorAll('#adm-sessoes .sub-tab-btn').forEach(b=>{
    b.style.borderBottomColor='transparent';b.style.color='var(--ink-lt)';
  });
  el.style.borderBottomColor='var(--blue)';
  el.style.color='var(--blue)';
  document.getElementById('sub-aguardando').style.display=tab==='aguardando'?'block':'none';
  document.getElementById('sub-confirmadas').style.display=tab==='confirmadas'?'block':'none';
}

function copiarLinkConfirmada(link){
  navigator.clipboard.writeText(link);
  alert('Link copiado! Cole no WhatsApp do cliente.');
}

async function marcarRealizada(id){
  if(!confirm('Marcar essa sessão como realizada?'))return;
  await sb.from('sessoes_agendadas').update({status:'realizada'}).eq('id',id);
  await loadAdminSessoes();
}
function filterSessoes(s,el){
  document.querySelectorAll('#adm-sessoes .adm-filter-btn').forEach(b=>b.classList.remove('active'));el.classList.add('active');
  const m={pending:'new',scheduled:'contacted',done:'converted'};
  renderSessoesTable(s==='all'?allSessoesData:allSessoesData.filter(l=>(l.status||'new')===(m[s]||s)));
}
/* === GERAR LINK DE SESSÃO (admin) === */
let glLinkAtual=null;
let glClienteAtual=null;

/* ════════ MONTAR KIT POR PEDIDO (admin) ════════ */
let mkBrinquedos=[]; // brinquedos selecionados pro kit
let mkLeadAtual=null;
let mkLinkAtual=null;

// Tabela de frete por bairro (Manaus, saindo do Novo Aleixo)
const FRETE_MANAUS={
  proximo:{label:'Próximo (até 5km)',valor:20,bairros:['cidade nova','aleixo','distrito industrial','coroado','novo aleixo','colonia santo antonio','jorge teixeira']},
  medio:{label:'Médio (5-12km)',valor:30,bairros:['centro','sao geraldo','adrianopolis','parque 10','flores','dom pedro','planalto','sao jorge']},
  longe:{label:'Longe (12-20km)',valor:40,bairros:['compensa','santo antonio','taruma','ponta negra','cachoeirinha','educandos','sao raimundo','presidente vargas']},
  muito_longe:{label:'Muito longe (>20km)',valor:50,bairros:[]}
};

function calcularFreteAuto(){
  const uf=document.getElementById('mk-uf').value.trim().toUpperCase();
  const cidade=document.getElementById('mk-cidade').value.trim().toLowerCase();
  const bairro=document.getElementById('mk-bairro').value.trim().toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'');
  const info=document.getElementById('mk-frete-info');
  const fInput=document.getElementById('mk-valor-frete');

  if(uf==='AM'&&cidade.includes('manaus')&&bairro){
    let zona='muito_longe';
    if(FRETE_MANAUS.proximo.bairros.some(b=>bairro.includes(b)))zona='proximo';
    else if(FRETE_MANAUS.medio.bairros.some(b=>bairro.includes(b)))zona='medio';
    else if(FRETE_MANAUS.longe.bairros.some(b=>bairro.includes(b)))zona='longe';
    const f=FRETE_MANAUS[zona];
    fInput.value=f.valor.toFixed(2);
    info.innerHTML=`<span style="color:var(--sage)">✓ ${f.label}</span>`;
    atualizarTotalKit();
  } else if(uf!=='AM'){
    info.innerHTML=`<a href="https://www2.correios.com.br/sistemas/precosPrazos/" target="_blank" style="color:var(--blue);font-size:11px">📦 Calcular Correios →</a> e digitar manualmente`;
    fInput.value='';
    atualizarTotalKit();
  } else {
    info.innerHTML='Digite o bairro pra calcular';
  }
}

async function buscarCepKit(){
  const cep=document.getElementById('mk-cep').value.replace(/\D/g,'');
  if(cep.length!==8)return;
  try{
    const r=await fetch(`https://viacep.com.br/ws/${cep}/json/`);
    const d=await r.json();
    if(d.erro)return;
    document.getElementById('mk-rua').value=d.logradouro||'';
    document.getElementById('mk-bairro').value=d.bairro||'';
    document.getElementById('mk-cidade').value=d.localidade||'';
    document.getElementById('mk-uf').value=d.uf||'';
    calcularFreteAuto();
  }catch(e){console.warn('[cep] erro:',e);}
}

function openMontarKit(lead){
  mkLeadAtual=lead;
  mkBrinquedos=[];
  mkLinkAtual=null;
  document.getElementById('mk-result').style.display='none';
  document.getElementById('mk-btn').disabled=false;
  document.getElementById('mk-btn').textContent='📧 Criar link e enviar por e-mail';

  // Pré-preenche com dados do lead
  let det={};try{det=typeof lead.child_age==='string'&&lead.child_age.startsWith('{')?JSON.parse(lead.child_age):{};}catch(e){}
  document.getElementById('mk-nome').value=lead.name||'';
  document.getElementById('mk-email').value=lead.email||'';
  document.getElementById('mk-wpp').value=lead.whatsapp||'';
  document.getElementById('mk-idade').value=det.idade||lead.child_age||'';
  document.getElementById('mk-cep').value='';
  document.getElementById('mk-rua').value='';
  document.getElementById('mk-numero').value='';
  document.getElementById('mk-complemento').value='';
  document.getElementById('mk-bairro').value=det.bairro||'';
  document.getElementById('mk-cidade').value=det.cidade||'Manaus';
  document.getElementById('mk-uf').value=det.uf||'AM';
  document.getElementById('mk-cupom').value='';
  document.getElementById('mk-valor-kit').value='';
  document.getElementById('mk-valor-frete').value='';

  renderMkToysSelected();
  if(det.bairro)calcularFreteAuto();

  openDialog('dlg-montar-kit');
}

async function ensureBrinquedosLoadedMk(){
  if(!allBrinquedosData||!allBrinquedosData.length){
    const{data}=await sb.from('brinquedos').select('*').eq('ativo',true).order('nome');
    allBrinquedosData=data||[];
  }
}

async function showMkToyOptions(){
  await ensureBrinquedosLoadedMk();
  filterMkToyOptions();
  document.getElementById('mk-toy-options').style.display='block';
}

function filterMkToyOptions(){
  const box=document.getElementById('mk-toy-options');
  if(!box)return;
  const q=document.getElementById('mk-toy-search').value.toLowerCase().trim();
  const jaIds=new Set(mkBrinquedos.map(t=>t.id));
  const disp=(allBrinquedosData||[]).filter(b=>!jaIds.has(b.id)).filter(b=>!q||(b.nome||'').toLowerCase().includes(q)||(b.tags||[]).some(t=>t.toLowerCase().includes(q))||(b.faixa_etaria||'').toLowerCase().includes(q));
  if(!disp.length){
    box.innerHTML='<p style="text-align:center;padding:14px;font-size:12px;color:var(--ink-lt)">Nenhum brinquedo encontrado</p>';
    return;
  }
  box.innerHTML=disp.map(b=>{
    const estoque=parseInt(b.estoque_atual||0);
    const min=parseInt(b.estoque_minimo||0);
    const foto=b.foto_url?`<img src="${b.foto_url}" style="width:36px;height:36px;border-radius:6px;object-fit:cover;flex-shrink:0">`:'<div style="width:36px;height:36px;border-radius:6px;background:var(--parchment);display:flex;align-items:center;justify-content:center;font-size:16px;flex-shrink:0">🧸</div>';
    let badge='';
    if(estoque===0)badge='<span style="font-size:10px;padding:2px 6px;background:#FEE2E2;color:#991B1B;border-radius:4px;font-weight:600">🚫</span>';
    else if(estoque<=min)badge='<span style="font-size:10px;padding:2px 6px;background:#FEF3C7;color:#92400E;border-radius:4px;font-weight:600">⚠️ '+estoque+'</span>';
    else badge='<span style="font-size:10px;padding:2px 6px;background:#D1FAE5;color:#065F46;border-radius:4px;font-weight:600">✓ '+estoque+'</span>';
    return `<div onclick='addToyToMk("${b.id}")' style="display:flex;align-items:center;gap:10px;padding:8px 12px;cursor:pointer;border-bottom:1px solid var(--border)" onmouseover="this.style.background='var(--parchment)'" onmouseout="this.style.background='transparent'">
      ${foto}
      <div style="flex:1;min-width:0">
        <div style="font-weight:500;font-size:13px">${b.nome}</div>
        <div style="font-size:11px;color:var(--ink-lt)">${b.faixa_etaria||'—'} · custo R$ ${parseFloat(b.custo||0).toFixed(2).replace('.',',')} · venda R$ ${parseFloat(b.preco_venda||0).toFixed(2).replace('.',',')}</div>
      </div>
      ${badge}
    </div>`;
  }).join('');
}

function addToyToMk(id){
  const b=(allBrinquedosData||[]).find(x=>x.id===id);
  if(!b)return;
  if(mkBrinquedos.find(t=>t.id===id))return;
  mkBrinquedos.push({
    id:b.id,nome:b.nome,foto_url:b.foto_url,
    custo:parseFloat(b.custo||0),
    preco_venda:parseFloat(b.preco_venda||0),
    estoque_atual:parseInt(b.estoque_atual||0),
    quantidade:1
  });
  document.getElementById('mk-toy-search').value='';
  document.getElementById('mk-toy-options').style.display='none';
  renderMkToysSelected();
}

function removeMkToy(id){
  mkBrinquedos=mkBrinquedos.filter(t=>t.id!==id);
  renderMkToysSelected();
}

function changeMkToyQty(id,delta){
  const t=mkBrinquedos.find(x=>x.id===id);
  if(!t)return;
  t.quantidade=Math.max(1,(t.quantidade||1)+delta);
  renderMkToysSelected();
}

function renderMkToysSelected(){
  const box=document.getElementById('mk-toys-selected');
  if(!mkBrinquedos.length){
    box.innerHTML='<p style="font-size:12px;color:var(--ink-lt);text-align:center;font-weight:300;margin:8px 0">Nenhum brinquedo adicionado</p>';
    document.getElementById('mk-custo-total').textContent='R$ 0,00';
    document.getElementById('mk-preco-sugerido').textContent='R$ 0,00';
    if(!document.getElementById('mk-valor-kit').value)atualizarTotalKit();
    return;
  }
  let custoTotal=0,sugerido=0;
  box.innerHTML=mkBrinquedos.map(t=>{
    const subCusto=(t.custo||0)*(t.quantidade||1);
    const subPreco=(t.preco_venda||0)*(t.quantidade||1);
    custoTotal+=subCusto;sugerido+=subPreco;
    const estoqueOk=t.estoque_atual>=t.quantidade;
    const foto=t.foto_url?`<img src="${t.foto_url}" style="width:32px;height:32px;border-radius:6px;object-fit:cover;flex-shrink:0">`:'<div style="width:32px;height:32px;border-radius:6px;background:var(--parchment);display:flex;align-items:center;justify-content:center;font-size:14px;flex-shrink:0">🧸</div>';
    const alertaEst=!estoqueOk?'<span style="font-size:9px;padding:1px 5px;background:#FEE2E2;color:#991B1B;border-radius:3px;font-weight:600;margin-left:4px">⚠️ falta</span>':'';
    return `<div style="display:flex;align-items:center;gap:8px;padding:6px;background:#fff;border-radius:6px;border:1px solid var(--border)">
      ${foto}
      <div style="flex:1;min-width:0">
        <div style="font-weight:500;font-size:12px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${t.nome}${alertaEst}</div>
        <div style="font-size:10px;color:var(--ink-lt)">custo R$ ${(t.custo||0).toFixed(2).replace('.',',')} · venda R$ ${(t.preco_venda||0).toFixed(2).replace('.',',')}</div>
      </div>
      <div style="display:flex;align-items:center;gap:3px">
        <button type="button" onclick="changeMkToyQty('${t.id}',-1)" style="width:22px;height:22px;border-radius:4px;border:1px solid var(--border);background:#fff;font-size:12px;cursor:pointer">−</button>
        <span style="min-width:22px;text-align:center;font-weight:600;font-size:12px">${t.quantidade}</span>
        <button type="button" onclick="changeMkToyQty('${t.id}',1)" style="width:22px;height:22px;border-radius:4px;border:1px solid var(--border);background:#fff;font-size:12px;cursor:pointer">+</button>
      </div>
      <button type="button" onclick="removeMkToy('${t.id}')" style="background:none;border:none;color:#991B1B;font-size:16px;cursor:pointer;padding:0 4px">×</button>
    </div>`;
  }).join('');
  document.getElementById('mk-custo-total').textContent='R$ '+custoTotal.toFixed(2).replace('.',',');
  document.getElementById('mk-preco-sugerido').textContent='R$ '+sugerido.toFixed(2).replace('.',',');
  // Auto-popula valor do kit se vazio
  if(!document.getElementById('mk-valor-kit').value){
    document.getElementById('mk-valor-kit').value=sugerido.toFixed(2);
  }
  atualizarTotalKit();
}

function atualizarTotalKit(){
  const kit=parseFloat(document.getElementById('mk-valor-kit').value)||0;
  const frete=parseFloat(document.getElementById('mk-valor-frete').value)||0;
  document.getElementById('mk-total').textContent='R$ '+(kit+frete).toFixed(2).replace('.',',');
}

async function gerarLinkKit(){
  const nome=document.getElementById('mk-nome').value.trim();
  const email=document.getElementById('mk-email').value.trim();
  if(!nome||!email){alert('Preencha nome e e-mail do cliente.');return;}
  if(!mkBrinquedos.length){alert('Adicione ao menos 1 brinquedo ao kit.');return;}
  const valorKit=parseFloat(document.getElementById('mk-valor-kit').value)||0;
  const valorFrete=parseFloat(document.getElementById('mk-valor-frete').value)||0;
  if(valorKit<=0){alert('Defina o valor do kit.');return;}

  const btn=document.getElementById('mk-btn');
  btn.disabled=true;
  btn.innerHTML='<span style="display:inline-block;width:12px;height:12px;border:2px solid #fff;border-top-color:transparent;border-radius:50%;animation:spin .8s linear infinite;margin-right:6px;vertical-align:middle"></span> Gerando...';

  const payload={
    cliente_nome:nome,
    cliente_email:email,
    cliente_whatsapp:document.getElementById('mk-wpp').value.trim(),
    cep:document.getElementById('mk-cep').value.trim(),
    endereco_rua:document.getElementById('mk-rua').value.trim(),
    endereco_numero:document.getElementById('mk-numero').value.trim(),
    endereco_complemento:document.getElementById('mk-complemento').value.trim(),
    endereco_bairro:document.getElementById('mk-bairro').value.trim(),
    endereco_cidade:document.getElementById('mk-cidade').value.trim()||'Manaus',
    endereco_uf:document.getElementById('mk-uf').value.trim()||'AM',
    crianca_idade:document.getElementById('mk-idade').value.trim(),
    kit_nome:'Kit personalizado',
    brinquedos:mkBrinquedos.map(t=>({id:t.id,nome:t.nome,quantidade:t.quantidade,custo:t.custo,preco_venda:t.preco_venda})),
    valor_kit:valorKit,
    valor_frete:valorFrete,
    cupom_codigo:document.getElementById('mk-cupom').value.trim().toUpperCase(),
    modo:'curadoria',
  };

  try{
    const r=await fetch(`${SUPABASE_URL}/functions/v1/smooth-task`,{
      method:'POST',
      headers:{'Content-Type':'application/json','apikey':SUPABASE_ANON,'Authorization':'Bearer '+SUPABASE_ANON},
      body:JSON.stringify({action:'create_kit_link',payload})
    });
    const data=await r.json();
    if(!data.ok){alert('Erro: '+(data.error||'tente novamente'));btn.disabled=false;btn.textContent='📧 Criar link e enviar por e-mail';return;}
    mkLinkAtual=data.link;
    document.getElementById('mk-link').value=data.link;
    document.getElementById('mk-result').style.display='block';
    btn.textContent='✅ Link enviado!';
    // Atualiza status do lead se vier da aba de pedidos
    if(mkLeadAtual?.id){
      await sb.from('leads').update({status:'contacted'}).eq('id',mkLeadAtual.id);
    }
  }catch(e){alert('Erro: '+e.message);btn.disabled=false;btn.textContent='📧 Criar link e enviar por e-mail';}
}

function copyMkLink(){
  navigator.clipboard.writeText(mkLinkAtual||document.getElementById('mk-link').value);
  alert('Link copiado!');
}

function enviarKitWhatsApp(){
  const wpp=document.getElementById('mk-wpp').value.replace(/\D/g,'');
  if(!wpp){alert('WhatsApp não informado.');return;}
  const nome=document.getElementById('mk-nome').value.trim().split(' ')[0];
  const valorKit=document.getElementById('mk-valor-kit').value;
  const valorFrete=document.getElementById('mk-valor-frete').value;
  const total=(parseFloat(valorKit)+parseFloat(valorFrete||0)).toFixed(2);
  const msg=`Oi ${nome}! 💜

Montamos o kit personalizado pro seu filho. Aqui está o link pra pagamento:

${mkLinkAtual}

🧸 Kit: R$ ${parseFloat(valorKit).toFixed(2)}
🚚 Frete: R$ ${parseFloat(valorFrete||0).toFixed(2)}
💰 Total: R$ ${total}

Qualquer dúvida é só chamar!`;
  window.open(`https://wa.me/55${wpp}?text=${encodeURIComponent(msg)}`,'_blank');
}

function openGerarLinkSessao(lead){
  glLinkAtual=null;
  glClienteAtual=lead;
  document.getElementById('gl-result').style.display='none';
  const btn=document.getElementById('gl-btn');
  btn.disabled=false;btn.textContent='📧 Criar link e enviar por e-mail';

  // Pré-preenche com dados do lead
  document.getElementById('gl-nome').value=lead.name||'';
  document.getElementById('gl-email').value=lead.email||'';
  document.getElementById('gl-wpp').value=lead.whatsapp||'';

  // Tenta extrair detalhes do JSON salvo em child_age
  let detalhes={};
  try{detalhes=typeof lead.child_age==='string'&&lead.child_age.startsWith('{')?JSON.parse(lead.child_age):{};}catch(e){}
  document.getElementById('gl-bairro').value=detalhes.bairro||'';
  document.getElementById('gl-idade').value=detalhes.idade||(typeof lead.child_age==='string'&&!lead.child_age.startsWith('{')?lead.child_age:'')||'';
  document.getElementById('gl-cupom').value=detalhes.cupom||'';
  document.getElementById('gl-preocup').value=detalhes.preocupacao||(lead.symptoms||[]).join(', ')||'';
  document.getElementById('gl-data').value='';
  document.getElementById('gl-hora').value='';
  document.getElementById('gl-valor').value='200';

  openDialog('dlg-gerar-link');
}

async function gerarLinkSessao(){
  const btn=document.getElementById('gl-btn');
  const nome=document.getElementById('gl-nome').value.trim();
  const email=document.getElementById('gl-email').value.trim();
  if(!nome||!email){alert('Preencha nome e e-mail.');return;}

  btn.disabled=true;btn.innerHTML='<span class="spin" style="display:inline-block;width:12px;height:12px;border:2px solid #fff;border-top-color:transparent;border-radius:50%;animation:spin .8s linear infinite;margin-right:6px;vertical-align:middle"></span> Gerando...';

  const payload={
    cliente_nome:nome,
    cliente_email:email,
    cliente_whatsapp:document.getElementById('gl-wpp').value.trim(),
    endereco_bairro:document.getElementById('gl-bairro').value.trim(),
    crianca_idade:document.getElementById('gl-idade').value.trim(),
    preocupacao:document.getElementById('gl-preocup').value.trim(),
    data_sessao:document.getElementById('gl-data').value||null,
    hora_sessao:document.getElementById('gl-hora').value.trim(),
    cupom_codigo:document.getElementById('gl-cupom').value.trim().toUpperCase(),
    valor_total:parseFloat(document.getElementById('gl-valor').value)||200,
  };

  try{
    const r=await fetch(`${SUPABASE_URL}/functions/v1/smooth-task`,{
      method:'POST',
      headers:{'Content-Type':'application/json','apikey':SUPABASE_ANON,'Authorization':'Bearer '+SUPABASE_ANON},
      body:JSON.stringify({action:'create_sessao_link',payload})
    });
    const data=await r.json();
    if(!data.ok){alert('Erro: '+(data.error||'tente novamente'));btn.disabled=false;btn.textContent='📧 Criar link e enviar por e-mail';return;}
    glLinkAtual=data.link;
    document.getElementById('gl-link').value=data.link;
    document.getElementById('gl-result').style.display='block';
    btn.textContent='✅ Link enviado!';
    // Atualiza status do lead pra "agendada"
    if(glClienteAtual?.id){
      await sb.from('leads').update({status:'contacted'}).eq('id',glClienteAtual.id);
      await loadAdminSessoes();
    }
  }catch(e){alert('Erro: '+e.message);btn.disabled=false;btn.textContent='📧 Criar link e enviar por e-mail';}
}

function copyLink(){
  navigator.clipboard.writeText(glLinkAtual||document.getElementById('gl-link').value);
  alert('Link copiado!');
}

function enviarLinkWhatsApp(){
  const wpp=document.getElementById('gl-wpp').value.replace(/\D/g,'');
  if(!wpp){alert('WhatsApp não informado.');return;}
  const nome=document.getElementById('gl-nome').value.trim().split(' ')[0];
  const valor=document.getElementById('gl-valor').value;
  const data=document.getElementById('gl-data').value;
  const hora=document.getElementById('gl-hora').value;
  const msg=`Oi ${nome}! 💜

Aqui está o link pra confirmar sua sessão presencial:

${glLinkAtual}

${data?`📅 Data: ${data}${hora?' às '+hora:''}\n`:''}💰 Sinal: R$ ${(parseFloat(valor)*0.5).toFixed(2)} (50%)
Restante R$ ${(parseFloat(valor)*0.5).toFixed(2)} pago no dia.

Qualquer dúvida é só chamar!`;
  window.open(`https://wa.me/55${wpp}?text=${encodeURIComponent(msg)}`,'_blank');
}

async function updateSessaoStatus(id,status){await sb.from('leads').update({status}).eq('id',id);await loadDashboard();}
async function deleteSessao(id){if(!confirm('Remover?'))return;await sb.from('leads').delete().eq('id',id);await loadAdminSessoes();await loadDashboard();}

/* COMPRAS */
let allComprasData=[];
let allSessoesPagasData=[];

async function loadAdminCompras(){
  const all=await loadPurchasesFromDB();
  // Busca também sessões pagas pra unificar
  const{data:sessPagas}=await sb.from('sessoes_agendadas')
    .select('*')
    .in('status',['sinal_pago','realizada'])
    .order('pago_em',{ascending:false});
  allSessoesPagasData=sessPagas||[];

  // Enriquece purchases
  const matIds=[...new Set(all.filter(p=>p.material_id).map(p=>p.material_id))];
  let matMap={};
  if(matIds.length){
    const{data:mats}=await sb.from('materials').select('id,title').in('id',matIds);
    matMap=Object.fromEntries((mats||[]).map(m=>[m.id,m.title]));
  }
  const userIds=[...new Set(all.filter(p=>p.user_id).map(p=>p.user_id))];
  let userMap={};
  if(userIds.length){
    const{data:users}=await sb.from('users').select('id,email,name').in('id',userIds);
    userMap=Object.fromEntries((users||[]).map(u=>[u.id,u]));
  }

  // Unifica em uma lista só: materiais, kits, sessões
  const lista=[];
  all.forEach(p=>{
    const u=userMap[p.user_id]||{};
    const tipo=p.material_id?'material':'kit';
    lista.push({
      _tipo:tipo,
      cliente_nome:u.name||u.email||'Visitante',
      cliente_email:u.email||'',
      item:tipo==='material'?(matMap[p.material_id]||'Material'):'Kit (físico)',
      valor:parseFloat(p.amount||0),
      cupom:p.coupon_code||null,
      metodo:p.payment_method||'—',
      data:p.created_at,
    });
  });
  allSessoesPagasData.forEach(s=>{
    lista.push({
      _tipo:'sessao',
      cliente_nome:s.cliente_nome,
      cliente_email:s.cliente_email,
      item:`Sessão presencial ${s.data_sessao||'(data a combinar)'}`,
      valor:parseFloat(s.valor_sinal||0),
      cupom:s.cupom_codigo||null,
      metodo:'mp',
      data:s.pago_em||s.created_at,
    });
  });
  const{data:pedKitsPg}=await sb.from('pedidos_kit')
    .select('*')
    .in('status',['pago','preparando','enviado','entregue'])
    .order('pago_em',{ascending:false});
  (pedKitsPg||[]).forEach(k=>{
    lista.push({
      _tipo:'kit',
      cliente_nome:k.cliente_nome,
      cliente_email:k.cliente_email,
      item:`Kit ${k.kit_nome||'personalizado'} (curadoria)`,
      valor:parseFloat(k.valor_total||0),
      cupom:k.cupom_codigo||null,
      metodo:'mp',
      data:k.pago_em||k.created_at,
    });
  });
  lista.sort((a,b)=>new Date(b.data)-new Date(a.data));
  allComprasData=lista;

  // Stats
  const total=lista.reduce((s,p)=>s+p.valor,0);
  const cnt=lista.length;
  const ticket=cnt?total/cnt:0;
  const cupons=lista.filter(p=>p.cupom).length;
  const set=(id,v)=>{const e=document.getElementById(id);if(e)e.textContent=v;};
  set('cp-total','R$ '+total.toFixed(2).replace('.',','));
  set('cp-count',cnt);
  set('cp-ticket','R$ '+ticket.toFixed(2).replace('.',','));
  set('cp-cupons',cupons);

  renderComprasTable(allComprasData);
}

function renderComprasTable(list){
  const tbody=document.getElementById('adm-compras-tbody');
  if(!list.length){tbody.innerHTML='<tr><td colspan="7" style="text-align:center;color:var(--ink-lt);padding:32px;font-weight:300">Nenhuma compra registrada ainda. As compras aparecerão aqui após o cliente pagar via Mercado Pago.</td></tr>';return;}
  tbody.innerHTML=list.map(p=>{
    const tipoIcon={'material':'📄','kit':'🎒','sessao':'🏠'}[p._tipo]||'·';
    const tipoLabel={'material':'Material','kit':'Kit','sessao':'Sessão'}[p._tipo]||p._tipo;
    const dia=new Date(p.data);
    const dataStr=dia.toLocaleDateString('pt-BR')+' '+dia.toLocaleTimeString('pt-BR',{hour:'2-digit',minute:'2-digit'});
    return `<tr>
    <td style="font-weight:500">${p.cliente_nome}<div style="font-size:11px;color:var(--ink-lt)">${p.cliente_email}</div></td>
    <td><span style="font-size:11px;font-weight:500;color:var(--ink-md)">${tipoIcon} ${tipoLabel}</span></td>
    <td style="font-size:12px">${p.item}</td>
    <td style="font-family:'Playfair Display',serif;font-weight:700">R$ ${p.valor.toFixed(2).replace('.',',')}</td>
    <td>${p.cupom?`<span style="background:var(--sage-lt);color:var(--sage);padding:3px 8px;border-radius:4px;font-size:10px;font-weight:600">${p.cupom}</span>`:'—'}</td>
    <td style="font-size:12px">${p.metodo}</td>
    <td style="font-size:11px;color:var(--ink-lt)">${dataStr}</td>
  </tr>`;}).join('');
}

function filterCompras(tipo,el){
  document.querySelectorAll('#adm-compras .adm-filter-btn').forEach(b=>b.classList.remove('active'));
  el.classList.add('active');
  renderComprasTable(tipo==='all'?allComprasData:allComprasData.filter(p=>p._tipo===tipo));
}

/* ══ REPASSE JAQUE ══ */
const JAQUE_PIX='jaquelineaten@gmail.com';
const SPLIT_RATES={material:0.70,kit:0.85,sessao:0.85};
let allRepasseData=[];
let currentRepasseFilter='all';

async function loadAdminRepasse(){
  const{data,error}=await sb.from('purchases').select('*').eq('payment_status','approved').order('created_at',{ascending:false});
  if(error){
    const errInfo={message:error.message,code:error.code,details:error.details,hint:error.hint};
    console.error('[repasse] erro consultando purchases:',JSON.stringify(errInfo));
    allRepasseData=[];
  } else {
    allRepasseData=(data||[]).map(p=>({...p,_tipo:p.material_id?'material':'kit'}));
  }

  // Adiciona sessões pagas
  const{data:sess}=await sb.from('sessoes_agendadas')
    .select('*')
    .in('status',['sinal_pago','realizada'])
    .order('pago_em',{ascending:false});
  (sess||[]).forEach(s=>{
    allRepasseData.push({
      id:'sess-'+s.id,_real_id:s.id,_tipo:'sessao',
      amount:parseFloat(s.valor_sinal||0),
      net_amount:parseFloat(s.valor_sinal||0),
      created_at:s.pago_em||s.created_at,
      _title:`Sessão presencial — ${s.cliente_nome}`,
      _cat:'Sessão',
      repasse_paid:s.repasse_status==='pago',
      repasse_paid_at:s.repasse_pago_em,
      application_fee:0,
      payment_method:'mp',
    });
  });

  // Adiciona kits por curadoria pagos (pedidos_kit) — rateio de kit (85/15)
  const{data:pedKitsR}=await sb.from('pedidos_kit')
    .select('*')
    .in('status',['pago','preparando','enviado','entregue']);
  (pedKitsR||[]).forEach(k=>{
    allRepasseData.push({
      id:'kit-'+k.id,_real_id:k.id,_src:'pedido_kit',_tipo:'kit',
      amount:parseFloat(k.valor_total||0),
      net_amount:parseFloat(k.valor_total||0),
      created_at:k.pago_em||k.created_at,
      _title:`Kit ${k.kit_nome||'personalizado'} — ${k.cliente_nome}`,
      _cat:'Kit',
      repasse_paid:k.repasse_status==='pago',
      repasse_paid_at:k.repasse_pago_em,
      application_fee:0,
      payment_method:'mp',
    });
  });

  // Reordena
  allRepasseData.sort((a,b)=>new Date(b.created_at)-new Date(a.created_at));

  console.log('[repasse] '+allRepasseData.length+' itens carregados');

  // Enriquece com título do material
  const matIds=[...new Set(allRepasseData.filter(p=>p.material_id&&!p._title).map(p=>p.material_id))];
  if(matIds.length){
    const{data:mats}=await sb.from('materials').select('id,title,category').in('id',matIds);
    const mp=Object.fromEntries((mats||[]).map(m=>[m.id,m]));
    allRepasseData.forEach(p=>{
      if(p.material_id&&!p._title){
        p._title=mp[p.material_id]?.title||'Material';
        p._cat=mp[p.material_id]?.category||'';
      }
    });
  }

  // Atualiza card do dashboard com total pendente
  const totalPendente=allRepasseData.filter(p=>!p.repasse_paid).reduce((s,p)=>s+calcJaquePart(p),0);
  const elDP=document.getElementById('ds-jaque-pendente');
  if(elDP)elDP.textContent='R$ '+totalPendente.toFixed(2).replace('.',',');

  renderRepasse();
  if(document.getElementById('adm-repasse')?.classList.contains('active'))renderGraficoRepasseMensal();
}

function getRepasseRate(row){
  if(row._tipo==='sessao'||row._tipo==='kit')return SPLIT_RATES.kit||0.85;
  return SPLIT_RATES.material||0.70;
}

function calcJaquePart(row){
  // Se já tem application_fee gravado (split automático funcionou), usa o resto
  if(row.application_fee&&row.application_fee>0){
    return parseFloat(row.amount)-parseFloat(row.application_fee);
  }
  // Senão calcula pela tabela usando o VALOR LÍQUIDO (descontada taxa MP)
  // net_amount = o que realmente caiu na conta (preferencial)
  // se não tiver, usa amount como fallback (compras antigas)
  const base=row.net_amount!=null?parseFloat(row.net_amount):parseFloat(row.amount);
  const rate=getRepasseRate(row);
  return base*rate;
}

function filterByPeriod(list){
  const now=new Date();
  if(currentRepasseFilter==='month'){
    const y=now.getFullYear(),m=now.getMonth();
    return list.filter(p=>{const d=new Date(p.created_at);return d.getFullYear()===y&&d.getMonth()===m;});
  }
  if(currentRepasseFilter==='lastmonth'){
    const lm=new Date(now.getFullYear(),now.getMonth()-1,1);
    const y=lm.getFullYear(),m=lm.getMonth();
    return list.filter(p=>{const d=new Date(p.created_at);return d.getFullYear()===y&&d.getMonth()===m;});
  }
  if(currentRepasseFilter==='pending'){
    return list.filter(p=>!p.repasse_paid);
  }
  return list;
}

function renderRepasse(){
  const list=filterByPeriod(allRepasseData);
  const totalReceita=list.reduce((s,p)=>s+parseFloat(p.amount||0),0);
  const totalPago=list.filter(p=>p.repasse_paid).reduce((s,p)=>s+calcJaquePart(p),0);
  const aPagar=list.filter(p=>!p.repasse_paid).reduce((s,p)=>s+calcJaquePart(p),0);
  const plataforma=totalReceita-list.reduce((s,p)=>s+calcJaquePart(p),0);

  const fmt=v=>v.toFixed(2).replace('.',',');
  const set=(id,v)=>{const e=document.getElementById(id);if(e)e.textContent=v;};

  // ═══ Cards por tipo: calcula receita líquida, taxa MP, parte Jaque, parte Joice ═══
  const tipos=['material','kit','sessao'];
  const taxasRepasse={'material':0.70,'kit':0.85,'sessao':0.85};
  const prefixos={'material':'mat','kit':'kit','sessao':'sess'};

  tipos.forEach(tipo=>{
    const itens=list.filter(p=>p._tipo===tipo);
    const bruto=itens.reduce((s,p)=>s+parseFloat(p.amount||0),0);
    const liquido=itens.reduce((s,p)=>{
      const net=p.net_amount!=null?parseFloat(p.net_amount):parseFloat(p.amount||0);
      return s+net;
    },0);
    const taxaMP=bruto-liquido;
    const rate=taxasRepasse[tipo];
    const partJaque=liquido*rate;
    const partJoice=liquido*(1-rate);
    const prefix=prefixos[tipo];
    set(`rp-${prefix}-liquido`,'R$ '+fmt(liquido));
    set(`rp-${prefix}-vendas`,itens.length);
    set(`rp-${prefix}-taxa`,'taxa MP: R$ '+fmt(taxaMP));
    set(`rp-${prefix}-jaque`,'R$ '+fmt(partJaque));
    set(`rp-${prefix}-joice`,'R$ '+fmt(partJoice));
  });

  // Resumo geral
  set('rp-total-jaque',fmt(aPagar));
  set('rp-receita','R$ '+fmt(totalReceita));
  set('rp-plataforma','R$ '+fmt(plataforma));
  set('rp-vendas',list.length);
  set('rp-pago','R$ '+fmt(totalPago));

  const periodLabels={month:'Este mês',lastmonth:'Mês passado',all:'Histórico completo',pending:'Pendente de repasse'};
  set('rp-period',periodLabels[currentRepasseFilter]+' • '+list.length+' venda(s)');

  const tbody=document.getElementById('adm-repasse-tbody');
  if(!tbody)return;
  if(!list.length){
    tbody.innerHTML='<tr><td colspan="7" style="text-align:center;color:var(--ink-lt);padding:32px;font-weight:300">Nenhuma venda no período selecionado.</td></tr>';
    return;
  }
  const tipoLabels={'material':{label:'📄 Material',bg:'#EEF2FF',color:'#1e3a5f'},'kit':{label:'🎒 Kit',bg:'#FEF3C7',color:'#92400E'},'sessao':{label:'🏠 Sessão',bg:'#D1FAE5',color:'#065F46'}};
  tbody.innerHTML=list.map(p=>{
    const jaque=calcJaquePart(p);
    const dt=new Date(p.created_at).toLocaleDateString('pt-BR');
    const pago=p.repasse_paid;
    const liquido=p.net_amount!=null?parseFloat(p.net_amount):parseFloat(p.amount);
    const taxa=parseFloat(p.amount)-liquido;
    const tipo=tipoLabels[p._tipo]||tipoLabels.material;
    const idForBtn=p._src==='pedido_kit'?`kit|${p._real_id}`:(p._real_id?`sess|${p._real_id}`:p.id);
    return `<tr style="${pago?'opacity:0.5':''}">
      <td style="font-size:12px">${dt}</td>
      <td>${p._title||'—'}</td>
      <td><span style="font-size:11px;padding:3px 8px;background:${tipo.bg};color:${tipo.color};border-radius:6px;font-weight:500">${tipo.label}</span></td>
      <td style="font-family:'Playfair Display',serif;font-weight:700">R$ ${fmt(parseFloat(p.amount))}<br><span style="font-size:10px;color:var(--ink-lt);font-family:'DM Sans',sans-serif;font-weight:400">líq: R$ ${fmt(liquido)}${taxa>0?` (-${fmt(taxa)})`:''}</span></td>
      <td style="font-family:'Playfair Display',serif;font-weight:700;color:#92400E">R$ ${fmt(jaque)}</td>
      <td>${pago?'<span class="badge-free">✓ Repassado</span>':'<span style="font-size:11px;padding:3px 8px;background:#FEF3C7;color:#92400E;border-radius:6px">A repassar</span>'}</td>
      <td>${pago?`<button class="btn-del" onclick="unmarkRepasse('${idForBtn}')" title="Desmarcar">↺</button>`:`<button onclick="markRepasse('${idForBtn}')" style="background:#10b981;color:white;border:none;padding:6px 12px;border-radius:6px;font-size:12px;cursor:pointer;font-weight:600">✓ Pago</button>`}</td>
    </tr>`;
  }).join('');
}

function filterRepasse(p,el){
  document.querySelectorAll('#adm-repasse .adm-filter-btn').forEach(b=>b.classList.remove('active'));
  el.classList.add('active');
  currentRepasseFilter=p;
  renderRepasse();
}

async function markRepasse(id){
  if(!confirm('Marcar como repassado?'))return;
  if(id.startsWith('sess|')){
    const realId=id.replace('sess|','');
    await sb.from('sessoes_agendadas').update({repasse_status:'pago',repasse_pago_em:new Date().toISOString()}).eq('id',realId);
  } else if(id.startsWith('kit|')){
    const realId=id.replace('kit|','');
    await sb.from('pedidos_kit').update({repasse_status:'pago',repasse_pago_em:new Date().toISOString()}).eq('id',realId);
  } else {
    await sb.from('purchases').update({repasse_paid:true,repasse_paid_at:new Date().toISOString()}).eq('id',id);
  }
  await loadAdminRepasse();
}

async function unmarkRepasse(id){
  if(!confirm('Desmarcar repasse?'))return;
  if(id.startsWith('sess|')){
    const realId=id.replace('sess|','');
    await sb.from('sessoes_agendadas').update({repasse_status:null,repasse_pago_em:null}).eq('id',realId);
  } else if(id.startsWith('kit|')){
    const realId=id.replace('kit|','');
    await sb.from('pedidos_kit').update({repasse_status:null,repasse_pago_em:null}).eq('id',realId);
  } else {
    await sb.from('purchases').update({repasse_paid:false,repasse_paid_at:null}).eq('id',id);
  }
  await loadAdminRepasse();
}

async function marcarTodosPagos(){
  const pendentes=filterByPeriod(allRepasseData).filter(p=>!p.repasse_paid);
  if(!pendentes.length){alert('Nada pra marcar como pago.');return;}
  const total=pendentes.reduce((s,p)=>s+calcJaquePart(p),0);
  if(!confirm(`Marcar ${pendentes.length} repasse(s) como pago(s) — total R$ ${total.toFixed(2).replace('.',',')}?`))return;
  for(const p of pendentes){
    if(p._src==='pedido_kit'){
      await sb.from('pedidos_kit').update({repasse_status:'pago',repasse_pago_em:new Date().toISOString()}).eq('id',p._real_id);
    } else if(p._real_id){
      await sb.from('sessoes_agendadas').update({repasse_status:'pago',repasse_pago_em:new Date().toISOString()}).eq('id',p._real_id);
    } else {
      await sb.from('purchases').update({repasse_paid:true,repasse_paid_at:new Date().toISOString()}).eq('id',p.id);
    }
  }
  await loadAdminRepasse();
  alert('✅ Tudo marcado como pago!');
}

function copyPixToJaque(){
  const v=document.getElementById('rp-total-jaque').textContent;
  navigator.clipboard.writeText(v).then(()=>{
    const btn=event.target;
    const orig=btn.textContent;
    btn.textContent='✓ Copiado!';
    setTimeout(()=>btn.textContent=orig,2000);
  });
}

function copyPixChave(){
  navigator.clipboard.writeText(JAQUE_PIX).then(()=>{
    const btn=event.target;
    const orig=btn.textContent;
    btn.textContent='✓ PIX copiado!';
    setTimeout(()=>btn.textContent=orig,2000);
  });
}

/* ══ PESQUISAS ══ */
let allPesquisaATData=[];
let filteredPatData=[];

async function loadAdminPesquisas(){
  renderPesquisasList();
  await loadPesquisaAT();
}

async function loadPesquisaAT(){
  try{
    const{data,error}=await sb.from('pesquisa_at').select('*').order('created_at',{ascending:false});
    if(error){console.error('[pesquisas] erro:',error);allPesquisaATData=[];}
    else allPesquisaATData=data||[];
    console.log('[pesquisas] '+allPesquisaATData.length+' respostas AT carregadas');
  }catch(e){console.error('[pesquisas] exceção:',e);allPesquisaATData=[];}
  // Atualiza contador no card da lista
  const cnt=document.getElementById('pesq-at-count');
  if(cnt)cnt.textContent=allPesquisaATData.length;
  // Se já estamos no detalhe, re-renderiza
  if(document.getElementById('pesq-detalhe-at').style.display!=='none'){
    renderPesquisaATDetail();
  }
}

function renderPesquisasList(){
  const wrap=document.getElementById('pesq-cards');
  if(!wrap)return;
  const pesquisas=[
    {id:'at',nome:'Pesquisa para Assistentes Terapêuticas',desc:'Pesquisa de mercado com profissionais',icon:'👩‍⚕️',color:'#1A3FBF',countId:'pesq-at-count',handler:'abrirPesquisaAT()'},
    // Espaço pra futuras pesquisas
  ];
  wrap.innerHTML=pesquisas.map(p=>`
    <div onclick="${p.handler}" style="background:white;border:1px solid var(--border);border-radius:16px;padding:24px;cursor:pointer;transition:all .2s;position:relative" onmouseover="this.style.transform='translateY(-2px)';this.style.boxShadow='0 8px 24px rgba(0,0,0,0.08)'" onmouseout="this.style.transform='';this.style.boxShadow=''">
      <div style="font-size:32px;margin-bottom:12px">${p.icon}</div>
      <h3 style="font-size:15px;font-weight:600;color:var(--ink);margin:0 0 6px;line-height:1.3">${p.nome}</h3>
      <p style="font-size:12px;color:var(--ink-lt);margin:0 0 16px;line-height:1.4">${p.desc}</p>
      <div style="display:flex;align-items:center;justify-content:space-between">
        <div>
          <span style="font-size:24px;font-weight:700;color:${p.color};font-family:'Playfair Display',serif" id="${p.countId}">0</span>
          <span style="font-size:11px;color:var(--ink-lt);margin-left:6px">respostas</span>
        </div>
        <span style="color:${p.color};font-size:13px;font-weight:500">Ver relatório →</span>
      </div>
    </div>
  `).join('')+`
    <div style="background:#FAFAF8;border:2px dashed var(--border);border-radius:16px;padding:24px;display:flex;flex-direction:column;align-items:center;justify-content:center;min-height:180px;color:var(--ink-lt)">
      <div style="font-size:32px;margin-bottom:8px">＋</div>
      <p style="font-size:12px;text-align:center;margin:0">Outras pesquisas aparecerão aqui conforme forem criadas</p>
    </div>
  `;
}

function abrirPesquisaAT(){
  document.getElementById('pesq-lista').style.display='none';
  document.getElementById('pesq-detalhe-at').style.display='block';
  renderPesquisaATDetail();
}

function voltarPesquisas(){
  document.getElementById('pesq-detalhe-at').style.display='none';
  document.getElementById('pesq-lista').style.display='block';
}

function renderPesquisaATDetail(){
  const d=allPesquisaATData;
  const total=d.length;

  // STATS
  document.getElementById('pat-total').textContent=total;

  if(!total){
    document.getElementById('pat-nps').textContent='—';
    document.getElementById('pat-paga').textContent='—';
    document.getElementById('pat-marketplace').textContent='—';
    document.getElementById('pat-tbody').innerHTML='<tr><td colspan="7" style="text-align:center;color:var(--ink-lt);padding:32px;font-weight:300">Nenhuma resposta ainda. Quando alguém responder a pesquisa, aparecerá aqui.</td></tr>';
    ['chart-nps','chart-area','chart-exp','chart-preco','chart-pagou','chart-pdf','chart-temas','chart-formatos','chart-onde-pesquisa'].forEach(id=>{const el=document.getElementById(id);if(el)el.innerHTML='<p style="font-size:12px;color:var(--ink-lt);text-align:center;padding:20px 0">Sem dados</p>';});
    document.getElementById('pat-sugestoes').innerHTML='<p style="font-size:12px;color:#92400E;font-style:italic">Nenhuma sugestão recebida ainda.</p>';
    document.getElementById('pat-sites-compra').innerHTML='<p style="font-size:12px;color:var(--ink-lt);font-style:italic">Nenhum site mencionado ainda.</p>';
    return;
  }

  // NPS Score = % promotores - % detratores
  const npsVals=d.map(r=>parseInt(r.nps)).filter(n=>!isNaN(n));
  const detr=npsVals.filter(n=>n<=6).length;
  const neut=npsVals.filter(n=>n>=7&&n<=8).length;
  const prom=npsVals.filter(n=>n>=9).length;
  const npsScore=npsVals.length?Math.round((prom/npsVals.length*100)-(detr/npsVals.length*100)):0;
  const elNps=document.getElementById('pat-nps');
  elNps.textContent=npsScore;
  elNps.style.color=npsScore>=50?'#2E6B3E':npsScore>=0?'#D4900A':'#B45309';

  // % que paga
  const paga=d.filter(r=>r.ja_pagou==='Sim').length;
  document.getElementById('pat-paga').textContent=Math.round(paga/total*100)+'%';

  // % marketplace
  const mkt=d.filter(r=>r.interesse_marketplace==='Sim').length;
  document.getElementById('pat-marketplace').textContent=Math.round(mkt/total*100)+'%';

  // GRÁFICO NPS (barras coloridas)
  const maxNps=Math.max(detr,neut,prom,1);
  document.getElementById('chart-nps').innerHTML=`
    ${[{label:'Detr',val:detr,color:'#DC2626'},{label:'Neut',val:neut,color:'#D4900A'},{label:'Prom',val:prom,color:'#2E6B3E'}].map(b=>`
      <div style="flex:1;display:flex;flex-direction:column;align-items:center;height:100%;justify-content:flex-end;gap:6px">
        <div style="font-size:11px;font-weight:600;color:${b.color}">${b.val}</div>
        <div style="width:100%;background:${b.color};border-radius:6px 6px 0 0;height:${(b.val/maxNps*100)||2}%;min-height:4px;transition:all .3s"></div>
      </div>
    `).join('')}
  `;

  // GRÁFICO ÁREA (horizontal)
  document.getElementById('chart-area').innerHTML=barChart(countBy(d,'area'),'#1A3FBF',total);
  document.getElementById('chart-exp').innerHTML=barChart(countBy(d,'experiencia'),'#7C3AED',total);
  document.getElementById('chart-preco').innerHTML=barChart(countBy(d,'faixa_preco'),'#D4900A',total);
  document.getElementById('chart-pagou').innerHTML=barChart(countBy(d,'ja_pagou'),'#2E6B3E',total);
  document.getElementById('chart-pdf').innerHTML=barChart(countBy(d,'usa_pdf'),'#0891B2',total);

  // ARRAYS (temas e formatos)
  document.getElementById('chart-temas').innerHTML=barChart(countByArray(d,'temas_interesse'),'#DB2777',total);
  document.getElementById('chart-formatos').innerHTML=barChart(countByArray(d,'formatos_preferidos'),'#059669',total);

  // ONDE PESQUISA (array)
  document.getElementById('chart-onde-pesquisa').innerHTML=barChart(countByArray(d,'onde_pesquisa'),'#1A3FBF',total);

  // SITES/LOJAS (texto livre)
  const sites=d.filter(r=>r.sites_compra&&r.sites_compra.trim()).slice(0,30);
  document.getElementById('pat-sites-compra').innerHTML=sites.length?sites.map(r=>`
    <div style="background:#F8FAFC;border-radius:8px;padding:10px 12px;border-left:3px solid #1A3FBF">
      <p style="font-size:12px;color:var(--ink);margin:0 0 4px;line-height:1.5">${escapeHtml(r.sites_compra)}</p>
      <p style="font-size:10px;color:var(--ink-lt);margin:0">— ${escapeHtml(r.nome||'Anônima')}</p>
    </div>
  `).join(''):'<p style="font-size:12px;color:var(--ink-lt);font-style:italic">Nenhum site mencionado ainda.</p>';

  // SUGESTÕES
  const sugs=d.filter(r=>r.sugestao&&r.sugestao.trim()).slice(0,20);
  document.getElementById('pat-sugestoes').innerHTML=sugs.length?sugs.map(r=>`
    <div style="background:white;border-radius:8px;padding:12px 14px;border-left:3px solid #F59E0B">
      <p style="font-size:13px;color:var(--ink);margin:0 0 4px;line-height:1.5">"${escapeHtml(r.sugestao)}"</p>
      <p style="font-size:11px;color:#92400E;margin:0">— ${escapeHtml(r.nome||'Anônima')} · ${r.area||'—'}</p>
    </div>
  `).join(''):'<p style="font-size:12px;color:#92400E;font-style:italic">Nenhuma sugestão recebida ainda.</p>';

  // TABELA
  filteredPatData=[...d];
  renderPatTable();
}

function renderPatTable(){
  const tbody=document.getElementById('pat-tbody');
  if(!filteredPatData.length){tbody.innerHTML='<tr><td colspan="7" style="text-align:center;color:var(--ink-lt);padding:24px;font-weight:300">Nenhum resultado.</td></tr>';return;}
  tbody.innerHTML=filteredPatData.map(r=>{
    const dt=new Date(r.created_at).toLocaleDateString('pt-BR');
    const nps=parseInt(r.nps);
    const npsCol=isNaN(nps)?'var(--ink-lt)':nps<=6?'#DC2626':nps<=8?'#D4900A':'#2E6B3E';
    return `<tr>
      <td style="font-weight:500">${escapeHtml(r.nome||'—')}<div style="font-size:11px;color:var(--ink-lt)">${escapeHtml(r.email||'')}</div></td>
      <td style="font-size:12px">${escapeHtml(r.area||'—')}</td>
      <td style="font-size:12px">${escapeHtml(r.experiencia||'—')}</td>
      <td style="font-size:12px">${escapeHtml(r.ja_pagou||'—')}</td>
      <td><span style="font-weight:700;color:${npsCol};font-family:'Playfair Display',serif;font-size:16px">${isNaN(nps)?'—':nps}</span></td>
      <td style="font-size:12px">${r.interesse_marketplace==='Sim'?'<span class="badge-free">✓ Sim</span>':r.interesse_marketplace||'—'}</td>
      <td style="font-size:11px;color:var(--ink-lt)">${dt}</td>
    </tr>`;
  }).join('');
}

function filterPatTable(q){
  q=(q||'').toLowerCase().trim();
  filteredPatData=q?allPesquisaATData.filter(r=>(r.nome||'').toLowerCase().includes(q)||(r.email||'').toLowerCase().includes(q)||(r.area||'').toLowerCase().includes(q)):[...allPesquisaATData];
  renderPatTable();
}

function exportPesquisaAT(){
  if(!allPesquisaATData.length){alert('Sem dados para exportar.');return;}
  const cols=['nome','email','whatsapp','area','experiencia','usa_pdf','ja_pagou','faixa_preco','temas_interesse','formatos_preferidos','onde_pesquisa','sites_compra','nps','sugestao','cria_materiais','interesse_marketplace','origem','created_at'];
  const header=cols.join(',');
  const rows=allPesquisaATData.map(r=>cols.map(c=>{
    let v=r[c];
    if(Array.isArray(v))v=v.join('; ');
    if(v==null)v='';
    v=String(v).replace(/"/g,'""');
    return `"${v}"`;
  }).join(','));
  const csv=header+'\n'+rows.join('\n');
  const blob=new Blob(['\ufeff'+csv],{type:'text/csv;charset=utf-8'});
  const url=URL.createObjectURL(blob);
  const a=document.createElement('a');
  a.href=url;a.download=`pesquisa-at_${new Date().toISOString().slice(0,10)}.csv`;
  a.click();URL.revokeObjectURL(url);
}

/* HELPERS de gráficos */
function countBy(list,key){
  const m={};
  list.forEach(r=>{const v=r[key]||'(vazio)';m[v]=(m[v]||0)+1;});
  return Object.entries(m).sort((a,b)=>b[1]-a[1]);
}
function countByArray(list,key){
  const m={};
  list.forEach(r=>{
    let arr=r[key];
    if(typeof arr==='string'){try{arr=JSON.parse(arr);}catch(e){arr=arr.split(',');}}
    if(!Array.isArray(arr))arr=[arr];
    arr.forEach(v=>{if(v){v=String(v).trim();m[v]=(m[v]||0)+1;}});
  });
  return Object.entries(m).sort((a,b)=>b[1]-a[1]);
}
function barChart(pairs,color,total){
  if(!pairs.length)return '<p style="font-size:12px;color:var(--ink-lt);text-align:center;padding:20px 0">Sem dados</p>';
  const max=Math.max(...pairs.map(p=>p[1]),1);
  return pairs.slice(0,8).map(([label,val])=>{
    const pct=Math.round(val/total*100);
    return `<div style="margin-bottom:10px">
      <div style="display:flex;justify-content:space-between;font-size:12px;margin-bottom:4px;color:var(--ink)">
        <span style="max-width:75%;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${escapeHtml(label)}</span>
        <span style="font-weight:600;color:${color}">${val} · ${pct}%</span>
      </div>
      <div style="height:8px;background:#F1EFE8;border-radius:4px;overflow:hidden">
        <div style="height:100%;background:${color};width:${val/max*100}%;border-radius:4px;transition:width .4s"></div>
      </div>
    </div>`;
  }).join('');
}
function escapeHtml(s){return String(s||'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');}

/* ══ EQUIPE ══ */
const ROLE_LABELS={
  admin:{label:'Admin',badge:'badge-admin',access:'Acesso total ao painel'},
  editor:{label:'Editor',badge:'badge-editor',access:'Materiais e Kits apenas'},
};
const OWNER_EMAIL='joicealmeida.jc@gmail.com';

function toggleAddMember(){
  const f=document.getElementById('form-add-member');
  f.style.display=f.style.display==='none'?'block':'none';
  if(f.style.display==='block'){
    document.getElementById('mb-name').value='';
    document.getElementById('mb-email').value='';
    document.getElementById('mb-pass').value='';
    document.getElementById('mb-msg').textContent='';
  }
}

function addMember(){
  const name=document.getElementById('mb-name').value.trim();
  const email=document.getElementById('mb-email').value.trim();
  const pass=document.getElementById('mb-pass').value;
  const role=document.getElementById('mb-role').value;
  const msg=document.getElementById('mb-msg');
  if(!name){msg.textContent='Digite o nome.';msg.style.color='var(--terra)';return;}
  if(!email||!email.includes('@')){msg.textContent='E-mail inválido.';msg.style.color='var(--terra)';return;}
  if(pass.length<6){msg.textContent='Senha deve ter pelo menos 6 caracteres.';msg.style.color='var(--terra)';return;}
  if(email===OWNER_EMAIL){msg.textContent='Este e-mail já tem acesso.';msg.style.color='var(--terra)';return;}
  sb.from('team_members').insert({name,email,password_hash:pass,role,created_by:user?.email||''}).then(({error})=>{
    if(error){msg.textContent=error.code==='23505'?'Este e-mail já tem acesso.':'Erro ao salvar.';msg.style.color='var(--terra)';return;}
    msg.textContent='✓ Membro adicionado!';msg.style.color='var(--sage)';
    toggleAddMember();loadEquipe();
    setTimeout(()=>msg.textContent='',3000);
  });
}

function removeMember(email){
  if(!confirm(`Remover acesso de ${email}?`))return;
  sb.from('team_members').delete().eq('email',email).then(()=>loadEquipe());
}

function loadEquipe(){
  const tbody=document.getElementById('equipe-tbody');
  sb.from('team_members').select('*').order('created_at',{ascending:true}).then(({data:members})=>{
  const rows=[{name:'Joice Almeida',email:OWNER_EMAIL,role:'admin',isOwner:true,created_at:null},...(members||[])];
  const rl=ROLE_LABELS;
  tbody.innerHTML=rows.map(r=>`
    <tr>
      <td>
        <div style="display:flex;align-items:center;gap:10px">
          <div style="width:32px;height:32px;border-radius:50%;background:var(--blue-lt);color:var(--blue-dk);font-size:13px;font-weight:700;display:flex;align-items:center;justify-content:center;flex-shrink:0">${r.name.charAt(0).toUpperCase()}</div>
          <span style="font-weight:500;font-size:13px">${r.name}</span>
        </div>
      </td>
      <td style="font-size:13px">${r.email}</td>
      <td><span class="${r.isOwner?'badge-owner':(rl[r.role]?.badge||'badge-editor')}">${r.isOwner?'Proprietária':(rl[r.role]?.label||r.role)}</span></td>
      <td class="access-list">${r.isOwner?'Acesso total ao painel':(rl[r.role]?.access||'—')}</td>
      <td style="font-size:12px;color:var(--ink-lt)">${r.created_at?new Date(r.created_at).toLocaleDateString('pt-BR'):'—'}</td>
      <td>${r.isOwner?'':'<button class="btn-del" onclick="removeMember(\''+r.email+'\')">Remover</button>'}</td>
    </tr>
  `).join('');
  });// end then
}

/* ══ UPLOAD DE ARQUIVOS ══ */
async function uploadToStorage(file, bucket, folder){
  const ext=file.name.split('.').pop();
  const name=`${folder}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
  const{data,error}=await sb.storage.from(bucket).upload(name,file,{contentType:file.type,upsert:false});
  if(error) throw error;
  const{data:urlData}=sb.storage.from(bucket).getPublicUrl(name);
  return urlData.publicUrl;
}

function handleFileDrop(e,target){
  e.preventDefault();
  const file=e.dataTransfer.files[0];
  if(!file) return;
  processUploadedFile(file,target);
}

function handleFileSelect(input,target){
  const file=input.files[0];
  if(!file) return;
  processUploadedFile(file,target);
}

async function processUploadedFile(file,target){
  if(target==='pdf'){
    if(!file.name.endsWith('.pdf')){alert('Selecione um arquivo PDF.');return;}
    const zone=document.getElementById('upload-pdf-zone');
    const label=document.getElementById('upload-pdf-label');
    label.innerHTML='<div style="font-size:20px">⏳</div><p style="font-size:12px;color:var(--blue)">Enviando...</p>';
    try{
      const url=await uploadToStorage(file,'materials','pdfs');
      document.getElementById('adm-url').value=url;
      label.innerHTML=`<div style="font-size:20px">✅</div><p style="font-size:12px;color:var(--sage);font-weight:500">${file.name}</p><p style="font-size:10px;color:var(--ink-lt)">Upload concluído</p>`;
      zone.style.borderColor='var(--sage)';zone.style.background='var(--sage-lt)';
    }catch(err){
      label.innerHTML='<div style="font-size:20px">❌</div><p style="font-size:12px;color:var(--terra)">Erro no upload. Tente novamente.</p>';
      console.error(err);
    }
  } else if(target.startsWith('photo')){
    if(!file.type.startsWith('image/')){alert('Selecione uma imagem.');return;}
    const num=target.replace('photo','');
    const preview=document.getElementById('preview-photo'+num);
    const lbl=document.getElementById('label-photo'+num);
    lbl.innerHTML='<div style="font-size:14px">⏳</div>';
    try{
      const url=await uploadToStorage(file,'materials','photos');
      document.getElementById('adm-photo'+num).value=url;
      preview.querySelector('img').src=url;
      preview.style.display='block';
      lbl.style.display='none';
    }catch(err){
      lbl.innerHTML='<div style="font-size:14px">❌</div><p style="font-size:10px;color:var(--terra)">Erro</p>';
      console.error(err);
    }
  }
}

function previewFromUrl(num,url){
  num=String(num).replace('photo','');
  if(!url) return;
  const preview=document.getElementById('preview-photo'+num);
  const lbl=document.getElementById('label-photo'+num);
  if(preview&&url.startsWith('http')){
    preview.querySelector('img').src=url;
    preview.style.display='block';
    lbl.style.display='none';
  }
}

function clearPhoto(num,e){
  if(e) e.stopPropagation();
  num=String(num).replace('photo','');
  const fld=document.getElementById('adm-photo'+num); if(fld)fld.value='';
  const preview=document.getElementById('preview-photo'+num);
  const lbl=document.getElementById('label-photo'+num);
  if(preview)preview.style.display='none';
  if(lbl)lbl.style.display='flex';
}

/* ══ CARROSSEL DA DIALOG DO PRODUTO ══ */
let dlgCarIdx=0,dlgCarPhotos=[];
function dlgCarouselInit(photos){
  dlgCarPhotos=photos;dlgCarIdx=0;
  document.getElementById('dlg-carousel').innerHTML=photos.map(src=>`<div class="dlg-carousel-slide"><img src="${src}" onerror="this.parentElement.style.display='none'"></div>`).join('');
  document.getElementById('dlg-carousel-dots').innerHTML=photos.map((_,i)=>`<button class="dlg-carousel-dot${i===0?' active':''}" onclick="dlgCarouselGo(${i})"></button>`).join('');
  document.getElementById('dlg-carr-prev').style.display=photos.length>1?'flex':'none';
  document.getElementById('dlg-carr-next').style.display=photos.length>1?'flex':'none';
  dlgCarouselUpdate();
}
function dlgCarouselNav(dir){dlgCarIdx=(dlgCarIdx+dir+dlgCarPhotos.length)%dlgCarPhotos.length;dlgCarouselUpdate();}
function dlgCarouselGo(i){dlgCarIdx=i;dlgCarouselUpdate();}
function dlgCarouselUpdate(){
  document.getElementById('dlg-carousel').style.transform=`translateX(-${dlgCarIdx*100}%)`;
  document.querySelectorAll('.dlg-carousel-dot').forEach((d,i)=>d.classList.toggle('active',i===dlgCarIdx));
  const img=document.querySelector('#dp-preview img.cover-fill');
  if(img&&dlgCarPhotos[dlgCarIdx])img.src=dlgCarPhotos[dlgCarIdx];
}
(function(){
  let _sx=0;
  document.addEventListener('touchstart',e=>{if(e.target.closest('#dlg-carousel-wrap'))_sx=e.touches[0].clientX;},{passive:true});
  document.addEventListener('touchend',e=>{if(!e.target.closest('#dlg-carousel-wrap'))return;const dx=e.changedTouches[0].clientX-_sx;if(Math.abs(dx)>40)dlgCarouselNav(dx<0?1:-1);});
})();

let carIdx=0;
let carPhotos=[];

function initCarousel(photos){
  carPhotos=photos.filter(Boolean);
  carIdx=0;
  const wrap=document.getElementById('prod-carousel-wrap');
  if(!carPhotos.length){wrap.style.display='none';return;}
  wrap.style.display='block';
  // Setas só se mais de 1 foto
  document.getElementById('carr-prev').style.display=carPhotos.length>1?'flex':'none';
  document.getElementById('carr-next').style.display=carPhotos.length>1?'flex':'none';
  // Slides
  document.getElementById('prod-carousel').innerHTML=carPhotos.map(src=>`
    <div style="min-width:100%;height:220px;flex-shrink:0">
      <img src="${src}" style="width:100%;height:100%;object-fit:contain;background:var(--parchment);display:block" onerror="this.parentElement.style.display='none'">
    </div>`).join('');
  // Dots — só aparecem se mais de 1 foto, quantidade exata
  const dots=document.getElementById('prod-carousel-dots');
  dots.innerHTML=carPhotos.length>1
    ?carPhotos.map((_,i)=>`<div onclick="carouselGo(${i})" style="width:${i===0?'18px':'6px'};height:6px;border-radius:3px;background:${i===0?'#fff':'rgba(255,255,255,0.5)'};cursor:pointer;transition:all .25s" id="cdot-${i}"></div>`).join('')
    :'';
  updateCarousel();
}

function carouselNav(dir){
  carIdx=(carIdx+dir+carPhotos.length)%carPhotos.length;
  updateCarousel();
}
function carouselGo(i){
  carIdx=i;updateCarousel();
}
function updateCarousel(){
  document.getElementById('prod-carousel').style.transform=`translateX(-${carIdx*100}%)`;
  document.querySelectorAll('[id^=cdot-]').forEach((d,i)=>{
    d.style.width=i===carIdx?'18px':'6px';
    d.style.background=i===carIdx?'#fff':'rgba(255,255,255,0.5)';
  });
}

// Swipe support
(function(){
  let sx=0;
  document.addEventListener('touchstart',e=>{if(e.target.closest('#prod-carousel-wrap'))sx=e.touches[0].clientX;});
  document.addEventListener('touchend',e=>{
    if(!e.target.closest('#prod-carousel-wrap'))return;
    const dx=e.changedTouches[0].clientX-sx;
    if(Math.abs(dx)>40)carouselNav(dx<0?1:-1);
  });
})();
let kitOrder={size:null,price:0,nome:'',cpf:'',wpp:'',cep:'',rua:'',num:'',comp:'',bairro:''};

function openKitDialog(kitName){
  kitOrder={size:null,price:0,nome:'',cpf:'',wpp:'',cep:'',rua:'',num:'',comp:'',bairro:''};
  document.querySelectorAll('.kit-opt').forEach(o=>o.classList.remove('selected'));
  document.getElementById('btn-kt-next1').disabled=true;
  document.getElementById('btn-kt-next1').style.opacity='.5';
  document.getElementById('kit-selected-name').style.display='none';
  // Set próxima sexta
  const prox=proximaSexta();
  document.getElementById('kt-proxima-entrega').textContent=prox;
  document.getElementById('kt-data-entrega').textContent=prox;
  ktStep(1);
  openDialog('dlg-kit');
}

function proximaSexta(){
  const hoje=new Date();
  const dia=hoje.getDay(); // 0=dom, 5=sex
  const diasAte=dia<=5?(5-dia||7):(5-dia+7);
  const sexta=new Date(hoje);
  sexta.setDate(hoje.getDate()+diasAte);
  return sexta.toLocaleDateString('pt-BR',{weekday:'long',day:'2-digit',month:'long'});
}

function selectKitSize(size, el){
  document.querySelectorAll('.kit-opt').forEach(o=>o.classList.remove('selected'));
  el.classList.add('selected');
  kitOrder.size=size;
  kitOrder.price=size==='essencial'?150:220;
  const btn=document.getElementById('btn-kt-next1');
  btn.disabled=false;btn.style.opacity='1';
  const lbl=document.getElementById('kit-selected-name');
  lbl.style.display='block';
  lbl.textContent=`✓ ${size==='essencial'?'Kit Essencial — R$ 150':'Kit Completo — R$ 220'} + R$ 25 frete = R$ ${kitOrder.price+FRETE_FIXO}`;
}

function ktStep(n){
  for(let i=1;i<=4;i++){
    document.getElementById('kt-step'+i).classList.toggle('active',i===n);
    document.getElementById('kts'+i).classList.toggle('active',i===n);
    if(i<n) document.getElementById('kts'+i).classList.add('done');
  }
  if(n===3){
    const total=kitOrder.price+FRETE_FIXO;
    document.getElementById('kt-resumo').innerHTML=`
      <div style="display:flex;justify-content:space-between;margin-bottom:6px"><span style="font-size:13px;color:var(--ink-md)">Kit ${kitOrder.size==='essencial'?'Essencial':'Completo'}</span><span style="font-weight:600">R$ ${kitOrder.price}</span></div>
      <div style="display:flex;justify-content:space-between;margin-bottom:8px"><span style="font-size:13px;color:var(--ink-md)">Frete (Manaus)</span><span style="font-weight:600">R$ ${FRETE_FIXO}</span></div>
      <div style="display:flex;justify-content:space-between;border-top:1px solid var(--border);padding-top:8px"><span style="font-weight:600">Total</span><span style="font-family:'Playfair Display',serif;font-size:18px;font-weight:700;color:var(--ink)">R$ ${total}</span></div>
      <div style="font-size:11px;color:var(--ink-lt);margin-top:6px">Entrega: ${proximaSexta()}</div>`;
  }
}

function maskCPF(el){
  let v=el.value.replace(/\D/g,'');
  if(v.length>11)v=v.slice(0,11);
  v=v.replace(/(\d{3})(\d)/,'$1.$2').replace(/(\d{3})(\d)/,'$1.$2').replace(/(\d{3})(\d{1,2})$/,'$1-$2');
  el.value=v;
}
function maskCEP(el){
  let v=el.value.replace(/\D/g,'');
  if(v.length>8)v=v.slice(0,8);
  if(v.length>5)v=v.slice(0,5)+'-'+v.slice(5);
  el.value=v;
}
async function buscaCEP(){
  const cep=document.getElementById('kt-cep').value.replace(/\D/g,'');
  if(cep.length!==8)return;
  try{
    const r=await fetch(`https://viacep.com.br/ws/${cep}/json/`);
    const d=await r.json();
    if(!d.erro){
      document.getElementById('kt-rua').value=d.logradouro||'';
      document.getElementById('kt-bairro').value=d.bairro||'';
    }
  }catch(e){}
}
function ktValidateAddress(){
  const fields=['kt-nome','kt-cpf','kt-wpp','kt-cep','kt-rua','kt-num','kt-bairro'];
  for(const f of fields){
    if(!document.getElementById(f).value.trim()){
      alert('Preencha todos os campos obrigatórios.');
      document.getElementById(f).focus();
      return;
    }
  }
  kitOrder.nome=document.getElementById('kt-nome').value;
  kitOrder.cpf=document.getElementById('kt-cpf').value;
  kitOrder.wpp=document.getElementById('kt-wpp').value;
  kitOrder.cep=document.getElementById('kt-cep').value;
  kitOrder.rua=document.getElementById('kt-rua').value;
  kitOrder.num=document.getElementById('kt-num').value;
  kitOrder.comp=document.getElementById('kt-comp').value;
  kitOrder.bairro=document.getElementById('kt-bairro').value;
  ktStep(3);
}

async function processKitPayment(){
  const btn=document.getElementById('btn-kt-pay');
  btn.disabled=true;btn.innerHTML='<span class="spin"></span>&nbsp;Processando…';
  const total=kitOrder.price+FRETE_FIXO;
  const email=user?.email||kitOrder.wpp+'@kit.neuroplasticidar.com';
  try{
    const res=await fetch(`${SUPABASE_URL}/functions/v1/smooth-task`,{
      method:'POST',
      headers:{'Content-Type':'application/json','apikey':SUPABASE_ANON,'Authorization':'Bearer '+SUPABASE_ANON},
      body:JSON.stringify({
        action:'create_preference',
        payload:{
          product:{id:'kit-'+kitOrder.size,title:`Kit ${kitOrder.size==='essencial'?'Essencial':'Completo'} Neuroplasticidar`,description:'Kit de brinquedos pedagógicos + frete',price:total},
          user_email:email,
          user_name:kitOrder.nome,
          type:'kit'
        }
      })
    });
  const data=await res.json();
    const initPoint = data.init_point || data.sandbox_init_point;
    if(initPoint){
      // Salvar pedido no Supabase
      await sb.from('leads').insert({
        name:kitOrder.nome,email,whatsapp:kitOrder.wpp,
        symptoms:[],contact_preference:'kit',
        recommended_kit:`Kit ${kitOrder.size} — R$ ${total}`,
        status:'new',
        child_age:JSON.stringify({
          size:kitOrder.size,price:kitOrder.price,frete:FRETE_FIXO,total,
          endereco:`${kitOrder.rua}, ${kitOrder.num} ${kitOrder.comp} — ${kitOrder.bairro} — CEP ${kitOrder.cep}`,
          cpf:kitOrder.cpf,wpp:kitOrder.wpp,
          entrega:proximaSexta(),
          checkout_url:initPoint
        })
      });
      window.location.href = initPoint;
    } else {throw new Error(data.error||'Erro');}
  }catch(e){
    btn.disabled=false;btn.innerHTML='Pagar agora';
    alert('Erro ao processar pagamento. Tente novamente.');
  }
}

/* ══ CUPOM DE DESCONTO ══ */
const CUPONS={'NEURO15':{desconto:0.15,desc:'15% de desconto'},'PRIMEIRA':{desconto:0.10,desc:'10% na 1ª sessão'}};
let cupomAplicado=null;

// Cupom no checkout de materiais/kits
let ckCupomAplicado=null;

async function aplicarCupomCheckout(){
  const codigo=document.getElementById('ck-cupom').value.trim().toUpperCase();
  const msg=document.getElementById('ck-cupom-msg');
  const btn=document.getElementById('ck-cupom-btn');
  if(!codigo){msg.textContent='Digite um código.';msg.style.color='var(--terra)';return;}
  if(!currentProduct){msg.textContent='Erro: produto não selecionado.';msg.style.color='var(--terra)';return;}
  if(!user?.email){msg.textContent='Você precisa estar logada pra usar cupom.';msg.style.color='var(--terra)';return;}

  btn.textContent='Validando…';btn.disabled=true;
  try{
    const r=await fetch(`${SUPABASE_URL}/functions/v1/smooth-task`,{
      method:'POST',
      headers:{'Content-Type':'application/json','apikey':SUPABASE_ANON,'Authorization':'Bearer '+SUPABASE_ANON},
      body:JSON.stringify({action:'validate_coupon',payload:{codigo,email:user.email}})
    });
    const data=await r.json();
    if(!data.ok){
      msg.textContent='✗ '+(data.error||'Cupom inválido');msg.style.color='var(--terra)';
      ckCupomAplicado=null;atualizarResumoCheckout();
      btn.textContent='Aplicar';btn.disabled=false;return;
    }
    ckCupomAplicado={codigo:data.codigo,desconto_pct:data.desconto_pct};
    msg.textContent='✓ Cupom válido — '+data.desconto_pct+'% de desconto';msg.style.color='var(--sage)';
    atualizarResumoCheckout();
    btn.textContent='✓ Aplicado';btn.disabled=true;
    document.getElementById('ck-cupom').disabled=true;
  }catch(e){
    console.error('[cupom] erro:',e);
    msg.textContent='Erro ao validar cupom. Tente novamente.';msg.style.color='var(--terra)';
    btn.textContent='Aplicar';btn.disabled=false;
  }
}

function atualizarResumoCheckout(){
  const box=document.getElementById('ck-resumo-valor');
  if(!ckCupomAplicado||!currentProduct){box.style.display='none';return;}
  const base=Number(currentProduct.price);
  const desconto=Math.round(base*ckCupomAplicado.desconto_pct)/100;
  const total=Math.max(0.01,Number((base-desconto).toFixed(2)));
  document.getElementById('ck-rv-base').textContent='R$ '+base.toFixed(2).replace('.',',');
  document.getElementById('ck-rv-desconto').textContent='− R$ '+desconto.toFixed(2).replace('.',',');
  document.getElementById('ck-rv-total').textContent='R$ '+total.toFixed(2).replace('.',',');
  box.style.display='block';
}

function resetCupomCheckout(){
  ckCupomAplicado=null;
  const inp=document.getElementById('ck-cupom');
  const btn=document.getElementById('ck-cupom-btn');
  const msg=document.getElementById('ck-cupom-msg');
  if(inp){inp.value='';inp.disabled=false;}
  if(btn){btn.textContent='Aplicar';btn.disabled=false;}
  if(msg){msg.textContent='';}
  const box=document.getElementById('ck-resumo-valor');
  if(box)box.style.display='none';
}

function aplicarCupom(){
  const codigo=document.getElementById('sess-cupom').value.trim().toUpperCase();
  const msg=document.getElementById('cupom-msg');
  if(!CUPONS[codigo]){
    msg.textContent='Cupom inválido.';msg.style.color='var(--terra)';
    cupomAplicado=null;atualizarPrecoSessao();return;
  }
  cupomAplicado=CUPONS[codigo];
  msg.textContent='✓ '+cupomAplicado.desc+' aplicado!';
  msg.style.color='var(--sage)';
  atualizarPrecoSessao();
}
function atualizarPrecoSessao(){
  const base=SESSAO_PRICE;
  const desc=cupomAplicado?Math.round(base*cupomAplicado.desconto):0;
  const total=base-desc;
  document.getElementById('sess-price-display').textContent='R$ '+base;
  if(desc>0){
    document.getElementById('sess-desconto-row').style.display='flex';
    document.getElementById('sess-total-row').style.display='flex';
    document.getElementById('sess-desconto-val').textContent='− R$ '+desc;
    document.getElementById('sess-total-val').textContent='R$ '+total;
  } else {
    document.getElementById('sess-desconto-row').style.display='none';
    document.getElementById('sess-total-row').style.display='none';
  }
}
function openSessaoDialog(){
  // Limpa estado anterior
  document.getElementById('sess-cupom').value='';
  document.getElementById('cupom-msg').textContent='';
  document.getElementById('sess-desconto-row').style.display='none';
  document.getElementById('sess-total-row').style.display='none';
  document.getElementById('sess-bairro').value='';
  document.getElementById('sess-idade').value='';
  document.getElementById('sess-preocup').value='';
  cupomAplicado=null;
  // Pré-preenche se logada
  if(user){
    document.getElementById('sess-nome').value=user.name||'';
    document.getElementById('sess-email').value=user.email||'';
  }else{
    document.getElementById('sess-nome').value='';
    document.getElementById('sess-email').value='';
  }
  document.getElementById('sess-wpp').value='';
  openDialog('dlg-sessao');
}

/* ════════ CURADORIA DE KIT (site público) ════════ */
async function openKitCuradoria(){
  // Limpa form
  ['cur-nome','cur-email','cur-wpp','cur-bairro','cur-foco'].forEach(id=>{
    const el=document.getElementById(id);if(el)el.value='';
  });
  document.getElementById('cur-uf').value='AM';
  document.getElementById('cur-cidade').value='Manaus';
  document.getElementById('cur-idade').value='';

  // Popula dropdown de kits do banco
  const sel=document.getElementById('cur-kit-pref');
  try{
    const{data:kits}=await sb.from('kits').select('id,name,emoji,age_range').eq('active',true).order('name');
    sel.innerHTML='<option value="">Quero a sugestão da especialista</option>'+(kits||[]).map(k=>`<option value="${k.id}">${k.emoji||'🎒'} ${k.name}${k.age_range?' ('+k.age_range+')':''}</option>`).join('');
  }catch(e){console.warn('[curadoria] erro carregando kits:',e.message);}

  openDialog('dlg-curadoria');
}

async function solicitarKit(){
  const nome=document.getElementById('cur-nome').value.trim();
  const email=document.getElementById('cur-email').value.trim();
  const wpp=document.getElementById('cur-wpp').value.trim();
  const uf=document.getElementById('cur-uf').value;
  const cidade=document.getElementById('cur-cidade').value.trim();
  const bairro=document.getElementById('cur-bairro').value.trim();
  const idade=document.getElementById('cur-idade').value;
  const kitPref=document.getElementById('cur-kit-pref');
  const kitPrefNome=kitPref.options[kitPref.selectedIndex].text;
  const kitPrefId=kitPref.value;
  const foco=document.getElementById('cur-foco').value.trim();

  if(!nome||!email){alert('Preencha pelo menos nome e e-mail.');return;}
  if(!idade){alert('Selecione a idade da criança.');return;}
  if(!bairro){alert('Informe o bairro pra calcularmos o frete.');return;}

  // Salva lead
  console.log('[curadoria] salvando lead...');
  let leadSalvo=false;
  try{
    const{data,error}=await sb.from('leads').insert({
      name:nome,email,whatsapp:wpp,
      symptoms:foco?[foco]:[],
      contact_preference:'kit',
      recommended_kit:kitPrefId||'curadoria',
      status:'new',
      child_age:JSON.stringify({
        idade,bairro,cidade,uf,
        kit_preferido:kitPrefNome,
        kit_preferido_id:kitPrefId,
        foco
      })
    }).select();
    if(error){
      const errInfo={message:error.message,code:error.code};
      console.error('[curadoria] erro salvando:',JSON.stringify(errInfo));
      alert('⚠️ Não conseguimos salvar agora, mas vou abrir o WhatsApp pra você falar direto com a equipe.');
    } else {
      leadSalvo=true;
      console.log('[curadoria] ✅ lead salvo');
    }
  }catch(e){console.error('[curadoria] exceção:',e);}

  // Hashtags pra CRM
  const slugify=s=>s.normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-zA-Z0-9]/g,'');
  const firstName=nome.split(' ')[0];
  const localStr=`${cidade}/${uf}, bairro ${bairro}`;
  const kitLine=kitPrefId?`\n🎒 Kit de interesse: ${kitPrefNome}`:'\n🎒 Aberta pra sugestões da especialista';
  const focoLine=foco?`\n🎯 Foco: ${foco}`:'';

  const msg=`Oi, equipe Neuroplasticidar! 💜

Tenho interesse em um kit de brinquedos pra meu filho.

Sou ${firstName}, moro em ${localStr} e a criança tem ${idade}.${kitLine}${focoLine}

Gostaria de receber a sugestão personalizada da especialista, com valor do kit e frete pra cá.

📧 ${email}${wpp?`\n📱 ${wpp}`:''}

Aguardo o link de pagamento!

—
#Kit #Curadoria #${slugify(cidade)} #${slugify(bairro)} #Idade${slugify(idade)}`;
  const url=`https://wa.me/5592991479457?text=${encodeURIComponent(msg)}`;

  closeDialog('dlg-curadoria');
  window.open(url,'_blank');
}

async function agendarSessao(){
  const nome=document.getElementById('sess-nome').value.trim();
  const email=document.getElementById('sess-email').value.trim();
  const wpp=document.getElementById('sess-wpp').value.trim();
  const uf=document.getElementById('sess-uf').value;
  const cidade=document.getElementById('sess-cidade').value.trim();
  const bairro=document.getElementById('sess-bairro').value.trim();
  const idade=document.getElementById('sess-idade').value;
  const preocup=document.getElementById('sess-preocup').value.trim();
  const cupom=document.getElementById('sess-cupom').value.trim().toUpperCase();

  if(!nome||!email){alert('Preencha pelo menos nome e e-mail.');return;}
  if(!idade){alert('Selecione a idade da criança.');return;}
  if(!bairro){alert('Informe o bairro pra sabermos a região.');return;}

  const desc=cupomAplicado?cupomAplicado.desc:'';
  const precoFinal=cupomAplicado?SESSAO_PRICE-Math.round(SESSAO_PRICE*cupomAplicado.desconto):SESSAO_PRICE;

  // Salva lead no banco — com log explícito do erro
  console.log('[sessao] tentando salvar lead...',{nome,email,bairro,idade});
  let leadSalvo=false;
  try{
    const{data,error}=await sb.from('leads').insert({
      name:nome,email,whatsapp:wpp,symptoms:preocup?[preocup]:[],
      contact_preference:'sessao_presencial',
      recommended_kit:'sessao',status:'new',
      child_age:JSON.stringify({idade,bairro,cidade,uf,cupom,desconto:desc,preco_final:precoFinal,preocupacao:preocup})
    }).select();
    if(error){
      const errInfo={message:error.message,code:error.code,details:error.details,hint:error.hint};
      console.error('[sessao] ❌ ERRO ao salvar lead:',JSON.stringify(errInfo));
      alert('⚠️ Erro ao salvar sua solicitação:\n\n'+(error.message||JSON.stringify(errInfo))+'\n\nMesmo assim, vou abrir o WhatsApp pra você conversar com a equipe.');
    } else {
      leadSalvo=true;
      console.log('[sessao] ✅ lead salvo:',data);
    }
  }catch(e){
    console.error('[sessao] ❌ exceção:',e);
    alert('⚠️ Erro técnico ao salvar. Vou abrir o WhatsApp mesmo assim.');
  }

  // Slugify pra hashtags
  const slugify=s=>s.normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-zA-Z0-9]/g,'');
  const firstName=nome.split(' ')[0];
  const localStr=`${cidade}/${uf}, bairro ${bairro}`;
  const preocupTxt=preocup||'gostaria de conversar sobre como a sessão presencial pode ajudar';
  const cupomLine=cupom?`\n🎟️ Apliquei o cupom: ${cupom}${desc?` (${desc})`:''}`:'';
  const valorLine=cupom?`💰 Valor com cupom: R$ ${precoFinal}`:`💰 Valor: R$ ${SESSAO_PRICE}/hora`;

  const whatsappMsg=`Oi, equipe Neuroplasticidar! 💜

Tenho interesse em agendar uma sessão presencial em casa.

Sou ${firstName}, moro em ${localStr} e estou acompanhando uma criança de ${idade}. A minha principal preocupação é: ${preocupTxt}.

Gostaria de saber sobre disponibilidade de horários e detalhes do atendimento.

${valorLine}${cupomLine}

📧 ${email}${wpp?`\n📱 ${wpp}`:''}

Aguardo retorno!

—
#Sessao #${slugify(cidade)} #${slugify(bairro)} #Idade${slugify(idade)}`;
  const whatsappUrl=`https://wa.me/5592991479457?text=${encodeURIComponent(whatsappMsg)}`;

  closeDialog('dlg-sessao');
  window.open(whatsappUrl,'_blank');
}

/* ══ ADMIN — PEDIDOS DE KIT ══ */
async function loadAdminPedidosKit(){
  // Pedidos de kit ficam em leads com contact_preference='kit' e child_age JSON
  const{data}=await sb.from('leads').select('*').eq('contact_preference','kit').order('created_at',{ascending:false});
  return data||[];
}

/* DIALOGS */
function openDialog(id){document.getElementById(id).classList.add('open');document.body.style.overflow='hidden';}
function closeDialog(id){document.getElementById(id).classList.remove('open');document.body.style.overflow='';}
document.querySelectorAll('.overlay').forEach(o=>{let mDown=null;o.addEventListener('mousedown',e=>{mDown=e.target===o?o:null;});o.addEventListener('mouseup',e=>{if(mDown===o&&e.target===o)closeDialog(o.id);mDown=null;});});
document.addEventListener('keydown',e=>{if(e.key==='Escape')document.querySelectorAll('.overlay.open').forEach(o=>closeDialog(o.id));});

/* ═══════════ CAMADA NOVA — comportamento comum às páginas ═══════════ */
(function(){
  // menu sólido fora da home: o scroll original tirava a classe no topo
  if(document.body.dataset.nav==='solido'){
    const n=document.getElementById('nav'); if(n){n.classList.add('scrolled');
      window.addEventListener('scroll',()=>n.classList.add('scrolled'),{passive:true});}
  }
  // menu do celular
  const b=document.querySelector('.nav-burger'), m=document.getElementById('mob-menu');
  if(b&&m){
    b.addEventListener('click',()=>{const a=b.getAttribute('aria-expanded')==='true';
      b.setAttribute('aria-expanded',String(!a)); m.classList.toggle('aberto',!a);});
    m.querySelectorAll('a').forEach(x=>x.addEventListener('click',()=>{b.setAttribute('aria-expanded','false');m.classList.remove('aberto');}));
  }
})();
