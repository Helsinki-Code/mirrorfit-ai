// app.jsx — top-level App, Shoot Inbox, Brand Memory, routing

const { useState, useEffect, useContext, useRef } = React;

// ══════════════════════════════════════════
// THREAD DATA
// ══════════════════════════════════════════

const INITIAL_THREADS = [
  {
    id: 'bridal-blouse',
    name: 'Bridal Blouse Catalogue',
    model: 'Meera', category: 'Ethnicwear',
    lastMessage: 'Generated back view — approve?',
    status: 'ready', time: '2h ago', renderCount: 8,
    demoStep: -1,
    messages: [
      { id: 'b1', type: 'ai', text: "Hi — what are we shooting today?" },
      { id: 'b2', type: 'user', text: 'Meera in a silk bridal blouse — festive boutique lighting, front and back view for my catalogue.' },
      { id: 'b3', type: 'ai', text: 'Perfect — Meera, silk bridal blouse, festive boutique lighting. I just need the garment image.' },
      { id: 'b4', type: 'system', text: 'Garment received · Analysing fabric, embroidery and silhouette', variant: 'default' },
      { id: 'b5', type: 'system', text: '✦ Rendering · Meera · Silk Bridal Blouse · Festive Studio · Front View', variant: 'generating', animated: false },
      { id: 'b6', type: 'result', model: 'Meera', garment: 'Silk Bridal Blouse', setting: 'Festive Studio', view: 'Front View' },
      { id: 'b7', type: 'ai', text: 'Front view rendered — identity strong, embroidery accurate. Generating back view now.' },
      { id: 'b8', type: 'result', model: 'Meera', garment: 'Silk Bridal Blouse', setting: 'Festive Studio', view: 'Back View' },
    ],
  },
  {
    id: 'swimwear-beach',
    name: 'Swimwear Beach Set',
    model: 'Aanya', category: 'Swimwear',
    lastMessage: '✦ Rendering · Aanya · Beach Set…',
    status: 'generating', time: '8m ago', renderCount: 2,
    demoStep: -1,
    messages: [
      { id: 'sw1', type: 'ai', text: "Hi — what are we shooting today?" },
      { id: 'sw2', type: 'user', text: 'Aanya, swimwear beach set, natural golden hour light, editorial vibe' },
      { id: 'sw3', type: 'ai', text: 'Beach editorial with Aanya — golden hour, natural light. Uploading the swimwear?' },
      { id: 'sw4', type: 'system', text: 'Garment received · Analysing swimwear construction and fabric', variant: 'default' },
      { id: 'sw5', type: 'system', text: '✦ Rendering · Aanya · Beach Swimwear Set · Golden Hour · ~45s', variant: 'generating', animated: true },
    ],
  },
  {
    id: 'navy-dress',
    name: 'Navy Dress Product Page',
    model: 'Meera', category: 'Casualwear',
    lastMessage: 'Start typing to begin your shoot',
    status: 'draft', time: 'Now', renderCount: 0,
    demoStep: 0,
    messages: [
      { id: 'nd1', type: 'ai', text: "Hi — what are we shooting today? You can describe the garment, upload an image, or paste a product link to get started." },
    ],
  },
  {
    id: 'lehenga-festive',
    name: 'Festive Lehenga Catalogue',
    model: 'Priya', category: 'Ethnicwear',
    lastMessage: 'Approved 4 renders. Ready to export.',
    status: 'approved', time: '1d ago', renderCount: 12,
    demoStep: -1,
    messages: [
      { id: 'l1', type: 'ai', text: "Hi — what are we shooting today?" },
      { id: 'l2', type: 'user', text: 'Priya in a deep red festive lehenga — bridal show lighting, full body' },
      { id: 'l3', type: 'result', model: 'Priya', garment: 'Festive Lehenga', setting: 'Bridal Show', view: 'Front View' },
      { id: 'l4', type: 'result', model: 'Priya', garment: 'Festive Lehenga', setting: 'Bridal Show', view: 'Side Drape' },
      { id: 'l5', type: 'ai', text: 'All 4 renders approved and ready for export. Shall I share the thread with your buyer?' },
    ],
  },
  {
    id: 'shapewear',
    name: 'Shapewear Studio Catalogue',
    model: 'Zara', category: 'Shapewear',
    lastMessage: 'Great results — sharing with client now.',
    status: 'shared', time: '3d ago', renderCount: 6,
    demoStep: -1,
    messages: [
      { id: 'sh1', type: 'ai', text: "Hi — what are we shooting today?" },
      { id: 'sh2', type: 'user', text: 'Zara in shapewear — clean studio, white background, full body front' },
      { id: 'sh3', type: 'result', model: 'Zara', garment: 'Shapewear Set', setting: 'Clean Studio', view: 'Front View' },
      { id: 'sh4', type: 'ai', text: 'Clean studio render complete — identity locked, garment accurate. Thread link shared with your client.' },
    ],
  },
];

// ══════════════════════════════════════════
// THREAD CARD (inbox item)
// ══════════════════════════════════════════

function ThreadCard({ thread, isActive, onClick }) {
  const { Avatar, StatusBadge } = window;
  return (
    <div onClick={onClick} style={{
      display: 'flex', gap: 13, alignItems: 'center',
      padding: '13px 18px',
      background: isActive ? 'var(--card)' : 'transparent',
      borderLeft: isActive ? '2px solid var(--gold)' : '2px solid transparent',
      borderBottom: '1px solid var(--border-soft)',
      cursor: 'pointer', transition: 'background .15s',
    }}
    onMouseEnter={e => { if (!isActive) e.currentTarget.style.background = 'var(--card)'; }}
    onMouseLeave={e => { if (!isActive) e.currentTarget.style.background = 'transparent'; }}
    >
      <Avatar name={thread.model} size={44} online={thread.status === 'generating'} />
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: 4, marginBottom: 4 }}>
          <div style={{
            fontFamily: "'Syne', sans-serif", fontSize: 13.5,
            color: 'var(--text)', fontWeight: 600,
            whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', flex: 1,
          }}>{thread.name}</div>
          <div style={{ fontFamily: "'Syne Mono',monospace", fontSize: 10, color: 'var(--text-dim)', flexShrink: 0 }}>
            {thread.time}
          </div>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 6 }}>
          <div style={{
            fontFamily: "'Syne',sans-serif", fontSize: 12, color: 'var(--text-mid)',
            whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', flex: 1,
          }}>{thread.lastMessage}</div>
          <StatusBadge status={thread.status} />
        </div>
        {thread.renderCount > 0 && (
          <div style={{
            fontFamily: "'Syne Mono',monospace", fontSize: 10,
            color: 'var(--text-dim)', marginTop: 5, letterSpacing: '.4px',
          }}>
            {thread.renderCount} renders · {thread.model} · {thread.category}
          </div>
        )}
      </div>
    </div>
  );
}

// ══════════════════════════════════════════
// SHOOT INBOX
// ══════════════════════════════════════════

function ShootInbox({ threads, activeId, onSelect, onNewShoot }) {
  const [search, setSearch] = useState('');
  const filtered = threads.filter(t =>
    !search ||
    t.name.toLowerCase().includes(search.toLowerCase()) ||
    t.model.toLowerCase().includes(search.toLowerCase()) ||
    t.category.toLowerCase().includes(search.toLowerCase())
  );
  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' }}>
      {/* Search */}
      <div style={{ padding: '10px 14px', borderBottom: '1px solid var(--border-soft)', flexShrink: 0 }}>
        <div style={{
          display: 'flex', alignItems: 'center', gap: 8,
          background: 'var(--card)', border: '1px solid var(--border)',
          borderRadius: 10, padding: '7px 12px',
        }}>
          <span style={{ color: 'var(--text-dim)', fontSize: 14, flexShrink: 0 }}>⌕</span>
          <input
            value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search shoots, models, categories…"
            style={{
              flex: 1, background: 'none', border: 'none', outline: 'none',
              color: 'var(--text)', fontSize: 12.5,
              fontFamily: "'Syne',sans-serif",
            }}
          />
          {search && (
            <button onClick={() => setSearch('')} style={{
              background: 'none', border: 'none', cursor: 'pointer',
              color: 'var(--text-dim)', fontSize: 14, lineHeight: 1,
            }}>✕</button>
          )}
        </div>
      </div>
      {/* Section label */}
      <div style={{
        padding: '10px 18px 6px',
        fontFamily: "'Syne Mono',monospace", fontSize: 9,
        color: 'var(--text-dim)', letterSpacing: '2.5px', textTransform: 'uppercase',
        flexShrink: 0,
      }}>
        {filtered.length} shoot{filtered.length !== 1 ? 's' : ''}
      </div>
      {/* Threads */}
      <div style={{ flex: 1, overflow: 'auto' }}>
        {filtered.map(t => (
          <ThreadCard key={t.id} thread={t} isActive={t.id === activeId} onClick={() => onSelect(t)} />
        ))}
        {filtered.length === 0 && (
          <div style={{
            padding: '40px 24px', textAlign: 'center',
            color: 'var(--text-dim)', fontFamily: "'Syne',sans-serif", fontSize: 13,
          }}>
            No shoots match "{search}"
          </div>
        )}
      </div>
      {/* New shoot CTA */}
      <div style={{ padding: '14px', borderTop: '1px solid var(--border-soft)', flexShrink: 0 }}>
        <button onClick={onNewShoot} style={{
          width: '100%', padding: '11px',
          background: 'var(--gold-dim)', border: '1px solid var(--gold-border)',
          borderRadius: 8, cursor: 'pointer', color: 'var(--gold)',
          fontSize: 13, fontFamily: "'Syne',sans-serif", fontWeight: 600,
          letterSpacing: '.3px', display: 'flex', alignItems: 'center',
          justifyContent: 'center', gap: 8, transition: 'background .18s',
        }}
        onMouseEnter={e => e.currentTarget.style.background = 'rgba(201,168,112,.2)'}
        onMouseLeave={e => e.currentTarget.style.background = 'var(--gold-dim)'}
        >
          <span style={{ fontSize: 16, lineHeight: 1 }}>+</span> New Shoot
        </button>
      </div>
    </div>
  );
}

// ══════════════════════════════════════════
// BRAND MEMORY PANEL
// ══════════════════════════════════════════

function BrandMemoryPanel({ onClose }) {
  const { GoldTag } = window;
  const memories = [
    { label: 'Default Model', value: 'Meera', cat: 'Identity', editable: true },
    { label: 'Preferred Lighting', value: 'Warm softbox', cat: 'Style', editable: true },
    { label: 'Default Crop', value: 'Marketplace 1:1', cat: 'Export', editable: true },
    { label: 'Catalogue Voice', value: 'Luxury editorial', cat: 'Style', editable: true },
    { label: 'Avoided Backgrounds', value: 'Cluttered, outdoors', cat: 'Preference', editable: true },
    { label: 'Swimwear Default', value: 'Natural beach light', cat: 'Category', editable: false },
    { label: 'Ethnicwear Default', value: 'Festive studio warm', cat: 'Category', editable: false },
    { label: 'Shapewear Default', value: 'Clean studio, white bg', cat: 'Category', editable: false },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', background: 'var(--surface)' }}>
      {/* Header */}
      <div style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start',
        padding: '20px 20px 16px', borderBottom: '1px solid var(--border-soft)',
        flexShrink: 0,
      }}>
        <div>
          <div style={{ fontFamily: "'Syne Mono',monospace", fontSize: 9, letterSpacing: '3px', textTransform: 'uppercase', color: 'var(--gold)', marginBottom: 6 }}>
            Brand Intelligence
          </div>
          <div style={{ fontFamily: "'Playfair Display',serif", fontSize: 20, color: 'var(--text)', fontWeight: 400 }}>
            Brand <em>Memory</em>
          </div>
        </div>
        <button onClick={onClose} style={{
          background: 'none', border: 'none', cursor: 'pointer',
          color: 'var(--text-dim)', fontSize: 20, lineHeight: 1,
          padding: '2px',
        }}>✕</button>
      </div>
      {/* Info note */}
      <div style={{ padding: '14px 18px 0', flexShrink: 0 }}>
        <div style={{
          background: 'var(--accent-dim)', border: '1px solid rgba(46,204,138,.22)',
          borderRadius: 8, padding: '11px 14px',
          fontSize: 12, color: 'var(--accent)',
          fontFamily: "'Syne',sans-serif", lineHeight: 1.65,
        }}>
          Brand Memory builds automatically from your shoot history — no setup required. Applied silently to every new thread.
        </div>
      </div>
      {/* Memory entries */}
      <div style={{ flex: 1, overflow: 'auto', padding: '14px 18px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          {memories.map((m, i) => (
            <div key={i} style={{
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              padding: '13px 14px', background: 'var(--card)',
              border: '1px solid var(--border-soft)', borderRadius: 6,
              transition: 'border-color .15s',
            }}
            onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--border)'}
            onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border-soft)'}
            >
              <div>
                <div style={{ fontFamily: "'Syne',sans-serif", fontSize: 12.5, color: 'var(--text)', fontWeight: 500, marginBottom: 5 }}>
                  {m.label}
                </div>
                <GoldTag>{m.cat}</GoldTag>
              </div>
              <div style={{ textAlign: 'right', flexShrink: 0, marginLeft: 12 }}>
                <div style={{ fontFamily: "'Syne Mono',monospace", fontSize: 12, color: 'var(--gold)', marginBottom: 4 }}>
                  {m.value}
                </div>
                {m.editable && (
                  <div style={{ fontFamily: "'Syne Mono',monospace", fontSize: 10, color: 'var(--text-dim)', cursor: 'pointer', letterSpacing: '.5px' }}>
                    Edit
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ══════════════════════════════════════════
// SHARE THREAD MODAL
// ══════════════════════════════════════════

function ShareModal({ thread, onClose }) {
  const [copied, setCopied] = useState(false);
  const [expiry, setExpiry] = useState('7');
  const link = `https://mirrorfit.ai/share/${thread?.id || 'shoot'}-${Date.now().toString(36)}`;

  const handleCopy = () => {
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div style={{
      position: 'fixed', inset: 0, background: 'rgba(0,0,0,.65)',
      zIndex: 8000, display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: 24, backdropFilter: 'blur(10px)',
      animation: 'mfFadeIn .2s ease forwards',
    }} onClick={onClose}>
      <div style={{
        background: 'var(--surface)', border: '1px solid var(--border)',
        borderRadius: 12, padding: '28px 28px 24px',
        maxWidth: 420, width: '100%',
        boxShadow: 'var(--shadow)',
      }} onClick={e => e.stopPropagation()}>
        <div style={{ fontFamily: "'Syne Mono',monospace", fontSize: 9, letterSpacing: '3px', textTransform: 'uppercase', color: 'var(--gold)', marginBottom: 8 }}>Share Thread</div>
        <div style={{ fontFamily: "'Playfair Display',serif", fontSize: 20, color: 'var(--text)', marginBottom: 16 }}>
          Send for <em>client review</em>
        </div>
        <div style={{ fontSize: 13, color: 'var(--text-mid)', lineHeight: 1.7, marginBottom: 20, fontFamily: "'Syne',sans-serif" }}>
          The recipient sees all renders in a read-only thread view, can mark approvals, and leave comments per image.
        </div>
        {/* Link field */}
        <div style={{
          display: 'flex', gap: 8, alignItems: 'center',
          background: 'var(--card)', border: '1px solid var(--border)',
          borderRadius: 8, padding: '10px 14px', marginBottom: 16,
        }}>
          <div style={{
            flex: 1, fontFamily: "'Syne Mono',monospace", fontSize: 11,
            color: 'var(--text-mid)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
          }}>{link}</div>
          <button onClick={handleCopy} style={{
            background: 'var(--gold)', border: 'none',
            borderRadius: 6, padding: '6px 12px', cursor: 'pointer',
            color: document.documentElement.getAttribute('data-theme') === 'light' ? '#fff' : '#07080A',
            fontSize: 11.5, fontFamily: "'Syne',sans-serif", fontWeight: 600, flexShrink: 0,
          }}>
            {copied ? '✓ Copied' : 'Copy'}
          </button>
        </div>
        {/* Expiry */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
          <span style={{ fontFamily: "'Syne',sans-serif", fontSize: 12, color: 'var(--text-mid)' }}>Expires after</span>
          {['7', '14', '30'].map(d => (
            <button key={d} onClick={() => setExpiry(d)} style={{
              padding: '5px 12px', borderRadius: 20,
              background: expiry === d ? 'var(--gold-dim)' : 'transparent',
              border: `1px solid ${expiry === d ? 'var(--gold-border)' : 'var(--border)'}`,
              color: expiry === d ? 'var(--gold)' : 'var(--text-dim)',
              fontSize: 11.5, fontFamily: "'Syne Mono',monospace",
              cursor: 'pointer', transition: 'all .15s',
            }}>{d}d</button>
          ))}
        </div>
        <button onClick={onClose} style={{
          width: '100%', padding: '11px',
          background: 'transparent', border: '1px solid var(--border)',
          borderRadius: 8, cursor: 'pointer',
          color: 'var(--text-dim)', fontFamily: "'Syne',sans-serif", fontSize: 13,
        }}>Close</button>
      </div>
    </div>
  );
}

// ══════════════════════════════════════════
// APP SIDEBAR HEADER
// ══════════════════════════════════════════

function SidebarHeader({ onToggleTheme, theme, onToggleBrandMemory, brandMemoryOpen }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '17px 18px',
      borderBottom: '1px solid var(--border-soft)',
      background: 'var(--surface)', flexShrink: 0,
    }}>
      <div>
        <div style={{
          fontFamily: "'Playfair Display',serif", fontSize: 18,
          color: 'var(--text)', fontWeight: 400, lineHeight: 1.2,
        }}>
          MirrorFit <span style={{ color: 'var(--gold)' }}>AI</span>
        </div>
        <div style={{
          fontFamily: "'Syne Mono',monospace", fontSize: 9, color: 'var(--text-dim)',
          letterSpacing: '2px', textTransform: 'uppercase', marginTop: 2,
        }}>Fashion Studio</div>
      </div>
      <div style={{ display: 'flex', gap: 7, alignItems: 'center' }}>
        <button onClick={onToggleBrandMemory} title="Brand Memory"
          style={{
            background: brandMemoryOpen ? 'var(--gold-dim)' : 'none',
            border: `1px solid ${brandMemoryOpen ? 'var(--gold-border)' : 'var(--border)'}`,
            borderRadius: 7, cursor: 'pointer',
            color: brandMemoryOpen ? 'var(--gold)' : 'var(--text-dim)',
            fontSize: 14, padding: '6px 9px',
            transition: 'all .18s',
          }}>🧠</button>
        <button onClick={onToggleTheme} title="Toggle theme"
          style={{
            background: 'none', border: '1px solid var(--border)',
            borderRadius: 7, cursor: 'pointer',
            color: 'var(--text-dim)', fontSize: 14,
            padding: '6px 9px', transition: 'all .18s',
            fontFamily: "'Syne Mono',monospace",
          }}>
          {theme === 'dark' ? '☀' : '☽'}
        </button>
      </div>
    </div>
  );
}

// ══════════════════════════════════════════
// WELCOME (empty state)
// ══════════════════════════════════════════

function WelcomePane({ onNewShoot }) {
  return (
    <div style={{
      display: 'flex', flexDirection: 'column', alignItems: 'center',
      justifyContent: 'center', height: '100%',
      padding: '40px', textAlign: 'center', background: 'var(--bg)',
    }}>
      <div style={{
        width: 64, height: 64, borderRadius: '50%',
        background: 'var(--gold-dim)', border: '1px solid var(--gold-border)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontFamily: "'Playfair Display',serif", fontSize: 28, color: 'var(--gold)',
        marginBottom: 24, fontStyle: 'italic',
      }}>M</div>
      <div style={{ fontFamily: "'Syne Mono',monospace", fontSize: 10, letterSpacing: '3px', textTransform: 'uppercase', color: 'var(--gold)', marginBottom: 14 }}>
        Chat-First Fashion Studio
      </div>
      <h2 style={{
        fontFamily: "'Playfair Display',serif", fontSize: 26,
        color: 'var(--text)', fontWeight: 400, lineHeight: 1.25,
        marginBottom: 16, maxWidth: 380,
      }}>
        Select a shoot or <em style={{ color: 'var(--gold)', fontStyle: 'italic' }}>start<br/>a new one</em>
      </h2>
      <p style={{
        fontFamily: "'Syne',sans-serif", fontSize: 14,
        color: 'var(--text-mid)', lineHeight: 1.75,
        maxWidth: 340, marginBottom: 32,
      }}>
        Every shoot is a conversation. Describe the garment, the model, and the style — and get a catalogue image as a reply.
      </p>
      <button onClick={onNewShoot} style={{
        padding: '12px 28px', borderRadius: 8,
        background: 'var(--gold)', border: 'none',
        color: document.documentElement.getAttribute('data-theme') === 'light' ? '#fff' : '#07080A',
        fontSize: 13, fontFamily: "'Syne',sans-serif",
        fontWeight: 700, cursor: 'pointer', letterSpacing: '.4px',
      }}>+ New Shoot</button>
    </div>
  );
}

// ══════════════════════════════════════════
// ACCENT PALETTES
// ══════════════════════════════════════════

const ACCENT_PALETTES = {
  gold: { '--gold': '#C9A870', '--gold-light': '#E8C98A', '--gold-dim': 'rgba(201,168,112,.12)', '--gold-border': 'rgba(201,168,112,.25)' },
  sapphire: { '--gold': '#5A9BE0', '--gold-light': '#85BDEF', '--gold-dim': 'rgba(90,155,224,.12)', '--gold-border': 'rgba(90,155,224,.28)' },
  rose: { '--gold': '#D4748A', '--gold-light': '#E8A0B0', '--gold-dim': 'rgba(212,116,138,.12)', '--gold-border': 'rgba(212,116,138,.28)' },
};

// ══════════════════════════════════════════
// MAIN APP
// ══════════════════════════════════════════

function App() {
  const { theme, toggleTheme } = useContext(window.ThemeContext);
  const { TweaksPanel, useTweaks, TweakSection, TweakToggle, TweakRadio, TweakColor } = window;

  const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
    "accent": "gold",
    "density": "comfortable",
    "sidebarWidth": "regular"
  }/*EDITMODE-END*/;

  const [t, setTweak] = useTweaks(TWEAK_DEFAULTS);

  const [threads, setThreads] = useState(INITIAL_THREADS);
  const [activeThread, setActiveThread] = useState(null);
  const [showBrandMemory, setShowBrandMemory] = useState(false);
  const [showShare, setShowShare] = useState(false);
  const [mobileScreen, setMobileScreen] = useState('inbox');
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  useEffect(() => {
    const onResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  // Apply accent palette to CSS vars
  useEffect(() => {
    const pal = ACCENT_PALETTES[t.accent] || ACCENT_PALETTES.gold;
    const root = document.documentElement;
    Object.entries(pal).forEach(([k, v]) => root.style.setProperty(k, v));
    // Light theme adjustments
    if (theme === 'light') {
      if (t.accent === 'gold') root.style.setProperty('--gold', '#B8882A');
      else if (t.accent === 'sapphire') root.style.setProperty('--gold', '#3A7BC0');
      else if (t.accent === 'rose') root.style.setProperty('--gold', '#B85470');
    } else {
      const pal2 = ACCENT_PALETTES[t.accent] || ACCENT_PALETTES.gold;
      root.style.setProperty('--gold', pal2['--gold']);
    }
  }, [t.accent, theme]);

  const isCompact = windowWidth < 768;
  const sidebarW = t.sidebarWidth === 'wide' ? 380 : 320;

  const handleSelectThread = (thread) => {
    setActiveThread(thread);
    if (isCompact) setMobileScreen('chat');
  };

  const handleNewShoot = () => {
    const nt = {
      id: `new-${Date.now()}`,
      name: 'New Shoot',
      model: 'Meera', category: 'Casualwear',
      lastMessage: 'Start typing to begin your shoot',
      status: 'draft', time: 'Now', renderCount: 0,
      demoStep: 0,
      messages: [
        { id: 'ni1', type: 'ai', text: "Hi — what are we shooting today? Describe the garment, upload an image, or paste a product link to get started." },
      ],
    };
    setThreads(prev => [nt, ...prev]);
    setActiveThread(nt);
    if (isCompact) setMobileScreen('chat');
  };

  const showSidebar = !isCompact || mobileScreen === 'inbox';
  const showMain = !isCompact || mobileScreen === 'chat';

  return (
    <div style={{ display: 'flex', height: '100vh', width: '100%', overflow: 'hidden', background: 'var(--bg)' }}>

      {/* ── SIDEBAR ── */}
      {showSidebar && (
        <div style={{
          width: isCompact ? '100%' : sidebarW,
          flexShrink: 0, display: 'flex', flexDirection: 'column',
          borderRight: isCompact ? 'none' : '1px solid var(--border-soft)',
          background: 'var(--surface)',
          transition: 'width .2s ease',
        }}>
          <SidebarHeader
            onToggleTheme={toggleTheme}
            theme={theme}
            onToggleBrandMemory={() => setShowBrandMemory(s => !s)}
            brandMemoryOpen={showBrandMemory}
          />
          <ShootInbox
            threads={threads}
            activeId={activeThread?.id}
            onSelect={handleSelectThread}
            onNewShoot={handleNewShoot}
          />
        </div>
      )}

      {/* ── MAIN AREA ── */}
      {showMain && (
        <div style={{ flex: 1, display: 'flex', overflow: 'hidden', position: 'relative' }}>
          {/* Chat or Welcome */}
          <div style={{ flex: 1, overflow: 'hidden' }}>
            {activeThread
              ? <window.ChatRoom
                  key={activeThread.id}
                  thread={activeThread}
                  onBack={isCompact ? () => { setMobileScreen('inbox'); setActiveThread(null); } : undefined}
                  onShareThread={() => setShowShare(true)}
                />
              : <WelcomePane onNewShoot={handleNewShoot} />
            }
          </div>

          {/* Brand Memory panel (desktop: right side) */}
          {showBrandMemory && !isCompact && (
            <div style={{
              width: 300, flexShrink: 0,
              borderLeft: '1px solid var(--border-soft)',
              overflow: 'auto',
              animation: 'mfSlideRight .2s ease forwards',
            }}>
              <BrandMemoryPanel onClose={() => setShowBrandMemory(false)} />
            </div>
          )}

          {/* Brand Memory panel (mobile: overlay) */}
          {showBrandMemory && isCompact && (
            <div style={{
              position: 'absolute', inset: 0, zIndex: 200,
              overflow: 'auto', animation: 'mfFadeIn .2s ease forwards',
            }}>
              <BrandMemoryPanel onClose={() => setShowBrandMemory(false)} />
            </div>
          )}
        </div>
      )}

      {/* Share modal */}
      {showShare && (
        <ShareModal thread={activeThread} onClose={() => setShowShare(false)} />
      )}

      {/* Tweaks Panel */}
      <TweaksPanel>
        <TweakSection label="Appearance" />
        <TweakToggle
          label="Dark mode"
          value={theme === 'dark'}
          onChange={v => { if ((v && theme !== 'dark') || (!v && theme === 'dark')) toggleTheme(); }}
        />
        <TweakColor
          label="Accent"
          value={t.accent === 'gold' ? '#C9A870' : t.accent === 'sapphire' ? '#5A9BE0' : '#D4748A'}
          options={['#C9A870', '#5A9BE0', '#D4748A']}
          onChange={v => {
            if (v === '#C9A870') setTweak('accent', 'gold');
            else if (v === '#5A9BE0') setTweak('accent', 'sapphire');
            else setTweak('accent', 'rose');
          }}
        />
        <TweakSection label="Layout" />
        <TweakRadio
          label="Sidebar"
          value={t.sidebarWidth}
          options={['regular', 'wide']}
          onChange={v => setTweak('sidebarWidth', v)}
        />
        <TweakRadio
          label="Density"
          value={t.density}
          options={['compact', 'comfortable']}
          onChange={v => setTweak('density', v)}
        />
      </TweaksPanel>
    </div>
  );
}

// Mount
const rootEl = document.getElementById('root');
const root = ReactDOM.createRoot(rootEl);
root.render(
  React.createElement(window.ThemeProvider, { initial: 'dark' },
    React.createElement(App, null)
  )
);
