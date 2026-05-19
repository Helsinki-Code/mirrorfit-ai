// chat-room.jsx — Chat Shoot Room: main production interface

const { useState, useEffect, useRef, useContext } = React;

// Pull shared components from window (set by components.jsx which loads first)
const _cr = () => window;

const DEMO_PROMPT = `Professional e-commerce catalogue render of Meera wearing the navy satin camisole mini dress. Preserve model identity: face structure, skin tone, body proportions. Garment: navy blue, satin sheen, thin shoulder straps, decorative upper panel, short hemline, relaxed drape. Setting: clean studio lighting, soft white/neutral background. Full-body front view. Catalogue-ready — tasteful, product-focused, non-explicit.`;

// ══════════════════════════════════════════
// MESSAGE RENDERER
// ══════════════════════════════════════════

function MessageRenderer({ msg, onGarmentUploaded, onPromptApproved, onChip, onExpand }) {
  const { ChatBubble, SystemPill, TypingIndicator, MissingInfoCard,
          SafetyRewriteCard, PromptRewriteCard, ResultImageCard } = window;

  switch (msg.type) {
    case 'user':
      return <ChatBubble role="user">{msg.text}</ChatBubble>;
    case 'ai':
      return <ChatBubble role="ai">{msg.text}</ChatBubble>;
    case 'system':
      return <SystemPill text={msg.text} variant={msg.variant || 'default'} animated={!!msg.animated} />;
    case 'missing-info':
      return (
        <div style={{ maxWidth: '88%' }}>
          {msg.aiText && <ChatBubble role="ai">{msg.aiText}</ChatBubble>}
          <div style={{ marginTop: 8 }}>
            <MissingInfoCard infoType={msg.infoType} onComplete={msg.infoType === 'garment' ? onGarmentUploaded : undefined} />
          </div>
        </div>
      );
    case 'safety':
      return (
        <div style={{ maxWidth: '88%' }}>
          <SafetyRewriteCard before={msg.before} after={msg.after} />
        </div>
      );
    case 'prompt':
      return (
        <div style={{ maxWidth: '90%' }}>
          <PromptRewriteCard rewritten={msg.rewritten} onApprove={onPromptApproved} />
        </div>
      );
    case 'result':
      return (
        <div style={{ maxWidth: '85%' }}>
          <ResultImageCard
            model={msg.model} garment={msg.garment}
            setting={msg.setting} view={msg.view}
            onChip={onChip}
            onExpand={() => onExpand && onExpand(msg)}
          />
        </div>
      );
    default:
      return null;
  }
}

// ══════════════════════════════════════════
// CHAT HEADER
// ══════════════════════════════════════════

function ChatHeader({ thread, onBack, isGenerating, onShareThread }) {
  const { Avatar, StatusBadge } = window;
  const [showMenu, setShowMenu] = useState(false);

  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 12,
      padding: '13px 18px',
      borderBottom: '1px solid var(--border-soft)',
      background: 'var(--surface)', flexShrink: 0,
      position: 'relative',
    }}>
      {onBack && (
        <button onClick={onBack} style={{
          background: 'none', border: 'none', cursor: 'pointer',
          color: 'var(--text-mid)', fontSize: 20, padding: '0 4px 0 0',
          display: 'flex', alignItems: 'center', flexShrink: 0,
          lineHeight: 1,
        }}>←</button>
      )}
      <Avatar name={thread.model} size={38} online={thread.status === 'generating' || isGenerating} />
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{
          fontFamily: "'Playfair Display', serif", fontSize: 15,
          color: 'var(--text)', fontWeight: 500, lineHeight: 1.2,
          whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
        }}>{thread.name}</div>
        <div style={{
          fontFamily: "'Syne Mono', monospace", fontSize: 10,
          color: 'var(--text-dim)', letterSpacing: '.8px', marginTop: 2,
        }}>
          {thread.model} · {thread.category}
          {thread.renderCount > 0 && ` · ${thread.renderCount} renders`}
        </div>
      </div>
      <StatusBadge status={isGenerating ? 'generating' : thread.status} />
      <div style={{ position: 'relative' }}>
        <button onClick={() => setShowMenu(m => !m)} style={{
          background: 'none', border: '1px solid var(--border)',
          borderRadius: 6, cursor: 'pointer',
          color: 'var(--text-dim)', fontSize: 16, padding: '5px 10px',
          display: 'flex', alignItems: 'center', letterSpacing: '2px',
        }}>···</button>
        {showMenu && (
          <div style={{
            position: 'absolute', right: 0, top: '110%',
            background: 'var(--surface)', border: '1px solid var(--border)',
            borderRadius: 8, padding: '6px 0', zIndex: 100,
            minWidth: 170, boxShadow: 'var(--shadow)',
            animation: 'mfFadeIn .15s ease forwards',
          }}>
            {[
              { icon: '🔗', label: 'Share Thread', action: onShareThread },
              { icon: '📥', label: 'Export All Renders', action: () => {} },
              { icon: '🧠', label: 'View Brand Memory', action: () => {} },
              { icon: '🗑', label: 'Delete Shoot', action: () => {} },
            ].map(item => (
              <button key={item.label} onClick={() => { item.action && item.action(); setShowMenu(false); }} style={{
                display: 'flex', alignItems: 'center', gap: 10,
                width: '100%', padding: '9px 16px',
                background: 'none', border: 'none', cursor: 'pointer',
                color: 'var(--text-mid)', fontSize: 13,
                fontFamily: "'Syne', sans-serif", textAlign: 'left',
                transition: 'background .15s',
              }}
              onMouseEnter={e => e.currentTarget.style.background = 'var(--card)'}
              onMouseLeave={e => e.currentTarget.style.background = 'none'}
              >
                <span>{item.icon}</span>{item.label}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ══════════════════════════════════════════
// CHAT INPUT
// ══════════════════════════════════════════

function ChatInput({ value, onChange, onSend, onKeyDown, disabled }) {
  const taRef = useRef(null);

  useEffect(() => {
    if (!taRef.current) return;
    taRef.current.style.height = 'auto';
    taRef.current.style.height = Math.min(taRef.current.scrollHeight, 120) + 'px';
  }, [value]);

  return (
    <div style={{
      padding: '12px 16px',
      borderTop: '1px solid var(--border-soft)',
      background: 'var(--surface)', flexShrink: 0,
    }}>
      <div style={{
        display: 'flex', alignItems: 'flex-end', gap: 10,
        background: 'var(--card)', border: '1px solid var(--border)',
        borderRadius: 18, padding: '8px 12px',
        transition: 'border-color .18s',
      }}
      onFocusCapture={e => e.currentTarget.style.borderColor = 'var(--gold-border)'}
      onBlurCapture={e => e.currentTarget.style.borderColor = 'var(--border)'}
      >
        <button style={{
          background: 'none', border: 'none', cursor: 'pointer',
          color: 'var(--text-dim)', fontSize: 18, flexShrink: 0,
          padding: '2px', display: 'flex', alignItems: 'center',
        }}>📎</button>
        <textarea
          ref={taRef}
          value={value}
          onChange={onChange}
          onKeyDown={onKeyDown}
          disabled={disabled}
          placeholder="Describe your shoot — model, garment, style…"
          rows={1}
          style={{
            flex: 1, background: 'none', border: 'none', outline: 'none',
            color: 'var(--text)', fontSize: 13.5,
            fontFamily: "'Syne', sans-serif", lineHeight: 1.55,
            resize: 'none', overflow: 'hidden',
            opacity: disabled ? 0.5 : 1,
          }}
        />
        <button style={{
          background: 'none', border: 'none', cursor: 'pointer',
          color: 'var(--text-dim)', fontSize: 16, flexShrink: 0,
          padding: '2px', display: 'flex', alignItems: 'center',
        }}>🎙</button>
        <button onClick={onSend} disabled={!value.trim() || disabled} style={{
          width: 32, height: 32, borderRadius: '50%', flexShrink: 0,
          background: value.trim() && !disabled ? 'var(--gold)' : 'var(--border)',
          border: 'none', cursor: value.trim() && !disabled ? 'pointer' : 'default',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          transition: 'background .2s',
          color: value.trim() && !disabled ? (document.documentElement.getAttribute('data-theme') === 'light' ? '#fff' : '#07080A') : 'var(--text-dim)',
          fontSize: 15, fontWeight: 700,
        }}>↑</button>
      </div>
      <div style={{
        fontFamily: "'Syne Mono',monospace", fontSize: 9,
        color: 'var(--text-dim)', textAlign: 'center',
        marginTop: 7, letterSpacing: '.4px',
      }}>
        Enter to send · Shift+Enter for new line · ⌘K for voice
      </div>
    </div>
  );
}

// ══════════════════════════════════════════
// CHAT ROOM (main component)
// ══════════════════════════════════════════

function ChatRoom({ thread, onBack, onShareThread }) {
  const [messages, setMessages] = useState(thread.messages || [
    { id: 'init', type: 'ai', text: "Hi — what are we shooting today? Describe the garment, upload an image, or paste a product link to get started." },
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [demoStep, setDemoStep] = useState(thread.demoStep !== undefined ? thread.demoStep : -1);
  const [expandedImg, setExpandedImg] = useState(null);
  const endRef = useRef(null);

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    if (endRef.current) {
      const el = endRef.current.parentElement;
      el.scrollTop = el.scrollHeight;
    }
  }, [messages, isTyping]);

  const uid = () => `m${Date.now()}-${Math.random().toString(36).slice(2)}`;

  const push = (msg) => setMessages(prev => [...prev, { id: uid(), ...msg }]);

  const typeDelay = (fn, ms = 1400) => {
    setIsTyping(true);
    return setTimeout(() => { setIsTyping(false); fn(); }, ms);
  };

  // ── Send handler ──
  const handleSend = () => {
    if (!input.trim() || isGenerating) return;
    const text = input.trim();
    setInput('');
    push({ type: 'user', text });

    if (demoStep === 0) {
      // Fresh thread — trigger full demo flow
      typeDelay(() => {
        push({ type: 'missing-info', infoType: 'garment', aiText: "Got it — I'll need the garment image to proceed. Drop it below or upload from your library." });
        setDemoStep(1);
      }, 1200);
    } else if (demoStep === 10) {
      // After first result shown — user typed a correction
      typeDelay(() => {
        push({ type: 'ai', text: `Understood — applying your correction and re-rendering.` });
        setTimeout(() => {
          push({ type: 'system', text: '✦ Re-rendering with correction · ~30s', variant: 'generating', animated: true });
          setIsGenerating(true);
          setTimeout(() => {
            setIsGenerating(false);
            push({ type: 'result', model: 'Meera', garment: 'Navy Satin Dress', setting: 'Studio Neutral', view: 'Revised Front View' });
          }, 3000);
        }, 700);
      });
    } else {
      // Generic AI response for any other thread
      typeDelay(() => {
        const replies = [
          "On it — processing your request and adjusting the render.",
          "Got it. Analysing the instruction and applying it to the next version.",
          "Sure — I'll apply that adjustment and generate an updated render now.",
        ];
        push({ type: 'ai', text: replies[Math.floor(Math.random() * replies.length)] });
      }, 1100);
    }
  };

  // ── Garment uploaded ──
  const handleGarmentUploaded = () => {
    setTimeout(() => {
      push({ type: 'system', text: 'Garment received · Analysing fabric, colour and silhouette', variant: 'default' });
      typeDelay(() => {
        push({ type: 'prompt', rewritten: DEMO_PROMPT });
        setDemoStep(2);
      }, 1400);
    }, 500);
  };

  // ── Prompt approved ──
  const handlePromptApproved = () => {
    setTimeout(() => {
      push({ type: 'system', text: '✦ Rendering · Meera · Navy Satin Dress · Studio Neutral · ~45s', variant: 'generating', animated: true });
      setIsGenerating(true);
      setTimeout(() => {
        setIsGenerating(false);
        push({ type: 'result', model: 'Meera', garment: 'Navy Satin Dress', setting: 'Studio Neutral', view: 'Front View' });
        setDemoStep(10);
      }, 4500);
    }, 500);
  };

  // ── Quick fix chip tapped ──
  const handleChip = (chip) => {
    push({ type: 'user', text: chip });
    typeDelay(() => {
      push({ type: 'ai', text: `${chip} — applying targeted adjustment and re-rendering now.` });
      setTimeout(() => {
        const isBack = chip.toLowerCase().includes('back');
        const isDetail = chip.toLowerCase().includes('detail') || chip.toLowerCase().includes('close');
        const view = isBack ? 'Back View' : isDetail ? 'Detail Close-up' : 'Front View — Revised';
        push({ type: 'system', text: `✦ Rendering · ${chip} · ~28s`, variant: 'generating', animated: true });
        setIsGenerating(true);
        setTimeout(() => {
          setIsGenerating(false);
          push({ type: 'result', model: 'Meera', garment: 'Navy Satin Dress', setting: 'Studio Neutral', view });
        }, 3200);
      }, 600);
    }, 1100);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); }
  };

  const { TypingIndicator, ImageModal } = window;

  return (
    <div style={{
      display: 'flex', flexDirection: 'column',
      height: '100%', background: 'var(--bg)',
      position: 'relative',
    }}>
      <ChatHeader
        thread={thread}
        onBack={onBack}
        isGenerating={isGenerating}
        onShareThread={onShareThread}
      />

      {/* Messages */}
      <div style={{
        flex: 1, overflow: 'auto', padding: '20px 20px 8px',
        display: 'flex', flexDirection: 'column', gap: 10,
      }}>
        {messages.map(msg => (
          <MessageRenderer
            key={msg.id}
            msg={msg}
            onGarmentUploaded={handleGarmentUploaded}
            onPromptApproved={handlePromptApproved}
            onChip={handleChip}
            onExpand={setExpandedImg}
          />
        ))}
        {isTyping && (
          <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
            <TypingIndicator />
          </div>
        )}
        <div ref={endRef} style={{ height: 1 }} />
      </div>

      <ChatInput
        value={input}
        onChange={e => setInput(e.target.value)}
        onSend={handleSend}
        onKeyDown={handleKeyDown}
        disabled={isGenerating}
      />

      {/* Fullscreen image modal */}
      {expandedImg && (
        <ImageModal
          model={expandedImg.model}
          garment={expandedImg.garment}
          setting={expandedImg.setting}
          view={expandedImg.view}
          onClose={() => setExpandedImg(null)}
        />
      )}
    </div>
  );
}

Object.assign(window, { ChatRoom, ChatHeader, ChatInput });
