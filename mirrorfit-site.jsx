import { useState } from "react";
import { Check, X, ChevronDown, ChevronUp, ArrowRight, Zap, Shield, Layers, Camera, Grid, Package, RefreshCw, BarChart2, Lock, Image, Menu } from "lucide-react";

/* ─── STYLES ─────────────────────────────────────────────────── */
const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;0,700;1,400;1,600&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600&display=swap');
  *{box-sizing:border-box;margin:0;padding:0}
  html{scroll-behavior:smooth}
  body{background:#070707;font-family:'DM Sans',sans-serif;color:#F2EDE6;-webkit-font-smoothing:antialiased}
  .serif{font-family:'Cormorant Garamond',serif}
  a{text-decoration:none;color:inherit}
  button{cursor:pointer;font-family:'DM Sans',sans-serif}
  @keyframes fadeUp{from{opacity:0;transform:translateY(22px)}to{opacity:1;transform:translateY(0)}}
  .fade-up{animation:fadeUp .65s ease forwards}
  .d1{animation-delay:.08s;opacity:0}.d2{animation-delay:.16s;opacity:0}.d3{animation-delay:.24s;opacity:0}.d4{animation-delay:.32s;opacity:0}
  .gold{color:#C9A96E}
  .gold-grad{background:linear-gradient(135deg,#F2EDE6 0%,#C9A96E 70%);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text}
  .btn-gold{background:#C9A96E;color:#070707;font-weight:500;padding:13px 30px;border-radius:3px;border:none;font-size:14px;letter-spacing:.3px;transition:all .2s}
  .btn-gold:hover{background:#E8C49A;transform:translateY(-1px);box-shadow:0 6px 24px rgba(201,169,110,.25)}
  .btn-outline{background:transparent;color:#F2EDE6;font-weight:400;padding:13px 30px;border-radius:3px;border:1px solid #252525;font-size:14px;transition:all .2s}
  .btn-outline:hover{border-color:#C9A96E;color:#C9A96E}
  .btn-outline-sm{background:transparent;color:#C9A96E;font-weight:400;padding:8px 18px;border-radius:3px;border:1px solid rgba(201,169,110,.3);font-size:13px;transition:all .2s}
  .btn-outline-sm:hover{border-color:#C9A96E;background:rgba(201,169,110,.05)}
  .card{background:#0D0D0D;border:1px solid #1C1C1C;border-radius:6px}
  .card-hover{transition:border-color .2s,transform .2s}
  .card-hover:hover{border-color:rgba(201,169,110,.25);transform:translateY(-2px)}
  .pill{display:inline-block;background:rgba(201,169,110,.1);border:1px solid rgba(201,169,110,.2);color:#C9A96E;padding:4px 12px;border-radius:20px;font-size:11px;letter-spacing:.6px;text-transform:uppercase}
  .section-tag{font-size:11px;letter-spacing:3px;text-transform:uppercase;color:#C9A96E}
  .divider{border:none;border-top:1px solid #1C1C1C}
  .check-green{color:#4CAF7D}.check-gold{color:#C9A96E}.cross-dim{color:#333}
  table.cmp{width:100%;border-collapse:collapse;font-size:14px}
  table.cmp th{padding:16px 18px;text-align:left;border-bottom:1px solid #1E1E1E;font-weight:500;font-size:13px;color:#888;letter-spacing:.3px}
  table.cmp td{padding:14px 18px;border-bottom:1px solid #141414;vertical-align:middle;color:#C9C5C0}
  table.cmp tr:hover td{background:rgba(255,255,255,.015)}
  .col-hl{background:rgba(201,169,110,.04)}
  .faq-q{padding:20px 0;cursor:pointer;display:flex;justify-content:space-between;align-items:center;font-size:15px;border-bottom:1px solid #1C1C1C}
  .faq-a{padding:4px 0 20px;font-size:14px;color:#7A7570;line-height:1.75;border-bottom:1px solid #1C1C1C}
  ::-webkit-scrollbar{width:4px}
  ::-webkit-scrollbar-track{background:#070707}
  ::-webkit-scrollbar-thumb{background:#252525;border-radius:4px}
  .nav-link{font-size:14px;color:#888;transition:color .2s;padding:6px 0}
  .nav-link:hover{color:#F2EDE6}
  .nav-link.active{color:#F2EDE6}
  .tag-green{background:rgba(76,175,125,.1);color:#4CAF7D;border:1px solid rgba(76,175,125,.2);padding:3px 10px;border-radius:20px;font-size:11px}
`;

/* ─── SHARED ──────────────────────────────────────────────────── */
const Tick = () => <span className="check-green" style={{fontSize:16}}>✓</span>;
const Cross = () => <span className="cross-dim" style={{fontSize:16}}>✗</span>;
const Part = () => <span className="gold" style={{fontSize:13}}>◐</span>;

function FAQ({ items }) {
  const [open, setOpen] = useState(null);
  return (
    <div>
      {items.map((item, i) => (
        <div key={i}>
          <div className="faq-q" onClick={() => setOpen(open === i ? null : i)}>
            <span style={{fontSize:15,color:'#E8E3DC'}}>{item.q}</span>
            {open === i ? <ChevronUp size={16} color="#C9A96E"/> : <ChevronDown size={16} color="#555"/>}
          </div>
          {open === i && <div className="faq-a">{item.a}</div>}
        </div>
      ))}
    </div>
  );
}

function CTABanner({ nav, headline = "Start generating catalogue images today.", sub = "Upload your model. Upload your garment. Generate in minutes." }) {
  return (
    <section style={{background:'#0A0A0A',borderTop:'1px solid #1C1C1C',padding:'80px 24px'}}>
      <div style={{maxWidth:640,margin:'0 auto',textAlign:'center'}}>
        <p className="section-tag" style={{marginBottom:16}}>Get started</p>
        <h2 className="serif" style={{fontSize:'clamp(32px,4vw,48px)',fontWeight:500,lineHeight:1.2,marginBottom:20}}>{headline}</h2>
        <p style={{color:'#7A7570',marginBottom:36,fontSize:15,lineHeight:1.7}}>{sub}</p>
        <div style={{display:'flex',gap:12,justifyContent:'center',flexWrap:'wrap'}}>
          <button className="btn-gold" onClick={() => nav('pricing')}>Start Free Trial</button>
          <button className="btn-outline" onClick={() => nav('how-it-works')}>See How It Works</button>
        </div>
      </div>
    </section>
  );
}

function SectionHeader({ tag, title, sub, center = true }) {
  return (
    <div style={{textAlign:center?'center':'left',marginBottom:56}}>
      {tag && <p className="section-tag" style={{marginBottom:14}}>{tag}</p>}
      <h2 className="serif" style={{fontSize:'clamp(28px,3.5vw,44px)',fontWeight:500,lineHeight:1.2,marginBottom:sub?16:0}}>{title}</h2>
      {sub && <p style={{color:'#7A7570',fontSize:16,maxWidth:560,margin:center?'0 auto':'0',lineHeight:1.7}}>{sub}</p>}
    </div>
  );
}

/* ─── NAV ─────────────────────────────────────────────────────── */
function Nav({ page, nav }) {
  const [open, setOpen] = useState(false);
  const pages = [
    {id:'how-it-works',label:'How It Works'},
    {id:'features',label:'Features'},
    {id:'pricing',label:'Pricing'},
    {id:'swimwear',label:'Swimwear'},
    {id:'ethnicwear',label:'Ethnicwear'},
    {id:'batch',label:'Batch'},
    {id:'vs-vueai',label:'vs Vue.ai'},
    {id:'vs-zyler',label:'vs Zyler'},
    {id:'alternatives',label:'Alternatives'},
  ];
  return (
    <nav style={{position:'sticky',top:0,zIndex:100,background:'rgba(7,7,7,.95)',backdropFilter:'blur(12px)',borderBottom:'1px solid #161616',padding:'0 24px'}}>
      <div style={{maxWidth:1200,margin:'0 auto',display:'flex',alignItems:'center',justifyContent:'space-between',height:60}}>
        <button onClick={() => nav('home')} style={{background:'none',border:'none',cursor:'pointer'}}>
          <span className="serif" style={{fontSize:20,fontWeight:600,letterSpacing:'.5px',color:'#F2EDE6'}}>MirrorFit <span className="gold">AI</span></span>
        </button>
        <div style={{display:'flex',gap:28,alignItems:'center'}} className="desktop-nav" id="desktop-nav">
          {['how-it-works','features','pricing'].map(p => (
            <button key={p} onClick={() => nav(p)} style={{background:'none',border:'none',cursor:'pointer',fontSize:14,color:page===p?'#F2EDE6':'#777',transition:'color .2s',fontFamily:'DM Sans'}}>
              {p==='how-it-works'?'How It Works':p.charAt(0).toUpperCase()+p.slice(1)}
            </button>
          ))}
          <div style={{position:'relative',display:'inline-block'}}>
            <button onClick={() => setOpen(!open)} style={{background:'none',border:'none',cursor:'pointer',fontSize:14,color:'#777',display:'flex',alignItems:'center',gap:4,fontFamily:'DM Sans'}}>
              Compare <ChevronDown size={13}/>
            </button>
            {open && (
              <div style={{position:'absolute',top:'calc(100% + 8px)',left:'50%',transform:'translateX(-50%)',background:'#0F0F0F',border:'1px solid #222',borderRadius:6,padding:8,minWidth:180,zIndex:200}}>
                {[{id:'vs-vueai',l:'MirrorFit vs Vue.ai'},{id:'vs-zyler',l:'MirrorFit vs Zyler'},{id:'alternatives',l:'Best Alternatives'},{id:'vueai-alts',l:'Vue.ai Alternatives'}].map(i => (
                  <button key={i.id} onClick={() => { nav(i.id); setOpen(false); }} style={{display:'block',width:'100%',textAlign:'left',padding:'10px 14px',background:'none',border:'none',cursor:'pointer',fontSize:13,color:'#999',fontFamily:'DM Sans',borderRadius:4,transition:'background .15s'}}
                    onMouseEnter={e=>e.target.style.background='#1A1A1A'} onMouseLeave={e=>e.target.style.background='none'}>
                    {i.l}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
        <button className="btn-gold" style={{padding:'9px 20px',fontSize:13}} onClick={() => nav('pricing')}>Start Free Trial</button>
      </div>
      <style>{`@media(max-width:768px){#desktop-nav{display:none!important}}`}</style>
    </nav>
  );
}

/* ─── FOOTER ──────────────────────────────────────────────────── */
function Footer({ nav }) {
  const cols = [
    { title:'Product', links:[['how-it-works','How It Works'],['features','Features'],['pricing','Pricing'],['batch','Batch Generation'],['model-library','Model Library']] },
    { title:'Fashion Categories', links:[['swimwear','Swimwear & Bikinis'],['ethnicwear','Ethnicwear'],['home','Sleepwear & Loungewear'],['home','Bridalwear'],['home','Shapewear']] },
    { title:'Compare', links:[['vs-vueai','MirrorFit vs Vue.ai'],['vs-zyler','MirrorFit vs Zyler'],['alternatives','Best Alternatives'],['vueai-alts','Vue.ai Alternatives']] },
  ];
  return (
    <footer style={{background:'#050505',borderTop:'1px solid #141414',padding:'60px 24px 32px'}}>
      <div style={{maxWidth:1200,margin:'0 auto'}}>
        <div style={{display:'grid',gridTemplateColumns:'2fr 1fr 1fr 1fr',gap:48,marginBottom:48}}>
          <div>
            <div className="serif" style={{fontSize:22,fontWeight:600,marginBottom:16,color:'#F2EDE6'}}>MirrorFit <span className="gold">AI</span></div>
            <p style={{color:'#555',fontSize:13,lineHeight:1.7,maxWidth:280}}>Professional AI fashion photography for every brand, every model, every outfit. No photoshoot required.</p>
          </div>
          {cols.map(col => (
            <div key={col.title}>
              <p style={{fontSize:11,letterSpacing:'2px',textTransform:'uppercase',color:'#444',marginBottom:16}}>{col.title}</p>
              {col.links.map(([p,l]) => (
                <button key={l} onClick={() => nav(p)} style={{display:'block',background:'none',border:'none',cursor:'pointer',fontSize:13,color:'#555',fontFamily:'DM Sans',padding:'5px 0',textAlign:'left',transition:'color .2s'}}
                  onMouseEnter={e=>e.target.style.color='#999'} onMouseLeave={e=>e.target.style.color='#555'}>{l}</button>
              ))}
            </div>
          ))}
        </div>
        <hr className="divider"/>
        <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',paddingTop:24,flexWrap:'wrap',gap:12}}>
          <p style={{fontSize:12,color:'#333'}}>© 2025 MirrorFit AI. All rights reserved.</p>
          <p style={{fontSize:12,color:'#333'}}>Professional AI Fashion Photography</p>
        </div>
      </div>
      <style>{`@media(max-width:768px){footer>div>div:first-child{grid-template-columns:1fr 1fr!important}}`}</style>
    </footer>
  );
}

/* ─── PRICING DATA ────────────────────────────────────────────── */
const PLANS = [
  {name:'Free Trial',price:'₹0',period:'',desc:'Test before you commit',cta:'Start Free',highlighted:false,
   features:['Limited generations (watermarked)','1 model profile','Standard quality','Basic garment library','No commercial use']},
  {name:'Starter',price:'₹1,999',period:'/month',desc:'For individual sellers',cta:'Start Free Trial',highlighted:false,
   features:['50 generations/month','3 model profiles','No watermark','Standard catalogue renders','Commercial use included','Email support']},
  {name:'Professional',price:'₹4,999',period:'/month',desc:'Most popular — growing brands',cta:'Start Free Trial',highlighted:true,
   features:['200 generations/month','10 model profiles','High-resolution exports','Batch generation','Brand presets','Priority queue','All output formats','Priority support']},
  {name:'Business',price:'₹12,999',period:'/month',desc:'Scale your entire catalogue',cta:'Contact Sales',highlighted:false,
   features:['Unlimited generations','Unlimited model profiles','API access','Team accounts','Bulk SKU processing','Custom brand templates','Advanced safety controls','Dedicated onboarding']},
];

/* ══════════════════════════════════════════════════════════════ */
/*  PAGE: HOME                                                    */
/* ══════════════════════════════════════════════════════════════ */
function HomePage({ nav }) {
  const features = [
    { icon:<Lock size={20}/>, title:'Identity Lock', desc:'Upload once. Every render preserves face structure, skin tone, and body proportions — across every garment, every shoot.' },
    { icon:<Camera size={20}/>, title:'Garment Accuracy', desc:'Color, fabric texture, neckline, straps, seams, embroidery, hemline — all preserved. Not a rough overlay. A real product image.' },
    { icon:<Layers size={20}/>, title:'Multi-Model Library', desc:'Create unlimited reusable model profiles. Switch models, keep garments. Switch garments, keep model. Full creative control.' },
    { icon:<Package size={20}/>, title:'Batch Generation', desc:'Upload 100 garments. Generate front, side, back, marketplace crop, and social versions in one run.' },
    { icon:<Grid size={20}/>, title:'All Fashion Categories', desc:'Swimwear, bikinis, sleepwear, shapewear, sarees, lehengas, bridalwear, bodycon, sheer overlay — no unnecessary refusals.' },
    { icon:<RefreshCw size={20}/>, title:'Quality Review System', desc:'Auto-flags garment issues. One-click fixes for color mismatch, wrong neckline, missing straps, or identity drift.' },
    { icon:<Image size={20}/>, title:'E-Commerce Formats', desc:'Marketplace crop, Instagram 4:5, Story 9:16, website banner, square product image — all exported, ready to publish.' },
    { icon:<BarChart2 size={20}/>, title:'Brand Presets', desc:'Save your preferred background, lighting, pose, and crop ratio. Apply to every new shoot in one click.' },
  ];
  const categories = ['Swimwear & Bikinis','Sarees & Lehengas','Bridalwear','Sleepwear','Shapewear','Bodycon Dresses','Sheer Overlay','Activewear','Gowns & Formalwear','Backless Blouses','Resortwear','Ethnicwear'];
  const faqItems = [
    {q:'How does MirrorFit AI preserve model identity?',a:'Each model profile stores a set of reference images. Our identity lock system uses these references to maintain face structure, skin tone, and body proportions across every render — regardless of which garment is being applied.'},
    {q:'Does MirrorFit support swimwear and revealing fashion?',a:'Yes. MirrorFit is purpose-built for commercial fashion, including swimwear, bikinis, sleepwear, shapewear, bodycon dresses, sheer-overlay garments, and backless blouses. Our safety system distinguishes tasteful catalogue content from explicit material — so your legitimate products are not blocked.'},
    {q:'Can I upload images of a real model I have worked with?',a:'Yes, with authorization. The platform requires you to confirm that you own or have permission to use the model reference images. Consented adult model references from real shoots are fully supported.'},
    {q:'What garment details does the AI preserve?',a:'The render preserves color, fabric texture, neckline, straps, sleeve length, hemline, seams, embroidery, print, transparency level, and drape. The goal is a commercially accurate product image, not an approximation.'},
    {q:'How long does it take to generate an image?',a:'Most renders complete in 1–3 minutes depending on garment complexity and queue volume. Professional and Business plans include priority queue access for faster turnaround.'},
    {q:'Is MirrorFit suitable for Indian ethnic fashion?',a:'Yes. MirrorFit is specifically designed for ethnicwear categories including sarees, lehengas, salwar suits, bridal blouses, backless blouses, and festive dupattas — with accurate drape, embroidery, and fabric texture.'},
  ];
  return (
    <div>
      {/* HERO */}
      <section style={{minHeight:'90vh',display:'flex',alignItems:'center',padding:'80px 24px',background:'radial-gradient(ellipse 70% 50% at 50% 0%, rgba(201,169,110,.06) 0%, transparent 70%)'}}>
        <div style={{maxWidth:1000,margin:'0 auto',textAlign:'center'}}>
          <div className="pill fade-up" style={{marginBottom:24}}>AI Virtual Try-On Platform</div>
          <h1 className="serif fade-up d1" style={{fontSize:'clamp(40px,6vw,82px)',fontWeight:600,lineHeight:1.05,marginBottom:28}}>
            Professional fashion<br/><span className="gold-grad">catalogue images.</span><br/>No photoshoot.
          </h1>
          <p className="fade-up d2" style={{fontSize:18,color:'#7A7570',maxWidth:540,margin:'0 auto 40px',lineHeight:1.7}}>
            Upload an authorized model reference. Upload a garment. Generate a realistic, catalogue-ready product image in minutes.
          </p>
          <div className="fade-up d3" style={{display:'flex',gap:12,justifyContent:'center',flexWrap:'wrap',marginBottom:56}}>
            <button className="btn-gold" onClick={() => nav('pricing')}>Start Free Trial</button>
            <button className="btn-outline" onClick={() => nav('how-it-works')}>How It Works <ArrowRight size={14} style={{display:'inline',marginLeft:4}}/></button>
          </div>
          <div className="fade-up d4" style={{display:'flex',gap:40,justifyContent:'center',flexWrap:'wrap'}}>
            {[['No photoshoot needed','₹50,000+ per shoot → minutes'],['Identity preserved','Same model, every garment'],['All fashion categories','Swimwear, sarees, bridalwear — no refusals']].map(([t,s])=>(
              <div key={t} style={{textAlign:'center'}}>
                <p style={{fontSize:13,color:'#F2EDE6',marginBottom:4}}>{t}</p>
                <p style={{fontSize:12,color:'#555'}}>{s}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* MOCK DEMO STRIP */}
      <section style={{padding:'0 24px 80px'}}>
        <div style={{maxWidth:1100,margin:'0 auto'}}>
          <div style={{background:'#0A0A0A',border:'1px solid #1C1C1C',borderRadius:12,padding:'32px 40px'}}>
            <div style={{display:'grid',gridTemplateColumns:'1fr auto 1fr auto 1fr',gap:24,alignItems:'center'}}>
              {[{label:'Model Reference',sub:'Upload face + body reference',icon:'👤'},{label:'+ Garment',sub:'Upload product image',icon:'👗'},{label:'→ Catalogue Image',sub:'Generated in minutes',icon:'✨'}].map((item,i) => (
                <>
                  {i>0 && <div key={`arr${i}`} style={{textAlign:'center',color:'#333',fontSize:24}}>→</div>}
                  <div key={item.label} style={{background:'#111',border:'1px solid #1E1E1E',borderRadius:8,padding:'24px 20px',textAlign:'center'}}>
                    <div style={{fontSize:32,marginBottom:12}}>{item.icon}</div>
                    <p style={{fontSize:14,color:'#E8E3DC',marginBottom:6,fontWeight:500}}>{item.label}</p>
                    <p style={{fontSize:12,color:'#555'}}>{item.sub}</p>
                  </div>
                </>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* PROBLEM SECTION */}
      <section style={{padding:'80px 24px',background:'#050505',borderTop:'1px solid #141414',borderBottom:'1px solid #141414'}}>
        <div style={{maxWidth:1100,margin:'0 auto'}}>
          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:80,alignItems:'center'}}>
            <div>
              <p className="section-tag" style={{marginBottom:16}}>The problem</p>
              <h2 className="serif" style={{fontSize:'clamp(28px,3vw,42px)',fontWeight:500,lineHeight:1.25,marginBottom:24}}>Fashion sellers are stuck between two bad options</h2>
              <div style={{display:'flex',flexDirection:'column',gap:20}}>
                {[
                  {icon:'📸',title:'Traditional photoshoots',desc:'₹50,000–₹5,00,000 per session. 1–4 weeks to schedule. Inconsistent model appearance. Can\'t afford to reshoot every SKU.'},
                  {icon:'🚫',title:'Generic AI tools',desc:'Refuse swimwear, sleepwear, and shapewear outright. No identity persistence. Poor garment accuracy. Not built for e-commerce.'},
                ].map(item => (
                  <div key={item.title} className="card" style={{padding:'20px 24px',display:'flex',gap:16,alignItems:'flex-start'}}>
                    <span style={{fontSize:22}}>{item.icon}</span>
                    <div>
                      <p style={{fontSize:14,fontWeight:500,color:'#E8E3DC',marginBottom:6}}>{item.title}</p>
                      <p style={{fontSize:13,color:'#666',lineHeight:1.65}}>{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <div style={{background:'#0A0A0A',border:'1px solid rgba(201,169,110,.2)',borderRadius:8,padding:'32px'}}>
                <p className="section-tag" style={{marginBottom:16}}>The MirrorFit solution</p>
                <h3 className="serif" style={{fontSize:28,fontWeight:500,marginBottom:20,lineHeight:1.3}}>One platform that does both</h3>
                <div style={{display:'flex',flexDirection:'column',gap:14}}>
                  {['Upload your own authorized model reference — not a fixed avatar','Preserve identity across every garment and every render','Support swimwear, bikinis, sarees, bridalwear — every commercial category','Batch-generate 100 SKUs in the time it takes to book a studio'].map(item => (
                    <div key={item} style={{display:'flex',gap:12,alignItems:'flex-start'}}>
                      <span className="check-green" style={{marginTop:2,fontSize:16,flexShrink:0}}>✓</span>
                      <p style={{fontSize:14,color:'#B0AAA4',lineHeight:1.6}}>{item}</p>
                    </div>
                  ))}
                </div>
                <button className="btn-gold" style={{marginTop:28,width:'100%'}} onClick={() => nav('pricing')}>Start Free Trial</button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section style={{padding:'96px 24px'}}>
        <div style={{maxWidth:1000,margin:'0 auto'}}>
          <SectionHeader tag="Workflow" title="Three steps to a catalogue image" sub="From garment to publish-ready product photo in minutes." />
          <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:2,position:'relative'}}>
            {[
              {step:'01',title:'Upload Your Model',desc:'Create a model profile with a face reference and full-body image. Set default pose and catalogue style. Save and reuse forever.'},
              {step:'02',title:'Upload Your Garment',desc:'Upload a flat-lay, product shot, or describe the outfit. Add fabric notes, SKU, and styling instructions.'},
              {step:'03',title:'Generate & Export',desc:'Select style, background, and crop. The AI renders a realistic catalogue image. Review, refine, and download.'},
            ].map((s,i)=>(
              <div key={s.step} className="card" style={{padding:'36px 32px',borderRadius:i===0?'6px 0 0 6px':i===2?'0 6px 6px 0':'0',borderRight:i<2?'none':'1px solid #1C1C1C'}}>
                <p className="gold" style={{fontSize:40,fontFamily:'Cormorant Garamond,serif',fontWeight:600,marginBottom:20,lineHeight:1}}>{s.step}</p>
                <h3 style={{fontSize:17,fontWeight:500,marginBottom:12,color:'#E8E3DC'}}>{s.title}</h3>
                <p style={{fontSize:14,color:'#666',lineHeight:1.7}}>{s.desc}</p>
              </div>
            ))}
          </div>
          <div style={{textAlign:'center',marginTop:36}}>
            <button className="btn-outline-sm" onClick={() => nav('how-it-works')}>See detailed walkthrough →</button>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section style={{padding:'0 24px 96px'}}>
        <div style={{maxWidth:1100,margin:'0 auto'}}>
          <SectionHeader tag="Features" title="Everything you need to run a virtual photoshoot" sub="Built for fashion e-commerce professionals, not general image generation." />
          <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:16}}>
            {features.map(f => (
              <div key={f.title} className="card card-hover" style={{padding:'28px 24px'}}>
                <div style={{color:'#C9A96E',marginBottom:16}}>{f.icon}</div>
                <h3 style={{fontSize:14,fontWeight:500,color:'#E8E3DC',marginBottom:10}}>{f.title}</h3>
                <p style={{fontSize:13,color:'#666',lineHeight:1.65}}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CATEGORY SUPPORT */}
      <section style={{padding:'80px 24px',background:'#050505',borderTop:'1px solid #141414',borderBottom:'1px solid #141414'}}>
        <div style={{maxWidth:900,margin:'0 auto',textAlign:'center'}}>
          <p className="section-tag" style={{marginBottom:16}}>Every fashion category</p>
          <h2 className="serif" style={{fontSize:'clamp(28px,3.5vw,44px)',fontWeight:500,lineHeight:1.2,marginBottom:16}}>If it's commercial fashion, <span className="gold-grad">we support it</span></h2>
          <p style={{color:'#666',fontSize:15,maxWidth:540,margin:'0 auto 40px',lineHeight:1.7}}>Unlike generic AI tools that refuse legitimate fashion categories, MirrorFit treats every commercial garment as valid product work.</p>
          <div style={{display:'flex',flexWrap:'wrap',gap:10,justifyContent:'center'}}>
            {categories.map(c => (
              <span key={c} style={{background:'#0F0F0F',border:'1px solid #1E1E1E',borderRadius:4,padding:'8px 16px',fontSize:13,color:'#999'}}>{c}</span>
            ))}
          </div>
          <div style={{marginTop:40,display:'flex',gap:16,justifyContent:'center',flexWrap:'wrap'}}>
            <button className="btn-outline-sm" onClick={() => nav('swimwear')}>Swimwear brands →</button>
            <button className="btn-outline-sm" onClick={() => nav('ethnicwear')}>Ethnicwear sellers →</button>
          </div>
        </div>
      </section>

      {/* PRICING PREVIEW */}
      <section style={{padding:'96px 24px'}}>
        <div style={{maxWidth:1100,margin:'0 auto'}}>
          <SectionHeader tag="Pricing" title="Replace your photoshoot budget" sub="One subscription generates unlimited consistent catalogue images — for less than a single studio session." />
          <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:16,marginBottom:32}}>
            {PLANS.map(plan => (
              <div key={plan.name} className="card" style={{padding:'28px 24px',border:plan.highlighted?'1px solid rgba(201,169,110,.4)':'1px solid #1C1C1C',position:'relative'}}>
                {plan.highlighted && <div style={{position:'absolute',top:-11,left:'50%',transform:'translateX(-50%)'}}><span className="pill" style={{fontSize:10}}>Most Popular</span></div>}
                <p style={{fontSize:12,color:'#666',marginBottom:8}}>{plan.name}</p>
                <div style={{marginBottom:16}}>
                  <span className="serif" style={{fontSize:32,fontWeight:600,color:plan.highlighted?'#C9A96E':'#F2EDE6'}}>{plan.price}</span>
                  <span style={{fontSize:13,color:'#555'}}>{plan.period}</span>
                </div>
                <p style={{fontSize:12,color:'#555',marginBottom:20,lineHeight:1.5}}>{plan.desc}</p>
                <button className={plan.highlighted?'btn-gold':'btn-outline'} style={{width:'100%',marginBottom:20,padding:'10px 16px',fontSize:13}} onClick={() => nav('pricing')}>{plan.cta}</button>
                <div style={{display:'flex',flexDirection:'column',gap:8}}>
                  {plan.features.slice(0,4).map(f => (
                    <div key={f} style={{display:'flex',gap:8,alignItems:'flex-start'}}>
                      <Tick/><span style={{fontSize:12,color:'#777',lineHeight:1.5}}>{f}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <div style={{textAlign:'center'}}>
            <button className="btn-outline-sm" onClick={() => nav('pricing')}>Compare all plans →</button>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section style={{padding:'0 24px 96px'}}>
        <div style={{maxWidth:700,margin:'0 auto'}}>
          <SectionHeader tag="FAQ" title="Common questions" />
          <FAQ items={faqItems}/>
        </div>
      </section>

      <CTABanner nav={nav}/>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════ */
/*  PAGE: HOW IT WORKS                                           */
/* ══════════════════════════════════════════════════════════════ */
function HowItWorksPage({ nav }) {
  return (
    <div>
      <section style={{padding:'80px 24px 60px',textAlign:'center',background:'radial-gradient(ellipse 60% 40% at 50% 0%, rgba(201,169,110,.05) 0%, transparent 60%)'}}>
        <p className="section-tag" style={{marginBottom:16}}>Workflow</p>
        <h1 className="serif" style={{fontSize:'clamp(36px,5vw,64px)',fontWeight:600,lineHeight:1.1,marginBottom:20}}>From garment to catalogue<br/><span className="gold-grad">in minutes</span></h1>
        <p style={{color:'#7A7570',fontSize:16,maxWidth:520,margin:'0 auto',lineHeight:1.7}}>No studio. No model booking. No scheduling. Upload your references and generate professional product images at the speed of a prompt.</p>
      </section>

      <section style={{padding:'60px 24px 80px'}}>
        <div style={{maxWidth:900,margin:'0 auto'}}>
          {[
            {n:'01',title:'Create Your Model Profile',icon:'👤',
             steps:['Navigate to the Model Library','Click "New Model Profile"','Upload a clear face reference image','Upload a front-body and side-body reference image (recommended)','Optionally upload back-body and close-up references','Name the profile (e.g. "Studio Model A", "Swimwear Model")','Set default catalogue style and background preference','Enable Identity Lock to preserve face and body consistency','Save — your model is ready to use across all garments'],
             note:'Higher quality reference images produce stronger identity consistency. We recommend a neutral-pose, good-lighting set of 3 images minimum.'},
            {n:'02',title:'Upload Your Garment',icon:'👗',
             steps:['Go to the Garment Library','Upload your product image (flat-lay, hanger, or worn)','Add the product name and SKU','Select the garment category (swimwear, saree, bodycon dress, etc.)','Add fabric type and color notes','Add any styling notes (e.g. "thin straps", "sheer overlay", "embroidered hem")','For best results, upload a front view and a back or detail view'],
             note:'MirrorFit reads your garment image to extract color, texture, silhouette, and details. The more accurate your image, the better the output.'},
            {n:'03',title:'Set Up the Try-On Studio',icon:'⚙️',
             steps:['Open the Try-On Studio','Select your saved model profile','Select your uploaded garment','Choose a render style (Clean Studio, Premium E-Commerce, Luxury Editorial, etc.)','Set background preference (neutral, beach, festive, etc.)','Set pose (standing neutral, walking, editorial, etc.)','Set camera angle (full body, three-quarter, close-up)','Choose output size and number of variations','Enable Prompt Builder for automatic prompt optimization (recommended)'],
             note:'The Prompt Builder converts your selections into a precise, safe generation prompt automatically. You can also write custom prompts.'},
            {n:'04',title:'Generate and Review',icon:'✨',
             steps:['Click "Generate"','The Render Engine creates your catalogue image (1–3 minutes)','The Quality Review System checks for common issues automatically','Review the result: identity accuracy, garment accuracy, pose, lighting','Use one-click refinements if needed (fix neckline, adjust identity, improve fabric)','Approve and export in your chosen format'],
             note:'Professional and Business plan users have priority queue access for faster generation.'},
            {n:'05',title:'Export and Publish',icon:'📤',
             steps:['Download as PNG, JPG, or WebP','Export marketplace crop (Amazon, Myntra, Meesho)','Export Instagram 4:5 and Story 9:16 crops','Export website banner and square product image','Batch export all crops simultaneously','Organize outputs in your Brand Folder for team access'],
             note:'All paid plan exports include commercial usage rights.'},
          ].map((phase,i) => (
            <div key={phase.n} style={{display:'grid',gridTemplateColumns:'80px 1fr',gap:32,marginBottom:56,position:'relative'}}>
              {i < 4 && <div style={{position:'absolute',left:36,top:64,width:2,height:'calc(100% - 32px)',background:'linear-gradient(to bottom, #1E1E1E, transparent)'}}/>}
              <div style={{textAlign:'center',paddingTop:4}}>
                <div style={{width:52,height:52,background:'#0F0F0F',border:'1px solid rgba(201,169,110,.25)',borderRadius:'50%',display:'flex',alignItems:'center',justifyContent:'center',margin:'0 auto 8px',fontSize:22}}>{phase.icon}</div>
                <p className="gold" style={{fontFamily:'Cormorant Garamond,serif',fontSize:13,fontWeight:600}}>{phase.n}</p>
              </div>
              <div>
                <h3 style={{fontSize:22,fontWeight:500,color:'#E8E3DC',marginBottom:20,fontFamily:'Cormorant Garamond,serif'}}>{phase.title}</h3>
                <div className="card" style={{padding:'24px 28px',marginBottom:16}}>
                  <ol style={{paddingLeft:20,display:'flex',flexDirection:'column',gap:10}}>
                    {phase.steps.map(s => (
                      <li key={s} style={{fontSize:14,color:'#888',lineHeight:1.6}}>{s}</li>
                    ))}
                  </ol>
                </div>
                <div style={{background:'rgba(201,169,110,.05)',border:'1px solid rgba(201,169,110,.15)',borderRadius:6,padding:'14px 18px'}}>
                  <p style={{fontSize:13,color:'#9A8A6E',lineHeight:1.65}}>💡 {phase.note}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
      <CTABanner nav={nav}/>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════ */
/*  PAGE: FEATURES                                               */
/* ══════════════════════════════════════════════════════════════ */
function FeaturesPage({ nav }) {
  const modules = [
    {title:'Model Library',icon:'👤',features:[
      ['Multi-model profiles','Create and save unlimited reusable model identities'],
      ['Identity Lock','Preserves face structure, skin tone, and body proportions across all renders'],
      ['Reference image upload','Upload face, front-body, side-body, back-body, and close-up references'],
      ['Adult confirmation','Required consent step for all model profiles'],
      ['Usage authorization','Confirm ownership or permission for all model references'],
      ['Default style presets','Save preferred pose, background, and catalogue style per model'],
      ['Body proportion lock','Prevent body shape changes between renders'],
      ['Consistency previews','Generate test previews before committing to a model profile'],
    ]},
    {title:'Garment Library',icon:'👗',features:[
      ['Multi-image garment profiles','Upload front, back, and detail shots per garment'],
      ['SKU and metadata tagging','Add product name, SKU, fabric, color, category, and notes'],
      ['Garment category system','Correctly classifies swimwear, ethnicwear, sleepwear, and all fashion categories'],
      ['Prompt Builder','Auto-converts garment metadata into precise generation prompts'],
      ['Transparent PNG support','Handles product cutouts and flat-lays equally well'],
      ['Fabric type notes','Specify satin, chiffon, lace, mesh, cotton, jersey, and more'],
      ['Styling notes','Add embroidery details, strap types, hemline notes, and cut-out placements'],
    ]},
    {title:'Try-On Studio',icon:'✨',features:[
      ['Model + garment pairing','Select any model profile and any garment for a render'],
      ['Render style selection','Clean Studio, Premium E-Commerce, Luxury Editorial, Beachwear, Bridal, and more'],
      ['Pose options','Neutral standing, walking, editorial, seated, and custom references'],
      ['Camera angle control','Full body, three-quarter, close-up fabric detail, and back view'],
      ['Background selection','Neutral studio, white, gradient, beach, festive, outdoor, and more'],
      ['Lighting control','Softbox, natural window, editorial, high-key, warm, and cool options'],
      ['Multiple variations','Generate 2–6 variations per prompt for comparison'],
      ['Front, side, and back views','Generate complete product image sets in one session'],
    ]},
    {title:'Batch Generation',icon:'⚡',features:[
      ['Bulk SKU processing','Upload 100+ garments and generate against a single model profile in one run'],
      ['Multi-angle sets','Generate front, side, back, marketplace, and social crops per SKU automatically'],
      ['Brand preset application','Apply a saved brand preset to every garment in the batch'],
      ['Queue management','Track batch progress and manage job priorities'],
      ['Bulk export','Download all outputs in one compressed archive'],
      ['CSV SKU support','Import garment metadata from a spreadsheet'],
    ]},
    {title:'Quality Review',icon:'🔍',features:[
      ['Identity drift detection','Flags renders where the model face or skin tone has shifted'],
      ['Garment accuracy checks','Detects color mismatch, missing straps, wrong neckline, or distorted print'],
      ['One-click fixes','Single-button regeneration with targeted improvement prompts'],
      ['Pose naturalness check','Flags unnatural hand positions, posture issues, or fabric clipping'],
      ['Output suitability check','Flags over-sexualized presentation for catalogue standards review'],
      ['Comparison view','Side-by-side garment vs. render for manual review'],
    ]},
    {title:'Export & Output',icon:'📤',features:[
      ['PNG, JPG, WebP','All standard web formats with quality settings'],
      ['Transparent background','When technically possible, background-removed output'],
      ['Marketplace crops','Amazon, Myntra, Meesho, Flipkart-standard aspect ratios'],
      ['Instagram 4:5','Feed-ready product images'],
      ['Story 9:16','Full-bleed story and reel format'],
      ['Square 1:1','Universal product image format'],
      ['Website banner','Wide-format hero and category banner crops'],
      ['High-resolution export','Professional and Business plans include full-resolution output'],
    ]},
  ];
  return (
    <div>
      <section style={{padding:'80px 24px 60px',textAlign:'center',background:'radial-gradient(ellipse 60% 40% at 50% 0%, rgba(201,169,110,.05) 0%, transparent 60%)'}}>
        <p className="section-tag" style={{marginBottom:16}}>Platform</p>
        <h1 className="serif" style={{fontSize:'clamp(36px,5vw,64px)',fontWeight:600,lineHeight:1.1,marginBottom:20}}>Every feature your<br/><span className="gold-grad">fashion brand needs</span></h1>
        <p style={{color:'#7A7570',fontSize:16,maxWidth:520,margin:'0 auto',lineHeight:1.7}}>Built from the ground up for fashion e-commerce. Not adapted from a general-purpose image tool.</p>
      </section>
      <section style={{padding:'60px 24px 96px'}}>
        <div style={{maxWidth:1100,margin:'0 auto',display:'flex',flexDirection:'column',gap:48}}>
          {modules.map(mod => (
            <div key={mod.title}>
              <div style={{display:'flex',alignItems:'center',gap:12,marginBottom:24}}>
                <span style={{fontSize:24}}>{mod.icon}</span>
                <h2 className="serif" style={{fontSize:28,fontWeight:500,color:'#E8E3DC'}}>{mod.title}</h2>
              </div>
              <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:12}}>
                {mod.features.map(([name,desc]) => (
                  <div key={name} className="card" style={{padding:'20px 22px'}}>
                    <div style={{display:'flex',gap:8,marginBottom:8}}>
                      <span className="check-green" style={{fontSize:14,flexShrink:0,marginTop:2}}>✓</span>
                      <p style={{fontSize:14,fontWeight:500,color:'#E8E3DC'}}>{name}</p>
                    </div>
                    <p style={{fontSize:13,color:'#555',lineHeight:1.6,paddingLeft:22}}>{desc}</p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>
      <CTABanner nav={nav}/>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════ */
/*  PAGE: PRICING                                                */
/* ══════════════════════════════════════════════════════════════ */
function PricingPage({ nav }) {
  const faq = [
    {q:'Can I cancel at any time?',a:'Yes. All paid plans are month-to-month by default. Cancel anytime from your dashboard. No cancellation fees.'},
    {q:'What counts as a generation?',a:'One generation = one render attempt. Refinements using one-click fixes count as a new generation. Batch generates count per garment × per view.'},
    {q:'Do I own the images I generate?',a:'Yes. All paid plan outputs include full commercial usage rights. Free Trial outputs are watermarked and not for commercial use.'},
    {q:'Is there an annual plan?',a:'Yes. Annual plans are available at a 20% discount versus monthly billing. Contact us for details.'},
    {q:'What happens when I hit my generation limit?',a:'You can purchase additional generation credits or upgrade to the next plan. Unused credits do not roll over monthly.'},
    {q:'Do you offer refunds?',a:'We offer a 7-day money-back guarantee on your first paid subscription month. After that, refunds are available for unused credits in exceptional circumstances.'},
  ];
  const rows = [
    ['Generations / month','Limited','50','200','Unlimited'],
    ['Model profiles','1','3','10','Unlimited'],
    ['Identity Lock','✓','✓','✓','✓'],
    ['Garment Library','Basic','Yes','Yes','Unlimited'],
    ['Batch generation','✗','✗','✓','✓'],
    ['High-res exports','✗','✗','✓','✓'],
    ['Brand presets','✗','✗','✓','✓'],
    ['All output formats','✗','✗','✓','✓'],
    ['API access','✗','✗','✗','✓'],
    ['Team accounts','✗','✗','✗','✓'],
    ['Priority queue','✗','✗','✓','✓'],
    ['Watermark','Yes','No','No','No'],
    ['Commercial use','No','Yes','Yes','Yes'],
    ['Support','—','Email','Priority','Dedicated'],
  ];
  return (
    <div>
      <section style={{padding:'80px 24px 60px',textAlign:'center',background:'radial-gradient(ellipse 60% 40% at 50% 0%, rgba(201,169,110,.05) 0%, transparent 60%)'}}>
        <p className="section-tag" style={{marginBottom:16}}>Pricing</p>
        <h1 className="serif" style={{fontSize:'clamp(36px,5vw,64px)',fontWeight:600,lineHeight:1.1,marginBottom:20}}>Replace your<br/><span className="gold-grad">photoshoot budget</span></h1>
        <p style={{color:'#7A7570',fontSize:16,maxWidth:500,margin:'0 auto',lineHeight:1.7}}>One subscription generates consistent catalogue images for every SKU — for less than a single studio session.</p>
      </section>

      {/* PLAN CARDS */}
      <section style={{padding:'60px 24px'}}>
        <div style={{maxWidth:1100,margin:'0 auto'}}>
          <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:16,marginBottom:60}}>
            {PLANS.map(plan => (
              <div key={plan.name} className="card" style={{padding:'32px 26px',border:plan.highlighted?'1px solid rgba(201,169,110,.4)':'1px solid #1C1C1C',position:'relative',display:'flex',flexDirection:'column'}}>
                {plan.highlighted && <div style={{position:'absolute',top:-12,left:'50%',transform:'translateX(-50%)'}}><span className="pill">Most Popular</span></div>}
                <p style={{fontSize:11,letterSpacing:'2px',textTransform:'uppercase',color:'#555',marginBottom:10}}>{plan.name}</p>
                <div style={{marginBottom:6}}>
                  <span className="serif" style={{fontSize:38,fontWeight:600,color:plan.highlighted?'#C9A96E':'#F2EDE6'}}>{plan.price}</span>
                  <span style={{fontSize:13,color:'#444'}}>{plan.period}</span>
                </div>
                <p style={{fontSize:13,color:'#555',marginBottom:24,lineHeight:1.5}}>{plan.desc}</p>
                <button className={plan.highlighted?'btn-gold':'btn-outline'} style={{width:'100%',marginBottom:24,padding:'12px 16px',fontSize:13}} onClick={() => nav('home')}>{plan.cta}</button>
                <div style={{display:'flex',flexDirection:'column',gap:10,flex:1}}>
                  {plan.features.map(f => (
                    <div key={f} style={{display:'flex',gap:8,alignItems:'flex-start'}}>
                      <Tick/><span style={{fontSize:13,color:'#777',lineHeight:1.5}}>{f}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* COMPARISON TABLE */}
          <div className="card" style={{padding:0,overflow:'hidden'}}>
            <div style={{padding:'24px 28px',borderBottom:'1px solid #1C1C1C'}}>
              <h2 className="serif" style={{fontSize:24,fontWeight:500}}>Full plan comparison</h2>
            </div>
            <div style={{overflowX:'auto'}}>
              <table className="cmp">
                <thead>
                  <tr style={{background:'#0A0A0A'}}>
                    <th style={{width:'36%'}}>Feature</th>
                    <th>Free Trial</th>
                    <th>Starter</th>
                    <th style={{background:'rgba(201,169,110,.06)'}}>Professional</th>
                    <th>Business</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map(([feat,...vals]) => (
                    <tr key={feat}>
                      <td style={{color:'#AAA5A0'}}>{feat}</td>
                      {vals.map((v,i) => (
                        <td key={i} className={i===2?'col-hl':''} style={{textAlign:'center'}}>
                          {v==='✓'?<Tick/>:v==='✗'?<span style={{color:'#2A2A2A',fontSize:16}}>✗</span>:<span style={{fontSize:13}}>{v}</span>}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      <section style={{padding:'0 24px 96px'}}>
        <div style={{maxWidth:700,margin:'0 auto'}}>
          <SectionHeader tag="FAQ" title="Pricing questions" />
          <FAQ items={faq}/>
        </div>
      </section>
      <CTABanner nav={nav} headline="Start generating today — free trial, no credit card." sub="Get your first catalogue images before you decide on a plan."/>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════ */
/*  PAGE: SWIMWEAR                                               */
/* ══════════════════════════════════════════════════════════════ */
function SwimwearPage({ nav }) {
  const faq = [
    {q:'Does MirrorFit AI actually support swimwear and bikini images?',a:'Yes. MirrorFit is specifically built to handle swimwear, bikinis, one-piece swimsuits, monokinis, and beachwear catalogue images. Our safety system classifies these as commercial fashion — not unsafe content — so they are not refused or restricted.'},
    {q:'Why do other AI tools refuse swimwear images?',a:'Most general-purpose AI image tools apply blanket restrictions to revealing garments, treating commercial swimwear and bikinis as potentially unsafe content. MirrorFit\'s Safety Classifier is specifically trained on commercial fashion intent, distinguishing legitimate catalogue work from explicit content.'},
    {q:'What swimwear garment details are preserved in the render?',a:'The render preserves bikini top and bottom design, tie details, hardware, cup structure, print, color, fabric texture, elastic edges, coverage level, and strap placement — everything that defines the product.'},
    {q:'What model poses work best for swimwear?',a:'Standing neutral, three-quarter turn, and walking poses work well for swimwear catalogues. MirrorFit includes beachwear-specific preset styles that optimize lighting, background, and pose for swimwear product images.'},
    {q:'Can I generate a complete beachwear lookbook?',a:'Yes. Use the Batch Generation feature to run multiple swimwear garments against your saved model profile. Select the Beachwear Catalogue preset and generate front, back, and detail views for each piece in one run.'},
  ];
  return (
    <div>
      <section style={{padding:'80px 24px 60px',textAlign:'center',background:'radial-gradient(ellipse 70% 50% at 50% 0%, rgba(201,169,110,.07) 0%, transparent 65%)'}}>
        <p className="section-tag" style={{marginBottom:16}}>Swimwear & Beachwear</p>
        <h1 className="serif" style={{fontSize:'clamp(36px,5vw,68px)',fontWeight:600,lineHeight:1.1,marginBottom:20}}>AI catalogue images<br/>for your <span className="gold-grad">swimwear brand</span></h1>
        <p style={{color:'#7A7570',fontSize:17,maxWidth:540,margin:'0 auto 40px',lineHeight:1.7}}>Generate professional beachwear catalogue shoots — bikinis, one-pieces, monokinis, and resortwear — without a beach, a studio, or a photoshoot budget.</p>
        <div style={{display:'flex',gap:12,justifyContent:'center',flexWrap:'wrap'}}>
          <button className="btn-gold" onClick={() => nav('pricing')}>Start Free Trial</button>
          <button className="btn-outline" onClick={() => nav('how-it-works')}>How It Works</button>
        </div>
      </section>

      {/* THE PROBLEM */}
      <section style={{padding:'80px 24px',background:'#050505',borderTop:'1px solid #141414',borderBottom:'1px solid #141414'}}>
        <div style={{maxWidth:900,margin:'0 auto'}}>
          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:60,alignItems:'center'}}>
            <div>
              <p className="section-tag" style={{marginBottom:16}}>The problem</p>
              <h2 className="serif" style={{fontSize:'clamp(26px,3vw,38px)',fontWeight:500,lineHeight:1.3,marginBottom:20}}>Why swimwear brands struggle with AI image tools</h2>
              <p style={{color:'#666',fontSize:15,lineHeight:1.75,marginBottom:20}}>Most AI image tools classify bikinis, swimsuits, and beachwear as potentially unsafe content, triggering automatic refusals — even for legitimate commercial fashion. Swimwear brand owners hear "content policy violation" when they try to generate what is, legally and commercially, a normal product photo.</p>
              <p style={{color:'#666',fontSize:15,lineHeight:1.75}}>This is a genuine gap in the market. Swimwear is a multi-billion dollar global category. It deserves the same AI tooling support as a shirt.</p>
            </div>
            <div style={{display:'flex',flexDirection:'column',gap:16}}>
              {[
                {q:'"Generate a bikini catalogue image for my store"',res:'❌ Refused by most AI tools'},
                {q:'"Create a beachwear product shoot with my model"',res:'❌ Refused by most AI tools'},
                {q:'"Render this one-piece swimsuit for my brand"',res:'✅ Supported by MirrorFit AI'},
                {q:'"Generate a full bikini set catalogue image"',res:'✅ Supported by MirrorFit AI'},
              ].map(item => (
                <div key={item.q} className="card" style={{padding:'16px 20px'}}>
                  <p style={{fontSize:13,color:'#888',marginBottom:8,fontStyle:'italic'}}>"{item.q}"</p>
                  <p style={{fontSize:13,fontWeight:500,color:item.res.startsWith('✅')?'#4CAF7D':'#666'}}>{item.res}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section style={{padding:'96px 24px'}}>
        <div style={{maxWidth:1000,margin:'0 auto'}}>
          <SectionHeader tag="Swimwear Features" title="Everything a swimwear brand needs" />
          <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:20}}>
            {[
              {icon:'🩱',title:'Full swimwear category support',desc:'Bikini sets, one-pieces, monokinis, tankinis, swim shorts, sarongs, beach cover-ups, resort dresses, and cruise wear — all supported.'},
              {icon:'🎨',title:'Accurate garment rendering',desc:'Ties, hardware, print, cup structure, elastic edges, coverage level, strap placement — all preserved in the render.'},
              {icon:'🏖️',title:'Beachwear catalogue presets',desc:'Pre-configured background, lighting, pose, and framing optimized for commercial beachwear product photography.'},
              {icon:'👤',title:'Identity-locked adult models',desc:'Your model profile — with confirmed adult status — preserved across every bikini and swimwear render.'},
              {icon:'⚡',title:'Batch generation for full collections',desc:'Upload your entire seasonal swimwear collection and generate a complete catalogue set in one run.'},
              {icon:'📱',title:'Social-ready crops',desc:'Instagram 4:5, Story 9:16, and square crops for each swimwear image — ready for your store and social channels.'},
            ].map(f => (
              <div key={f.title} className="card card-hover" style={{padding:'28px 24px'}}>
                <div style={{fontSize:28,marginBottom:16}}>{f.icon}</div>
                <h3 style={{fontSize:15,fontWeight:500,color:'#E8E3DC',marginBottom:10}}>{f.title}</h3>
                <p style={{fontSize:13,color:'#666',lineHeight:1.7}}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section style={{padding:'0 24px 96px'}}>
        <div style={{maxWidth:700,margin:'0 auto'}}>
          <SectionHeader tag="FAQ" title="Swimwear brand questions" />
          <FAQ items={faq}/>
        </div>
      </section>
      <CTABanner nav={nav} headline="Generate your swimwear catalogue today." sub="Professional beachwear product images. No studio, no model fees, no refusals."/>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════ */
/*  PAGE: ETHNICWEAR                                             */
/* ══════════════════════════════════════════════════════════════ */
function EthnicwearPage({ nav }) {
  const categories = [
    ['Sarees','With accurate pleats, pallu drape, and blouse details'],
    ['Lehengas','Embroidery, skirt flare, dupatta placement preserved'],
    ['Bridal Blouses','Neckline, back design, sleeve, and embroidery accuracy'],
    ['Salwar Suits','Kurta length, salwar silhouette, dupatta style'],
    ['Kurtis','Neckline, sleeve, hemline, and print rendering'],
    ['Backless Blouses','Back design, tie detail, hook placement — accurate renders'],
    ['Sleeveless Blouses','Neckline, armhole, and embroidery detail'],
    ['Festive Dupattas','Embroidery, border, and drape rendering'],
    ['Embroidered Garments','Zari, thread, sequence, and mirror work detail'],
  ];
  return (
    <div>
      <section style={{padding:'80px 24px 60px',textAlign:'center',background:'radial-gradient(ellipse 70% 50% at 50% 0%, rgba(201,169,110,.07) 0%, transparent 65%)'}}>
        <p className="section-tag" style={{marginBottom:16}}>Indian & Ethnicwear</p>
        <h1 className="serif" style={{fontSize:'clamp(36px,5vw,68px)',fontWeight:600,lineHeight:1.1,marginBottom:20}}>AI catalogue images for<br/><span className="gold-grad">Indian fashion sellers</span></h1>
        <p style={{color:'#7A7570',fontSize:17,maxWidth:540,margin:'0 auto 40px',lineHeight:1.7}}>Generate professional saree, lehenga, bridal blouse, and ethnicwear catalogue images with accurate drape, embroidery, and fabric rendering — no studio required.</p>
        <button className="btn-gold" onClick={() => nav('pricing')}>Start Free Trial</button>
      </section>

      <section style={{padding:'80px 24px',background:'#050505',borderTop:'1px solid #141414',borderBottom:'1px solid #141414'}}>
        <div style={{maxWidth:1000,margin:'0 auto'}}>
          <SectionHeader tag="The challenge" title="Why ethnicwear needs specialist treatment" sub="Sarees, lehengas, and bridal blouses have complex drape, embroidery, and structural details that generic AI tools render poorly or refuse entirely." center={false}/>
          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:40}}>
            <div>
              <h3 style={{fontSize:16,color:'#888',marginBottom:16,fontWeight:400}}>What generic AI tools get wrong:</h3>
              {['Ignore pallu drape and pleat direction on sarees','Distort lehenga skirt flare and embroidery','Can\'t render backless blouse back designs accurately','Poor fabric texture for silk, chiffon, and georgette','Refuse "revealing" elements like backless blouses and sleeveless designs'].map(item => (
                <div key={item} style={{display:'flex',gap:10,marginBottom:12}}>
                  <span style={{color:'#444',fontSize:16,flexShrink:0}}>✗</span>
                  <p style={{fontSize:14,color:'#666',lineHeight:1.6}}>{item}</p>
                </div>
              ))}
            </div>
            <div>
              <h3 style={{fontSize:16,color:'#C9A96E',marginBottom:16,fontWeight:400}}>What MirrorFit does right:</h3>
              {['Accurate saree drape: pallu fall, pleats, and blouse positioning','Lehenga skirt volume, embroidery, and dupatta placement','Backless and sleeveless blouse back design rendering','Correct fabric behavior for silk, satin, chiffon, and georgette','Supports all commercial ethnicwear without unnecessary refusals'].map(item => (
                <div key={item} style={{display:'flex',gap:10,marginBottom:12}}>
                  <Tick/><p style={{fontSize:14,color:'#888',lineHeight:1.6}}>{item}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section style={{padding:'96px 24px'}}>
        <div style={{maxWidth:1000,margin:'0 auto'}}>
          <SectionHeader tag="Category support" title="Every Indian fashion category" />
          <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:12}}>
            {categories.map(([name,desc]) => (
              <div key={name} className="card" style={{padding:'20px 22px'}}>
                <h3 style={{fontSize:14,fontWeight:500,color:'#E8E3DC',marginBottom:8}}>{name}</h3>
                <p style={{fontSize:13,color:'#555',lineHeight:1.6}}>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      <CTABanner nav={nav} headline="Generate your ethnicwear catalogue today." sub="Sarees, lehengas, bridal blouses, and more — professional renders, no studio."/>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════ */
/*  PAGE: BATCH GENERATION                                       */
/* ══════════════════════════════════════════════════════════════ */
function BatchPage({ nav }) {
  return (
    <div>
      <section style={{padding:'80px 24px 60px',textAlign:'center',background:'radial-gradient(ellipse 60% 40% at 50% 0%, rgba(201,169,110,.05) 0%, transparent 60%)'}}>
        <p className="section-tag" style={{marginBottom:16}}>Batch Generation</p>
        <h1 className="serif" style={{fontSize:'clamp(36px,5vw,64px)',fontWeight:600,lineHeight:1.1,marginBottom:20}}>Generate your entire catalogue<br/><span className="gold-grad">in one run</span></h1>
        <p style={{color:'#7A7570',fontSize:16,maxWidth:520,margin:'0 auto 40px',lineHeight:1.7}}>Upload 100 garments. Select a model. Run batch. Get front, side, back, marketplace, and social crops for every SKU — automatically.</p>
        <button className="btn-gold" onClick={() => nav('pricing')}>Available on Professional+</button>
      </section>
      <section style={{padding:'60px 24px 80px'}}>
        <div style={{maxWidth:1000,margin:'0 auto'}}>
          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:60,alignItems:'center',marginBottom:80}}>
            <div>
              <h2 className="serif" style={{fontSize:36,fontWeight:500,marginBottom:20,lineHeight:1.3}}>A traditional photoshoot for 100 garments takes weeks. Batch generation takes hours.</h2>
              <div style={{display:'flex',flexDirection:'column',gap:16}}>
                {[['📸','Traditional approach','Book studio × 5 sessions. Hire model × 5 days. Post-process 100 images × 2 days each. Total: 4–8 weeks, ₹3–10 lakh.'],['⚡','MirrorFit Batch','Upload 100 garments. Select model profile. Select brand preset. Click Run. Total: 2–4 hours, included in your plan.']].map(([icon,title,desc])=>(
                  <div key={title} className="card" style={{padding:'20px 24px'}}>
                    <div style={{display:'flex',gap:12,alignItems:'flex-start'}}>
                      <span style={{fontSize:22}}>{icon}</span>
                      <div>
                        <p style={{fontSize:14,fontWeight:500,color:'#E8E3DC',marginBottom:6}}>{title}</p>
                        <p style={{fontSize:13,color:'#666',lineHeight:1.65}}>{desc}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <div style={{background:'#0A0A0A',border:'1px solid rgba(201,169,110,.2)',borderRadius:8,padding:'32px'}}>
                <h3 className="serif" style={{fontSize:24,fontWeight:500,marginBottom:24}}>Batch workflow</h3>
                {['Upload garment images (or import from Garment Library)','Select a saved model profile','Choose a Brand Preset (style, background, lighting, pose)','Select which views to generate: front, side, back, close-up','Select export formats: marketplace, Instagram, Story, square','Click "Run Batch"','Track progress in the job queue','Download all outputs as a single archive'].map((s,i) => (
                  <div key={s} style={{display:'flex',gap:14,marginBottom:14,alignItems:'flex-start'}}>
                    <span className="gold" style={{fontFamily:'Cormorant Garamond,serif',fontSize:16,fontWeight:600,flexShrink:0,marginTop:1}}>{String(i+1).padStart(2,'0')}</span>
                    <p style={{fontSize:14,color:'#888',lineHeight:1.6}}>{s}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:16}}>
            {[['100+','Garments per batch run'],['5','View types per garment'],['6','Export format options'],['Hours','vs weeks for studio shoots']].map(([n,l])=>(
              <div key={l} className="card" style={{padding:'28px 24px',textAlign:'center'}}>
                <p className="serif gold" style={{fontSize:48,fontWeight:600,lineHeight:1,marginBottom:8}}>{n}</p>
                <p style={{fontSize:13,color:'#666'}}>{l}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      <CTABanner nav={nav} headline="Batch-generate your entire product catalogue." sub="Available on Professional and Business plans."/>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════ */
/*  PAGE: MODEL LIBRARY                                          */
/* ══════════════════════════════════════════════════════════════ */
function ModelLibraryPage({ nav }) {
  return (
    <div>
      <section style={{padding:'80px 24px 60px',textAlign:'center',background:'radial-gradient(ellipse 60% 40% at 50% 0%, rgba(201,169,110,.05) 0%, transparent 60%)'}}>
        <p className="section-tag" style={{marginBottom:16}}>Model Library</p>
        <h1 className="serif" style={{fontSize:'clamp(36px,5vw,64px)',fontWeight:600,lineHeight:1.1,marginBottom:20}}>Your models.<br/><span className="gold-grad">Your identity. Forever.</span></h1>
        <p style={{color:'#7A7570',fontSize:16,maxWidth:520,margin:'0 auto 40px',lineHeight:1.7}}>Upload authorized model references once. Create a reusable profile. Use that identity across every garment, every shoot, every campaign — with face, skin tone, and body locked.</p>
        <button className="btn-gold" onClick={() => nav('pricing')}>Start Free Trial</button>
      </section>
      <section style={{padding:'60px 24px 80px'}}>
        <div style={{maxWidth:1000,margin:'0 auto'}}>
          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:60,marginBottom:80}}>
            <div>
              <h2 className="serif" style={{fontSize:32,fontWeight:500,marginBottom:20,lineHeight:1.3}}>The problem with fixed-avatar try-on tools</h2>
              <p style={{color:'#666',fontSize:15,lineHeight:1.75,marginBottom:16}}>Most virtual try-on platforms give you a set of pre-built avatars. You pick one. You're stuck with it. You can't use your brand's own model. You can't maintain visual consistency across product lines. You can't create a branded visual identity.</p>
              <p style={{color:'#666',fontSize:15,lineHeight:1.75}}>MirrorFit works the other way. You bring your own authorized model reference — synthetic, licensed, or consented personal — and we lock that identity for every render.</p>
            </div>
            <div>
              <div className="card" style={{padding:'32px'}}>
                <h3 className="serif" style={{fontSize:22,fontWeight:500,marginBottom:20}}>Model profile includes</h3>
                {[['Face reference image','Clear front-facing reference for identity lock'],['Full-body front image','Proportions, silhouette, and posture reference'],['Side-body reference','Optional — improves three-quarter render accuracy'],['Back-body reference','Optional — enables accurate back-view catalogue images'],['Default style preference','Saved catalogue style, background, and lighting'],['Identity lock','Prevents face drift across renders'],['Body proportion lock','Preserves silhouette consistency'],['Adult status confirmation','Required for revealing fashion categories']].map(([f,d]) => (
                  <div key={f} style={{display:'flex',gap:10,marginBottom:14,alignItems:'flex-start'}}>
                    <Tick/>
                    <div>
                      <p style={{fontSize:14,fontWeight:500,color:'#DDD',marginBottom:2}}>{f}</p>
                      <p style={{fontSize:12,color:'#555'}}>{d}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <SectionHeader tag="Accepted model types" title="Bring your own model reference" sub="MirrorFit supports any authorized adult model reference. All uploads require confirmation of ownership or permission." />
          <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:16}}>
            {[{icon:'🤖',title:'Synthetic AI Models',desc:'AI-generated model identities created for commercial use. No consent issues, full creative control.'},
              {icon:'📋',title:'Licensed Fashion Models',desc:'Professional models under a commercial license. MirrorFit confirms usage authorization at upload.'},
              {icon:'✅',title:'Consented Personal References',desc:'Real people who have given informed consent for commercial virtual try-on use. Confirmation required.'},
              {icon:'🏷️',title:'Brand-Owned Avatars',desc:'Custom model identities created and owned by your brand for exclusive catalogue use.'},
              {icon:'🎭',title:'Designer\'s Own Reference',desc:'Fashion designers can use their own image as a model reference for personal brand shoots.'},
              {icon:'🌐',title:'Influencer Collaborations',desc:'Authorized influencer references for brand collab catalogue images. Written consent required.'},
            ].map(f => (
              <div key={f.title} className="card card-hover" style={{padding:'24px 22px'}}>
                <div style={{fontSize:26,marginBottom:12}}>{f.icon}</div>
                <h3 style={{fontSize:14,fontWeight:500,color:'#E8E3DC',marginBottom:8}}>{f.title}</h3>
                <p style={{fontSize:13,color:'#555',lineHeight:1.65}}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      <CTABanner nav={nav} headline="Build your model library today." sub="Upload once. Use across every garment, every season."/>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════ */
/*  PAGE: VS VUE.AI                                              */
/* ══════════════════════════════════════════════════════════════ */
function VsVueAiPage({ nav }) {
  const rows = [
    ['Purpose','Fashion e-commerce catalogue','Broad fashion AI / enterprise','MirrorFit is purpose-built for catalogue generation'],
    ['Custom model upload','✓ Full upload + identity lock','✗ Fixed avatar system','MirrorFit'],
    ['Swimwear support','✓ Fully supported','✗ Often refused','MirrorFit'],
    ['Ethnicwear / saree','✓ Specialist support','◐ Limited accuracy','MirrorFit'],
    ['Garment accuracy','High — fabric, straps, embroidery','Medium — shape overlay','MirrorFit'],
    ['Batch generation','✓ 100+ garments','✓ Enterprise feature','Both (Vue.ai at higher cost)'],
    ['Identity consistency','✓ Identity Lock feature','◐ Avatar-limited','MirrorFit'],
    ['Pricing','Transparent subscription','Enterprise / quote-only','MirrorFit for SMBs'],
    ['Setup time','Minutes (self-serve)','Weeks (enterprise onboarding)','MirrorFit for speed'],
    ['India-specific categories','✓ Optimized','◐ General coverage','MirrorFit'],
    ['Self-serve access','✓ Instant signup','✗ Sales process required','MirrorFit'],
  ];
  const faq = [
    {q:'What is the main difference between MirrorFit AI and Vue.ai?',a:'MirrorFit AI is a specialist virtual try-on and catalogue generation platform for fashion e-commerce sellers. Vue.ai is a broader fashion AI company offering multiple products including visual discovery, personalization, and try-on tools — primarily for large enterprise retailers. MirrorFit is purpose-built for catalogue image generation with custom model identity, self-serve access, and transparent pricing. Vue.ai requires enterprise engagement and offers a broader (but less specialized) feature set.'},
    {q:'Can Vue.ai generate swimwear and bikini catalogue images?',a:'Vue.ai\'s general fashion AI tools may apply content restrictions to swimwear and revealing fashion categories. MirrorFit is specifically designed to handle swimwear, bikinis, sleepwear, and shapewear as commercial fashion products without unnecessary refusals.'},
    {q:'Does Vue.ai support custom model uploads?',a:'Vue.ai\'s try-on features primarily use fixed model avatars rather than custom uploaded model references. MirrorFit allows users to upload their own authorized adult model references and lock identity across all renders.'},
    {q:'Which is better for small fashion brands and boutiques?',a:'MirrorFit AI is designed for self-serve use — any brand or boutique can sign up, upload a model reference, and start generating images in minutes. Vue.ai is enterprise-oriented and requires sales engagement and custom onboarding. For SMBs, MirrorFit offers a faster, more accessible path.'},
  ];
  return (
    <div>
      <section style={{padding:'80px 24px 60px',textAlign:'center',background:'radial-gradient(ellipse 60% 40% at 50% 0%, rgba(201,169,110,.05) 0%, transparent 60%)'}}>
        <p className="section-tag" style={{marginBottom:16}}>Comparison</p>
        <h1 className="serif" style={{fontSize:'clamp(32px,4.5vw,60px)',fontWeight:600,lineHeight:1.1,marginBottom:20}}>MirrorFit AI vs Vue.ai:<br/><span className="gold-grad">What's the difference?</span></h1>
        <p style={{color:'#7A7570',fontSize:16,maxWidth:560,margin:'0 auto',lineHeight:1.7}}><strong style={{color:'#E8E3DC'}}>TL;DR:</strong> MirrorFit is a specialist catalogue generation tool with custom model upload, transparent pricing, and swimwear support. Vue.ai is a broader enterprise fashion AI platform without self-serve access or custom model identity.</p>
      </section>

      <section style={{padding:'60px 24px 80px'}}>
        <div style={{maxWidth:1100,margin:'0 auto'}}>
          <div className="card" style={{padding:0,overflow:'hidden',marginBottom:60}}>
            <div style={{padding:'20px 28px',borderBottom:'1px solid #1C1C1C',background:'#0A0A0A'}}>
              <h2 className="serif" style={{fontSize:22,fontWeight:500}}>Feature comparison</h2>
            </div>
            <div style={{overflowX:'auto'}}>
              <table className="cmp">
                <thead>
                  <tr style={{background:'#0A0A0A'}}>
                    <th style={{width:'28%'}}>Feature</th>
                    <th style={{background:'rgba(201,169,110,.06)'}}>MirrorFit AI</th>
                    <th>Vue.ai</th>
                    <th>Winner</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map(([feat,mf,vue,winner]) => (
                    <tr key={feat}>
                      <td style={{color:'#AAA'}}>{feat}</td>
                      <td className="col-hl">
                        {mf==='✓'?<Tick/>:mf==='✗'?<Cross/>:mf==='◐'?<Part/>:<span style={{fontSize:13}}>{mf}</span>}
                      </td>
                      <td>
                        {vue==='✓'?<Tick/>:vue==='✗'?<Cross/>:vue==='◐'?<Part/>:<span style={{fontSize:13}}>{vue}</span>}
                      </td>
                      <td style={{fontSize:13,color:'#666'}}>{winner}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:24,marginBottom:60}}>
            <div style={{background:'rgba(201,169,110,.05)',border:'1px solid rgba(201,169,110,.2)',borderRadius:8,padding:'28px'}}>
              <h3 className="serif" style={{fontSize:22,fontWeight:500,marginBottom:16,color:'#C9A96E'}}>MirrorFit AI is best for</h3>
              {['Fashion brands needing custom model identity','Swimwear, sleepwear, and shapewear sellers','Indian fashion sellers (sarees, lehengas, bridalwear)','Boutiques and SMBs wanting self-serve access','Stores needing transparent, predictable pricing','Teams that need to launch fast without enterprise onboarding'].map(i=>(
                <div key={i} style={{display:'flex',gap:10,marginBottom:10}}><Tick/><p style={{fontSize:14,color:'#9A9490',lineHeight:1.6}}>{i}</p></div>
              ))}
            </div>
            <div style={{background:'#0A0A0A',border:'1px solid #1E1E1E',borderRadius:8,padding:'28px'}}>
              <h3 className="serif" style={{fontSize:22,fontWeight:500,marginBottom:16}}>Vue.ai is best for</h3>
              {['Large enterprise retailers with complex AI needs','Brands that need visual discovery and personalization beyond try-on','Teams with budget and time for enterprise onboarding','Organizations needing a multi-product fashion AI platform'].map(i=>(
                <div key={i} style={{display:'flex',gap:10,marginBottom:10}}><Tick/><p style={{fontSize:14,color:'#666',lineHeight:1.6}}>{i}</p></div>
              ))}
            </div>
          </div>

          <FAQ items={faq}/>
        </div>
      </section>
      <CTABanner nav={nav} headline="Try MirrorFit AI — self-serve, no sales call." sub="Custom model upload, swimwear support, transparent pricing. Start today."/>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════ */
/*  PAGE: VS ZYLER                                               */
/* ══════════════════════════════════════════════════════════════ */
function VsZylerPage({ nav }) {
  const rows = [
    ['Primary use case','Brand catalogue generation','Consumer shopper try-on','Different use cases'],
    ['Custom brand model upload','✓ Brand-owned model identity','✗ Consumer photo upload only','MirrorFit'],
    ['Identity Lock','✓ Reusable locked profiles','✗ Single-use consumer upload','MirrorFit'],
    ['Swimwear support','✓ Full commercial support','◐ Consumer-oriented','MirrorFit'],
    ['Ethnicwear / saree','✓ Specialist support','✗ Not optimized','MirrorFit'],
    ['Batch generation','✓ 100+ SKUs in one run','✗ One garment at a time','MirrorFit'],
    ['Brand preset system','✓ Reusable style configs','✗ Not available','MirrorFit'],
    ['E-commerce output formats','✓ Marketplace, IG, Story, Banner','✗ Basic export','MirrorFit'],
    ['India market support','✓ Optimized','✗ Not optimized','MirrorFit'],
    ['Garment accuracy','High — product-detail focus','Medium — fit visualization focus','MirrorFit for catalogue'],
    ['Pricing model','Subscription (brand use)','Per-use / consumer pricing','Different models'],
  ];
  const faq = [
    {q:'What is the main difference between MirrorFit AI and Zyler?',a:'Zyler is primarily a consumer-facing virtual try-on tool — it lets shoppers upload their own photos to see how a garment looks on them. MirrorFit is a brand-facing catalogue generation platform — it lets fashion brands upload an authorized model reference and generate professional product catalogue images at scale. These are fundamentally different use cases.'},
    {q:'Can Zyler generate brand catalogue images?',a:'Zyler is designed for consumer try-on (helping shoppers visualize garments on themselves), not for generating brand catalogue images using a brand-owned model identity. MirrorFit fills that gap.'},
    {q:'Does Zyler support Indian ethnic fashion?',a:'Zyler is a UK-based platform primarily designed for Western fashion categories. It does not specialize in sarees, lehengas, bridal blouses, or Indian ethnic fashion. MirrorFit includes specialist support for these categories.'},
    {q:'Which should a swimwear brand use — MirrorFit or Zyler?',a:'MirrorFit is the better choice for swimwear brands needing catalogue generation. It supports bikinis, one-pieces, and beachwear commercially, with accurate garment rendering and batch generation across a locked model identity.'},
  ];
  return (
    <div>
      <section style={{padding:'80px 24px 60px',textAlign:'center',background:'radial-gradient(ellipse 60% 40% at 50% 0%, rgba(201,169,110,.05) 0%, transparent 60%)'}}>
        <p className="section-tag" style={{marginBottom:16}}>Comparison</p>
        <h1 className="serif" style={{fontSize:'clamp(32px,4.5vw,60px)',fontWeight:600,lineHeight:1.1,marginBottom:20}}>MirrorFit AI vs Zyler:<br/><span className="gold-grad">Different tools for different jobs</span></h1>
        <p style={{color:'#7A7570',fontSize:16,maxWidth:560,margin:'0 auto',lineHeight:1.7}}><strong style={{color:'#E8E3DC'}}>TL;DR:</strong> Zyler helps shoppers try on clothes using their own photos. MirrorFit helps brands generate professional catalogue images using their own model references. Both are virtual try-on tools — but for completely different audiences and outcomes.</p>
      </section>
      <section style={{padding:'60px 24px 80px'}}>
        <div style={{maxWidth:1100,margin:'0 auto'}}>
          <div className="card" style={{padding:0,overflow:'hidden',marginBottom:60}}>
            <div style={{padding:'20px 28px',borderBottom:'1px solid #1C1C1C',background:'#0A0A0A'}}>
              <h2 className="serif" style={{fontSize:22,fontWeight:500}}>Feature comparison</h2>
            </div>
            <div style={{overflowX:'auto'}}>
              <table className="cmp">
                <thead>
                  <tr style={{background:'#0A0A0A'}}>
                    <th style={{width:'28%'}}>Feature</th>
                    <th style={{background:'rgba(201,169,110,.06)'}}>MirrorFit AI</th>
                    <th>Zyler</th>
                    <th>Better for catalogue?</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map(([feat,mf,z,winner]) => (
                    <tr key={feat}>
                      <td style={{color:'#AAA'}}>{feat}</td>
                      <td className="col-hl">{mf==='✓'?<Tick/>:mf==='✗'?<Cross/>:mf==='◐'?<Part/>:<span style={{fontSize:13}}>{mf}</span>}</td>
                      <td>{z==='✓'?<Tick/>:z==='✗'?<Cross/>:z==='◐'?<Part/>:<span style={{fontSize:13}}>{z}</span>}</td>
                      <td style={{fontSize:13,color:'#666'}}>{winner}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:24,marginBottom:60}}>
            <div style={{background:'rgba(201,169,110,.05)',border:'1px solid rgba(201,169,110,.2)',borderRadius:8,padding:'28px'}}>
              <h3 className="serif" style={{fontSize:22,fontWeight:500,marginBottom:16,color:'#C9A96E'}}>Use MirrorFit when you need</h3>
              {['Brand catalogue images using your own model','Consistent model identity across all SKUs','Swimwear, ethnicwear, or revealing fashion support','Batch generation for large product libraries','Marketplace and social-ready export formats','A self-serve subscription without a sales process'].map(i=>(
                <div key={i} style={{display:'flex',gap:10,marginBottom:10}}><Tick/><p style={{fontSize:14,color:'#9A9490',lineHeight:1.6}}>{i}</p></div>
              ))}
            </div>
            <div style={{background:'#0A0A0A',border:'1px solid #1E1E1E',borderRadius:8,padding:'28px'}}>
              <h3 className="serif" style={{fontSize:22,fontWeight:500,marginBottom:16}}>Use Zyler when you need</h3>
              {['A consumer try-on widget for your store (shoppers try on with their own photo)','Reduce return rates by helping customers visualize fit','A customer-facing try-on experience integrated into product pages'].map(i=>(
                <div key={i} style={{display:'flex',gap:10,marginBottom:10}}><Tick/><p style={{fontSize:14,color:'#666',lineHeight:1.6}}>{i}</p></div>
              ))}
            </div>
          </div>
          <FAQ items={faq}/>
        </div>
      </section>
      <CTABanner nav={nav} headline="Need catalogue images — not consumer try-on?" sub="MirrorFit is built for brand catalogue generation. Start free today."/>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════ */
/*  PAGE: BEST ALTERNATIVES (virtual try-on alternatives)       */
/* ══════════════════════════════════════════════════════════════ */
function AlternativesPage({ nav }) {
  const tools = [
    {rank:1,name:'MirrorFit AI',type:'Best overall for catalogue generation',best:'Fashion brands needing custom model identity and full category support',pros:['Custom model upload with Identity Lock','Swimwear, ethnicwear, and all commercial categories supported','Batch generation for large SKU libraries','Transparent subscription pricing','Self-serve — no sales process'],cons:['Newer platform — less established than enterprise tools'],price:'From ₹1,999/month'},
    {rank:2,name:'Vue.ai',type:'Best for enterprise fashion retailers',best:'Large retailers needing broader AI capabilities beyond try-on',pros:['Established enterprise platform','Multiple fashion AI modules','Visual discovery and personalization features'],cons:['No custom model upload (fixed avatars)','Enterprise pricing — no self-serve access','May restrict swimwear and revealing categories'],price:'Custom / enterprise'},
    {rank:3,name:'Zyler',type:'Best consumer try-on widget',best:'Brands wanting shoppers to try garments with their own photos on product pages',pros:['Consumer-facing try-on experience','Reduces customer returns','Embeds in product pages'],cons:['For shoppers, not catalogue generation','No brand model identity system','Not optimized for Indian ethnic fashion'],price:'Custom'},
    {rank:4,name:'Traditional photoshoot',type:'Maximum realism (for now)',best:'Hero campaigns, hero garments, and brand flagship imagery where budget is available',pros:['Highest output quality for hero imagery','Creative direction and art direction control','Suitable for print advertising'],cons:['₹50,000–₹5,00,000 per session','1–4 week scheduling delay','Cannot scale with SKU volume','Model inconsistency across sessions'],price:'₹50,000–₹5,00,000 / session'},
    {rank:5,name:'Midjourney / DALL-E',type:'General image generation',best:'Creative mood boards and campaign concept work — not product catalogues',pros:['High creative output quality','Flexible for concept visualization'],cons:['No identity persistence','Refuses swimwear and revealing fashion','Not optimized for accurate garment transfer','Not built for e-commerce output formats'],price:'$10–30/month (general use only)'},
  ];
  return (
    <div>
      <section style={{padding:'80px 24px 60px',textAlign:'center',background:'radial-gradient(ellipse 60% 40% at 50% 0%, rgba(201,169,110,.05) 0%, transparent 60%)'}}>
        <p className="section-tag" style={{marginBottom:16}}>Alternatives</p>
        <h1 className="serif" style={{fontSize:'clamp(32px,4.5vw,60px)',fontWeight:600,lineHeight:1.1,marginBottom:20}}>Best AI virtual try-on tools<br/><span className="gold-grad">for fashion e-commerce</span></h1>
        <p style={{color:'#7A7570',fontSize:16,maxWidth:580,margin:'0 auto',lineHeight:1.7}}>An honest comparison of virtual try-on and AI fashion catalogue tools — what each does well, what each falls short on, and which is right for different use cases.</p>
      </section>

      <section style={{padding:'60px 24px 80px'}}>
        <div style={{maxWidth:1000,margin:'0 auto'}}>
          <div style={{background:'rgba(201,169,110,.05)',border:'1px solid rgba(201,169,110,.2)',borderRadius:8,padding:'24px 28px',marginBottom:56}}>
            <h3 style={{fontSize:15,fontWeight:500,marginBottom:12}}>What to look for in a virtual try-on platform</h3>
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:12}}>
              {['Custom model upload — can you use your own brand model identity?','Swimwear and full fashion category support — no unnecessary refusals','Garment accuracy — are fabric details, colors, and design preserved?','Batch generation — can you process 100 SKUs at once?','Output format options — marketplace crops, social, website banner?','Pricing transparency — self-serve access or enterprise-only?'].map(c=>(
                <div key={c} style={{display:'flex',gap:10}}><Tick/><p style={{fontSize:13,color:'#888',lineHeight:1.6}}>{c}</p></div>
              ))}
            </div>
          </div>

          {tools.map(tool => (
            <div key={tool.name} className="card" style={{padding:'32px',marginBottom:20,border:tool.rank===1?'1px solid rgba(201,169,110,.3)':'1px solid #1C1C1C'}}>
              <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:20,flexWrap:'wrap',gap:12}}>
                <div style={{display:'flex',gap:16,alignItems:'center'}}>
                  <span className="gold" style={{fontFamily:'Cormorant Garamond,serif',fontSize:36,fontWeight:600,lineHeight:1}}>#{tool.rank}</span>
                  <div>
                    <h3 style={{fontSize:20,fontWeight:500,color:'#E8E3DC',marginBottom:4,fontFamily:'Cormorant Garamond,serif'}}>{tool.name} {tool.rank===1&&<span className="pill" style={{fontSize:10,verticalAlign:'middle',marginLeft:8}}>Recommended</span>}</h3>
                    <p style={{fontSize:13,color:'#666'}}>{tool.type}</p>
                  </div>
                </div>
                <div style={{textAlign:'right'}}>
                  <p style={{fontSize:12,color:'#555',marginBottom:4}}>Pricing</p>
                  <p style={{fontSize:14,color:'#C9A96E'}}>{tool.price}</p>
                </div>
              </div>
              <p style={{fontSize:13,color:'#666',marginBottom:20}}><strong style={{color:'#888'}}>Best for:</strong> {tool.best}</p>
              <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:24}}>
                <div>
                  <p style={{fontSize:11,letterSpacing:'2px',textTransform:'uppercase',color:'#4CAF7D',marginBottom:10}}>Strengths</p>
                  {tool.pros.map(p=>(
                    <div key={p} style={{display:'flex',gap:8,marginBottom:8}}><Tick/><p style={{fontSize:13,color:'#888',lineHeight:1.5}}>{p}</p></div>
                  ))}
                </div>
                <div>
                  <p style={{fontSize:11,letterSpacing:'2px',textTransform:'uppercase',color:'#E05252',marginBottom:10}}>Limitations</p>
                  {tool.cons.map(c=>(
                    <div key={c} style={{display:'flex',gap:8,marginBottom:8}}><span style={{color:'#444',fontSize:14,flexShrink:0}}>✗</span><p style={{fontSize:13,color:'#666',lineHeight:1.5}}>{c}</p></div>
                  ))}
                </div>
              </div>
              {tool.rank===1 && <button className="btn-gold" style={{marginTop:20}} onClick={() => nav('pricing')}>Try MirrorFit AI Free</button>}
            </div>
          ))}
        </div>
      </section>
      <CTABanner nav={nav} headline="Ready to choose the right tool?" sub="MirrorFit AI: custom model identity, full category support, transparent pricing."/>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════ */
/*  PAGE: VUE.AI ALTERNATIVES                                    */
/* ══════════════════════════════════════════════════════════════ */
function VueAiAltsPage({ nav }) {
  const reasons = [
    {icon:'💸',title:'Pricing not accessible for SMBs',desc:'Vue.ai is enterprise-priced and requires a sales conversation. Small brands and boutiques can\'t get access or pricing transparency.'},
    {icon:'🚫',title:'No custom model identity',desc:'Vue.ai\'s try-on products use fixed model avatars. You can\'t upload your brand\'s own model reference and lock identity across your catalogue.'},
    {icon:'🩱',title:'Swimwear and revealing category gaps',desc:'Vue.ai\'s general AI tools may apply content restrictions that block legitimate swimwear and sleepwear product images.'},
    {icon:'🇮🇳',title:'Limited Indian ethnic fashion support',desc:'Vue.ai doesn\'t specialize in sarees, lehengas, or bridal blouses — categories that require specialist drape and embroidery rendering.'},
  ];
  return (
    <div>
      <section style={{padding:'80px 24px 60px',textAlign:'center',background:'radial-gradient(ellipse 60% 40% at 50% 0%, rgba(201,169,110,.05) 0%, transparent 60%)'}}>
        <p className="section-tag" style={{marginBottom:16}}>Vue.ai Alternatives</p>
        <h1 className="serif" style={{fontSize:'clamp(32px,4.5vw,60px)',fontWeight:600,lineHeight:1.1,marginBottom:20}}>Looking for a Vue.ai alternative?<br/><span className="gold-grad">Here's what to consider</span></h1>
        <p style={{color:'#7A7570',fontSize:16,maxWidth:560,margin:'0 auto',lineHeight:1.7}}>Vue.ai is a powerful enterprise fashion AI platform — but it's not the right fit for every seller. Here's why brands look for alternatives, and what to look for instead.</p>
      </section>
      <section style={{padding:'60px 24px 80px'}}>
        <div style={{maxWidth:1000,margin:'0 auto'}}>
          <SectionHeader tag="Why people look for Vue.ai alternatives" title="Common reasons brands switch" />
          <div style={{display:'grid',gridTemplateColumns:'repeat(2,1fr)',gap:20,marginBottom:60}}>
            {reasons.map(r=>(
              <div key={r.title} className="card" style={{padding:'24px'}}>
                <div style={{fontSize:26,marginBottom:14}}>{r.icon}</div>
                <h3 style={{fontSize:15,fontWeight:500,color:'#E8E3DC',marginBottom:10}}>{r.title}</h3>
                <p style={{fontSize:13,color:'#666',lineHeight:1.7}}>{r.desc}</p>
              </div>
            ))}
          </div>

          <div style={{background:'rgba(201,169,110,.05)',border:'1px solid rgba(201,169,110,.25)',borderRadius:8,padding:'36px',marginBottom:60}}>
            <div style={{display:'flex',gap:20,alignItems:'flex-start'}}>
              <div style={{flex:1}}>
                <p className="section-tag" style={{marginBottom:12}}>Top recommendation</p>
                <h2 className="serif" style={{fontSize:32,fontWeight:500,marginBottom:16}}>MirrorFit AI</h2>
                <p style={{color:'#888',fontSize:15,lineHeight:1.75,marginBottom:20}}>MirrorFit fills every major gap in Vue.ai for fashion catalogue generation: custom model upload with identity lock, full swimwear and ethnicwear support, self-serve transparent pricing, and batch generation for large SKU libraries.</p>
                <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:10,marginBottom:24}}>
                  {['Custom model upload + Identity Lock','Swimwear, sarees, bridalwear — all supported','From ₹1,999/month — no sales call','Self-serve signup in minutes','Batch 100+ garments in one run','Marketplace and social export formats'].map(i=>(
                    <div key={i} style={{display:'flex',gap:8}}><Tick/><p style={{fontSize:13,color:'#999'}}>{i}</p></div>
                  ))}
                </div>
                <button className="btn-gold" onClick={() => nav('pricing')}>Start Free Trial</button>
              </div>
            </div>
          </div>

          <div className="card" style={{padding:0,overflow:'hidden'}}>
            <div style={{padding:'20px 28px',borderBottom:'1px solid #1C1C1C',background:'#0A0A0A'}}>
              <h2 className="serif" style={{fontSize:22,fontWeight:500}}>MirrorFit vs Vue.ai — at a glance</h2>
            </div>
            <div style={{overflowX:'auto'}}>
              <table className="cmp">
                <thead>
                  <tr style={{background:'#0A0A0A'}}>
                    <th>Factor</th>
                    <th style={{background:'rgba(201,169,110,.06)'}}>MirrorFit AI</th>
                    <th>Vue.ai</th>
                  </tr>
                </thead>
                <tbody>
                  {[['Target user','SMBs + boutiques + growing brands','Large enterprise retailers'],['Access','Self-serve, instant signup','Enterprise sales process'],['Custom model upload','✓ Yes','✗ Fixed avatars'],['Swimwear support','✓ Yes','✗ Often restricted'],['Ethnicwear / sarees','✓ Specialist support','◐ Limited'],['Pricing','From ₹1,999/month','Custom / enterprise'],['Batch generation','✓ Yes','✓ Enterprise feature'],['Time to first image','Minutes','Weeks (onboarding)']].map(([feat,mf,vue])=>(
                    <tr key={feat}>
                      <td style={{color:'#AAA'}}>{feat}</td>
                      <td className="col-hl">{mf==='✓'?<Tick/>:mf==='✗'?<Cross/>:mf==='◐'?<Part/>:<span style={{fontSize:13}}>{mf}</span>}</td>
                      <td>{vue==='✓'?<Tick/>:vue==='✗'?<Cross/>:vue==='◐'?<Part/>:<span style={{fontSize:13}}>{vue}</span>}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>
      <CTABanner nav={nav} headline="Ready to try the Vue.ai alternative built for sellers?" sub="Self-serve. Transparent pricing. Custom model identity. Swimwear supported."/>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════ */
/*  APP SHELL                                                     */
/* ══════════════════════════════════════════════════════════════ */
export default function App() {
  const [page, setPage] = useState('home');
  const nav = (p) => { setPage(p); window.scrollTo({top:0,behavior:'smooth'}); };

  const pageMap = {
    'home': <HomePage nav={nav}/>,
    'how-it-works': <HowItWorksPage nav={nav}/>,
    'features': <FeaturesPage nav={nav}/>,
    'pricing': <PricingPage nav={nav}/>,
    'swimwear': <SwimwearPage nav={nav}/>,
    'ethnicwear': <EthnicwearPage nav={nav}/>,
    'batch': <BatchPage nav={nav}/>,
    'model-library': <ModelLibraryPage nav={nav}/>,
    'vs-vueai': <VsVueAiPage nav={nav}/>,
    'vs-zyler': <VsZylerPage nav={nav}/>,
    'alternatives': <AlternativesPage nav={nav}/>,
    'vueai-alts': <VueAiAltsPage nav={nav}/>,
  };

  return (
    <>
      <style>{CSS}</style>
      <div style={{minHeight:'100vh',display:'flex',flexDirection:'column'}}>
        <Nav page={page} nav={nav}/>
        <main style={{flex:1}}>{pageMap[page] || pageMap['home']}</main>
        <Footer nav={nav}/>
      </div>
    </>
  );
}
