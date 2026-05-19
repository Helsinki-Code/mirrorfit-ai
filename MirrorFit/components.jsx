// components.jsx — shared UI primitives for MirrorFit AI
// Exports everything to window for cross-file access

const { useState, useRef, useContext, createContext, useEffect } = React;

// ══════════════════════════════════════════
// THEME CONTEXT
// ══════════════════════════════════════════

const ThemeContext = createContext({ theme: 'dark', toggleTheme: () => {} });

function ThemeProvider({ children, initial = 'dark' }) {
  const [theme, setTheme] = useState(initial);
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);
  const toggleTheme = () => setTheme(t => t === 'dark' ? 'light' : 'dark');
  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

// ══════════════════════════════════════════
// AVATAR
// ══════════════════════════════════════════

const MODEL_GRAD = {
  Meera: ['#C9A870', '#7A4E28'],
  Aanya: ['#D4A5B5', '#8B4A61'],
  Priya: ['#B8C970', '#4E6828'],
  Zara:  ['#70A5C9', '#285A7A'],
};

function Avatar({ name = '', size = 40, online = false }) {
  const [a, b] = MODEL_GRAD[name] || ['#6A6360', '#3A3230'];
  return (
    <div style={{
      width: size, height: size, borderRadius: '50%', flexShrink: 0,
      background: `linear-gradient(140deg, ${a} 0%, ${b} 100%)`,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      position: 'relative',
      fontFamily: "'Playfair Display', serif",
      fontSize: Math.round(size * 0.38), fontWeight: 500,
      color: 'rgba(255,255,255,0.92)', letterSpacing: '-0.01em',
    }}>
      {(name[0] || '?').toUpperCase()}
      {online && (
        <div style={{
          position: 'absolute', bottom: size * 0.04, right: size * 0.04,
          width: size * 0.24, height: size * 0.24, borderRadius: '50%',
          background: 'var(--accent)', border: '2px solid var(--bg)',
        }} />
      )}
    </div>
  );
}

// ══════════════════════════════════════════
// STATUS BADGE
// ══════════════════════════════════════════

const STATUS = {
  generating: { label: 'Generating', clr: '#2ECC8A', pulse: true },
  ready:      { label: 'Ready',      clr: '#C9A870', pulse: false },
  approved:   { label: 'Approved',   clr: '#2ECC8A', pulse: false },
  draft:      { label: 'Draft',      clr: '#6A6560', pulse: false },
  shared:     { label: 'Shared',     clr: '#5A9BE0', pulse: false },
};

function StatusBadge({ status }) {
  const s = STATUS[status] || STATUS.draft;
  return (
    <div style={{
      display: 'inline-flex', alignItems: 'center', gap: 5,
      padding: '2px 8px', borderRadius: 20,
      background: `${s.clr}18`, border: `1px solid ${s.clr}38`,
      flexShrink: 0,
    }}>
      <div style={{
        width: 5, height: 5, borderRadius: '50%', background: s.clr,
        animation: s.pulse ? 'mfPulse 1.4s ease-in-out infinite' : 'none',
      }} />
      <span style={{
        fontSize: 10, color: s.clr, letterSpacing: '1.5px',
        textTransform: 'uppercase', fontFamily: "'Syne Mono', monospace",
      }}>{s.label}</span>
    </div>
  );
}

// ══════════════════════════════════════════
// GOLD TAG
// ══════════════════════════════════════════

function GoldTag({ children }) {
  return (
    <span style={{
      display: 'inline-block',
      background: 'var(--gold-dim)', border: '1px solid var(--gold-border)',
      borderRadius: 2, padding: '2px 8px',
      fontSize: 9, letterSpacing: '2px', textTransform: 'uppercase',
      color: 'var(--gold)', fontFamily: "'Syne Mono', monospace",
    }}>{children}</span>
  );
}

// ══════════════════════════════════════════
// FASHION IMAGE PLACEHOLDER
// ══════════════════════════════════════════

function FashionPlaceholder({ model, garment, setting = 'Studio Neutral', view = 'Front View' }) {
  return (
    <div style={{
      width: '100%', aspectRatio: '3/4', borderRadius: 8,
      position: 'relative', overflow: 'hidden',
      background: 'linear-gradient(160deg, #16100A 0%, #221808 45%, #16100A 100%)',
    }}>
      {/* Atmosphere layers */}
      <div style={{
        position: 'absolute', inset: 0,
        background: `
          radial-gradient(ellipse 75% 55% at 50% 22%, rgba(201,168,112,0.08) 0%, transparent 65%),
          radial-gradient(ellipse 55% 65% at 50% 78%, rgba(201,168,112,0.04) 0%, transparent 70%),
          linear-gradient(to bottom, transparent 50%, rgba(10,8,6,0.88) 100%)
        `,
      }} />
      {/* Fine grain texture */}
      <div style={{
        position: 'absolute', inset: 0,
        backgroundImage: 'repeating-linear-gradient(90deg, transparent, transparent 3px, rgba(255,255,255,0.007) 3px, rgba(255,255,255,0.007) 6px)',
      }} />
      {/* Soft model glow */}
      <div style={{
        position: 'absolute', bottom: '12%', left: '50%',
        transform: 'translateX(-50%)',
        width: '55%', height: '62%',
        borderRadius: '42% 42% 32% 32% / 16% 16% 38% 38%',
        background: 'rgba(201,168,112,0.055)', filter: 'blur(28px)',
      }} />
      {/* Center watermark */}
      <div style={{
        position: 'absolute', top: '45%', left: '50%',
        transform: 'translate(-50%,-50%)',
        textAlign: 'center', opacity: 0.1, pointerEvents: 'none',
      }}>
        <div style={{ fontFamily: "'Syne Mono',monospace", fontSize: 8, letterSpacing: '5px', textTransform: 'uppercase', color: '#C9A870' }}>
          AI GENERATED
        </div>
      </div>
      {/* Bottom label */}
      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0,
        padding: '32px 14px 14px',
        background: 'linear-gradient(to top, rgba(10,8,6,0.97), transparent)',
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
          <div>
            <div style={{ fontFamily: "'Syne',sans-serif", fontSize: 10, color: 'rgba(201,168,112,0.65)', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: 3 }}>
              {model}
            </div>
            <div style={{ fontFamily: "'Playfair Display',serif", fontSize: 14, color: '#EAE6DF', lineHeight: 1.25, fontStyle: 'italic' }}>
              {garment}
            </div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontFamily: "'Syne Mono',monospace", fontSize: 9, color: 'rgba(80,75,70,0.9)', marginBottom: 2 }}>{setting}</div>
            <div style={{ fontFamily: "'Syne Mono',monospace", fontSize: 9, color: 'rgba(80,75,70,0.9)' }}>{view}</div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ══════════════════════════════════════════
// TYPING INDICATOR
// ══════════════════════════════════════════

function TypingIndicator() {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 5,
      padding: '10px 14px', background: 'var(--card)',
      border: '1px solid var(--border)',
      borderRadius: '14px 14px 14px 4px', width: 'fit-content',
    }}>
      {[0, 0.22, 0.44].map((d, i) => (
        <div key={i} style={{
          width: 6, height: 6, borderRadius: '50%',
          background: 'var(--text-dim)',
          animation: `mfBounce 1.2s ${d}s ease-in-out infinite`,
        }} />
      ))}
    </div>
  );
}

// ══════════════════════════════════════════
// SYSTEM PILL
// ══════════════════════════════════════════

function SystemPill({ text, variant = 'default', animated = false }) {
  const vars = {
    default:    { bg: 'var(--card)',        bd: 'var(--border)',              tx: 'var(--text-dim)' },
    generating: { bg: 'var(--accent-dim)', bd: 'rgba(46,204,138,.22)',       tx: 'var(--accent)'   },
    gold:       { bg: 'var(--gold-dim)',   bd: 'var(--gold-border)',          tx: 'var(--gold)'     },
    safety:     { bg: 'rgba(224,90,90,.07)', bd: 'rgba(224,90,90,.22)',      tx: 'var(--red)'      },
    success:    { bg: 'var(--accent-dim)', bd: 'rgba(46,204,138,.22)',       tx: 'var(--accent)'   },
  };
  const v = vars[variant] || vars.default;
  return (
    <div style={{ display: 'flex', justifyContent: 'center', padding: '4px 0' }}>
      <div style={{
        display: 'inline-flex', alignItems: 'center', gap: 8,
        padding: '5px 16px', borderRadius: 20,
        background: v.bg, border: `1px solid ${v.bd}`,
      }}>
        {animated && (
          <div style={{
            width: 5, height: 5, borderRadius: '50%', background: 'var(--accent)',
            animation: 'mfPulse 1.4s ease-in-out infinite',
          }} />
        )}
        <span style={{ fontSize: 11, color: v.tx, fontFamily: "'Syne Mono',monospace", letterSpacing: '.5px' }}>
          {text}
        </span>
      </div>
    </div>
  );
}

// ══════════════════════════════════════════
// CHAT BUBBLE
// ══════════════════════════════════════════

function ChatBubble({ role, children, style = {} }) {
  const isUser = role === 'user';
  return (
    <div style={{
      display: 'flex',
      justifyContent: isUser ? 'flex-end' : 'flex-start',
      marginBottom: 2,
    }}>
      <div style={{
        maxWidth: '78%', padding: '10px 14px',
        borderRadius: isUser ? '14px 14px 4px 14px' : '14px 14px 14px 4px',
        background: isUser ? 'var(--bubble-user-bg)' : 'var(--card)',
        border: `1px solid ${isUser ? 'var(--bubble-user-border)' : 'var(--border)'}`,
        color: isUser ? 'var(--text)' : 'var(--text-mid)',
        fontSize: 13.5, lineHeight: 1.65,
        fontFamily: "'Syne', sans-serif",
        animation: 'mfFadeIn .3s ease forwards',
        ...style,
      }}>
        {children}
      </div>
    </div>
  );
}

// ══════════════════════════════════════════
// QUICK FIX CHIPS
// ══════════════════════════════════════════

function QuickFixChips({ chips = [], onChip }) {
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 10 }}>
      {chips.map((chip, i) => (
        <button key={i} onClick={() => onChip && onChip(chip)} style={{
          padding: '5px 12px', borderRadius: 20,
          border: '1px solid var(--border)',
          background: 'var(--card)', color: 'var(--text-mid)',
          fontSize: 11, cursor: 'pointer',
          fontFamily: "'Syne Mono', monospace",
          transition: 'border-color .18s, color .18s',
          letterSpacing: '.3px',
        }}
        onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--gold)'; e.currentTarget.style.color = 'var(--gold)'; }}
        onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'var(--text-mid)'; }}
        >{chip}</button>
      ))}
    </div>
  );
}

// ══════════════════════════════════════════
// MISSING INFO CARD
// ══════════════════════════════════════════

function MissingInfoCard({ infoType, onComplete }) {
  const [done, setDone] = useState(false);

  const handleAction = (val) => {
    setDone(true);
    setTimeout(() => onComplete && onComplete(val), 350);
  };

  if (done) {
    return (
      <div style={{
        padding: '11px 16px', borderRadius: 8,
        background: 'var(--accent-dim)', border: '1px solid rgba(46,204,138,.22)',
        color: 'var(--accent)', fontSize: 12,
        fontFamily: "'Syne Mono', monospace", letterSpacing: '.4px',
      }}>
        ✦ {infoType === 'garment' ? 'Garment image received — analysing…' : 'Selection confirmed'}
      </div>
    );
  }

  if (infoType === 'garment') {
    return (
      <div style={{
        background: 'var(--card)', border: '1px solid var(--border)',
        borderRadius: 8, padding: '16px 18px',
        animation: 'mfFadeIn .3s ease forwards',
      }}>
        <div style={{ fontSize: 10, color: 'var(--text-dim)', letterSpacing: '2.5px', textTransform: 'uppercase', fontFamily: "'Syne Mono',monospace", marginBottom: 12 }}>
          Garment Image Needed
        </div>
        <button onClick={() => handleAction('garment')} style={{
          width: '100%', padding: '20px 16px',
          border: '1.5px dashed rgba(201,168,112,.3)', borderRadius: 6,
          background: 'transparent', cursor: 'pointer', textAlign: 'center',
          transition: 'border-color .2s',
        }}
        onMouseEnter={e => e.currentTarget.style.borderColor = 'rgba(201,168,112,.65)'}
        onMouseLeave={e => e.currentTarget.style.borderColor = 'rgba(201,168,112,.3)'}
        >
          <div style={{ fontSize: 20, marginBottom: 8 }}>📎</div>
          <div style={{ fontFamily: "'Syne',sans-serif", fontSize: 12, color: 'var(--text-mid)' }}>
            Tap to upload garment image
          </div>
          <div style={{ fontFamily: "'Syne Mono',monospace", fontSize: 10, color: 'var(--text-dim)', marginTop: 5, letterSpacing: '1px' }}>
            JPG · PNG · WebP · Max 20 MB
          </div>
        </button>
      </div>
    );
  }

  if (infoType === 'model') {
    const models = ['Meera', 'Aanya', 'Priya', 'Zara'];
    return (
      <div style={{
        background: 'var(--card)', border: '1px solid var(--border)',
        borderRadius: 8, padding: '16px 18px',
        animation: 'mfFadeIn .3s ease forwards',
      }}>
        <div style={{ fontSize: 10, color: 'var(--text-dim)', letterSpacing: '2.5px', textTransform: 'uppercase', fontFamily: "'Syne Mono',monospace", marginBottom: 14 }}>
          Select Model
        </div>
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
          {models.map(m => (
            <button key={m} onClick={() => handleAction(m)} style={{
              display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 7,
              padding: '10px 14px', background: 'var(--surface)',
              border: '1px solid var(--border)', borderRadius: 8,
              cursor: 'pointer', transition: 'border-color .18s',
            }}
            onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--gold)'}
            onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border)'}
            >
              <Avatar name={m} size={36} />
              <span style={{ fontSize: 11, color: 'var(--text-mid)', fontFamily: "'Syne',sans-serif" }}>{m}</span>
            </button>
          ))}
        </div>
      </div>
    );
  }

  if (infoType === 'size') {
    const sizes = ['Marketplace 1:1', 'Instagram 4:5', 'Story 9:16', 'Full Body', 'Banner'];
    return (
      <div style={{
        background: 'var(--card)', border: '1px solid var(--border)',
        borderRadius: 8, padding: '16px 18px',
        animation: 'mfFadeIn .3s ease forwards',
      }}>
        <div style={{ fontSize: 10, color: 'var(--text-dim)', letterSpacing: '2.5px', textTransform: 'uppercase', fontFamily: "'Syne Mono',monospace", marginBottom: 12 }}>
          Output Format
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
          {sizes.map(s => (
            <button key={s} onClick={() => handleAction(s)} style={{
              padding: '7px 14px', borderRadius: 6,
              border: '1px solid var(--border)', background: 'var(--surface)',
              color: 'var(--text-mid)', fontSize: 12,
              fontFamily: "'Syne Mono',monospace", cursor: 'pointer',
              transition: 'all .18s',
            }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--gold)'; e.currentTarget.style.color = 'var(--gold)'; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'var(--text-mid)'; }}
            >{s}</button>
          ))}
        </div>
      </div>
    );
  }
  return null;
}

// ══════════════════════════════════════════
// SAFETY REWRITE CARD
// ══════════════════════════════════════════

function SafetyRewriteCard({ before = '"sexy bikini shoot on Meera"', after = '"Tasteful adult swimwear catalogue render on Meera — beachwear editorial style."' }) {
  const [open, setOpen] = useState(true);
  return (
    <div style={{
      background: 'rgba(201,168,112,.06)', border: '1px solid rgba(201,168,112,.22)',
      borderRadius: 8, padding: '12px 16px',
      animation: 'mfFadeIn .3s ease forwards',
    }}>
      <div style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        cursor: 'pointer', userSelect: 'none',
      }} onClick={() => setOpen(o => !o)}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 11, color: 'var(--gold)', fontFamily: "'Syne Mono',monospace", letterSpacing: '1.5px', textTransform: 'uppercase' }}>
          <span>⟳</span> Rephrased as catalogue language
        </div>
        <span style={{ fontSize: 10, color: 'var(--text-dim)' }}>{open ? '▲' : '▼'}</span>
      </div>
      {open && (
        <div style={{ marginTop: 12, display: 'flex', flexDirection: 'column', gap: 10 }}>
          <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
            <span style={{ fontFamily: "'Syne Mono',monospace", fontSize: 10, color: 'var(--red)', flexShrink: 0, marginTop: 2, letterSpacing: '1px' }}>BEFORE</span>
            <span style={{ fontFamily: "'Syne Mono',monospace", fontSize: 12, color: 'var(--text-dim)', lineHeight: 1.5 }}>{before}</span>
          </div>
          <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
            <span style={{ fontFamily: "'Syne Mono',monospace", fontSize: 10, color: 'var(--accent)', flexShrink: 0, marginTop: 2, letterSpacing: '1.2px' }}>AFTER</span>
            <span style={{ fontFamily: "'Syne Mono',monospace", fontSize: 12, color: 'var(--text-mid)', lineHeight: 1.5 }}>{after}</span>
          </div>
        </div>
      )}
    </div>
  );
}

// ══════════════════════════════════════════
// PROMPT REWRITE CARD
// ══════════════════════════════════════════

function PromptRewriteCard({ rewritten, onApprove }) {
  const [open, setOpen] = useState(true);
  const [approved, setApproved] = useState(false);

  const handleApprove = () => {
    setApproved(true);
    onApprove && onApprove();
  };

  return (
    <div style={{
      background: 'var(--card)', border: '1px solid var(--border)',
      borderRadius: 8, padding: '14px 16px',
      animation: 'mfFadeIn .3s ease forwards',
    }}>
      <div style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        cursor: 'pointer', userSelect: 'none', marginBottom: open ? 12 : 0,
      }} onClick={() => setOpen(o => !o)}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 11, color: 'var(--text-mid)', fontFamily: "'Syne Mono',monospace", letterSpacing: '1.5px', textTransform: 'uppercase' }}>
          <span style={{ color: 'var(--accent)' }}>✦</span> Generation Brief
          {approved && <span style={{ color: 'var(--accent)', fontSize: 10 }}> · Approved</span>}
        </div>
        <span style={{ fontSize: 10, color: 'var(--text-dim)' }}>{open ? '▲' : '▼'}</span>
      </div>
      {open && (
        <div>
          <div style={{
            fontFamily: "'Syne Mono',monospace", fontSize: 12, color: 'var(--text-mid)',
            lineHeight: 1.75, marginBottom: 14,
            borderLeft: '2px solid var(--border)', paddingLeft: 12,
          }}>
            {rewritten}
          </div>
          {!approved ? (
            <div style={{ display: 'flex', gap: 8 }}>
              <button onClick={handleApprove} style={{
                padding: '7px 16px', borderRadius: 6,
                background: 'var(--accent)', border: 'none',
                color: '#fff', fontSize: 11.5,
                fontFamily: "'Syne',sans-serif", fontWeight: 600, cursor: 'pointer',
                letterSpacing: '.3px',
              }}>Approve & Generate</button>
              <button style={{
                padding: '7px 16px', borderRadius: 6,
                background: 'transparent', border: '1px solid var(--border)',
                color: 'var(--text-dim)', fontSize: 11.5,
                fontFamily: "'Syne',sans-serif", cursor: 'pointer',
              }}>Edit Brief</button>
            </div>
          ) : (
            <div style={{ fontSize: 11, color: 'var(--accent)', fontFamily: "'Syne Mono',monospace" }}>
              ✓ Brief approved · Generating now
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ══════════════════════════════════════════
// RESULT IMAGE CARD
// ══════════════════════════════════════════

function ResultImageCard({ model, garment, setting, view, onChip, onExpand }) {
  const [approved, setApproved] = useState(false);
  const chips = ['Generate back view', 'Improve garment detail', 'White background', 'Make more editorial', 'Marketplace crop', 'Fix neckline'];

  return (
    <div style={{ animation: 'mfFadeIn .4s ease forwards' }}>
      <div style={{ position: 'relative' }}>
        <FashionPlaceholder model={model} garment={garment} setting={setting} view={view} />
        <button onClick={onExpand} style={{
          position: 'absolute', top: 10, right: 10,
          width: 30, height: 30, borderRadius: 6,
          background: 'rgba(10,8,6,.72)', border: '1px solid rgba(201,168,112,.2)',
          color: 'rgba(201,168,112,.8)', fontSize: 13, cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          backdropFilter: 'blur(8px)',
        }}>⤢</button>
      </div>
      {/* Quality badges */}
      <div style={{ display: 'flex', gap: 5, marginTop: 10, flexWrap: 'wrap' }}>
        {['Identity: Strong', 'Garment: Accurate', 'Pose: Natural'].map((b, i) => (
          <div key={i} style={{
            padding: '3px 9px', borderRadius: 4,
            background: 'var(--accent-dim)', border: '1px solid rgba(46,204,138,.22)',
            fontSize: 10, color: 'var(--accent)',
            fontFamily: "'Syne Mono',monospace", letterSpacing: '.4px',
          }}>{b}</div>
        ))}
      </div>
      {/* Quick Fix */}
      <QuickFixChips chips={chips} onChip={onChip} />
      {/* Approve */}
      <div style={{ marginTop: 10 }}>
        <button onClick={() => setApproved(a => !a)} style={{
          padding: '7px 18px', borderRadius: 6,
          background: approved ? 'var(--accent)' : 'transparent',
          border: `1px solid ${approved ? 'var(--accent)' : 'var(--gold-border)'}`,
          color: approved ? '#fff' : 'var(--gold)',
          fontSize: 11.5, fontFamily: "'Syne',sans-serif",
          fontWeight: 600, cursor: 'pointer', transition: 'all .2s',
        }}>
          {approved ? '✓ Approved — ready to export' : 'Approve & Export'}
        </button>
      </div>
    </div>
  );
}

// ══════════════════════════════════════════
// IMAGE EXPAND MODAL
// ══════════════════════════════════════════

function ImageModal({ model, garment, setting, view, onClose }) {
  return (
    <div style={{
      position: 'fixed', inset: 0, background: 'rgba(0,0,0,.88)',
      zIndex: 9000, display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: 24, backdropFilter: 'blur(12px)',
      animation: 'mfFadeIn .2s ease forwards',
    }} onClick={onClose}>
      <div style={{ maxWidth: 420, width: '100%', position: 'relative' }}
        onClick={e => e.stopPropagation()}>
        <FashionPlaceholder model={model} garment={garment} setting={setting} view={view} />
        <button onClick={onClose} style={{
          position: 'absolute', top: -40, right: 0,
          background: 'none', border: 'none', color: 'rgba(234,230,223,.6)',
          fontSize: 24, cursor: 'pointer',
        }}>✕</button>
      </div>
    </div>
  );
}

// ══════════════════════════════════════════
// EXPORTS
// ══════════════════════════════════════════

Object.assign(window, {
  ThemeContext, ThemeProvider,
  Avatar, StatusBadge, GoldTag,
  FashionPlaceholder,
  TypingIndicator, SystemPill,
  ChatBubble, QuickFixChips,
  MissingInfoCard, SafetyRewriteCard,
  PromptRewriteCard, ResultImageCard,
  ImageModal,
});
