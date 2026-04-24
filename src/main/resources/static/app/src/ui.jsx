// Shared UI primitives — Card, Chip, Button, Sheet, etc.

const { useState, useEffect, useRef, useMemo } = React;

function Card({ children, style, onClick, interactive, className='' }) {
  return (
    <div
      onClick={onClick}
      className={className}
      style={{
        background: '#fff',
        borderRadius: 20,
        border: '1px solid var(--line)',
        boxShadow: '0 1px 2px rgba(10,30,45,0.03), 0 8px 24px -12px rgba(10,30,45,0.08)',
        cursor: interactive ? 'pointer' : 'default',
        transition: 'transform .2s ease, box-shadow .2s ease',
        ...style,
      }}
      onMouseEnter={e => { if (interactive) e.currentTarget.style.transform = 'translateY(-1px)'; }}
      onMouseLeave={e => { if (interactive) e.currentTarget.style.transform = 'translateY(0)'; }}
    >{children}</div>
  );
}

function Chip({ active, children, onClick, tone='neutral' }) {
  const tones = {
    neutral: { bg: active ? 'var(--ink)' : '#fff', fg: active ? '#fff' : 'var(--ink-2)', bd: active ? 'var(--ink)' : 'var(--line)' },
    brand:   { bg: active ? 'var(--brand)' : 'var(--brand-50)', fg: active ? '#fff' : 'var(--brand)', bd: 'transparent' },
  };
  const t = tones[tone];
  return (
    <button onClick={onClick}
      style={{
        padding: '8px 14px', borderRadius: 999,
        background: t.bg, color: t.fg, border: `1px solid ${t.bd}`,
        fontSize: 13, fontWeight: 600, whiteSpace: 'nowrap',
        cursor: 'pointer', transition: 'all .18s',
      }}>{children}</button>
  );
}

function PrimaryButton({ children, onClick, style, icon, disabled }) {
  return (
    <button onClick={onClick} disabled={disabled}
      style={{
        width: '100%', height: 52, borderRadius: 16, border: 'none',
        background: disabled ? '#c7d2dc' : 'var(--brand)',
        color: '#fff', fontSize: 15, fontWeight: 700,
        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
        boxShadow: disabled ? 'none' : '0 8px 20px -6px rgba(10,132,200,.45)',
        cursor: disabled ? 'not-allowed' : 'pointer', transition: 'transform .15s',
        ...style,
      }}
      onMouseDown={e => !disabled && (e.currentTarget.style.transform = 'scale(.98)')}
      onMouseUp={e => !disabled && (e.currentTarget.style.transform = 'scale(1)')}
    >
      {icon}{children}
    </button>
  );
}

function GhostButton({ children, onClick, style, icon }) {
  return (
    <button onClick={onClick}
      style={{
        height: 44, padding: '0 16px', borderRadius: 12,
        background: '#fff', border: '1px solid var(--line)',
        color: 'var(--ink)', fontSize: 14, fontWeight: 600,
        display: 'inline-flex', alignItems: 'center', gap: 8, cursor: 'pointer',
        ...style,
      }}>{icon}{children}</button>
  );
}

function Sheet({ open, onClose, children, title, height='auto' }) {
  return (
    <div style={{
      position: 'absolute', inset: 0, zIndex: 200,
      pointerEvents: open ? 'auto' : 'none',
    }}>
      {/* backdrop */}
      <div onClick={onClose} style={{
        position: 'absolute', inset: 0,
        background: 'rgba(10,30,45,.35)',
        opacity: open ? 1 : 0, transition: 'opacity .22s',
        backdropFilter: 'blur(2px)',
      }}/>
      {/* sheet */}
      <div style={{
        position: 'absolute', left: 0, right: 0, bottom: 0,
        background: '#fff', borderRadius: '24px 24px 0 0',
        transform: open ? 'translateY(0)' : 'translateY(100%)',
        transition: 'transform .28s cubic-bezier(.22,.7,.32,1)',
        maxHeight: '86%', overflow: 'hidden',
        boxShadow: '0 -24px 60px rgba(10,30,45,.18)',
        display: 'flex', flexDirection: 'column', height,
      }}>
        <div style={{ display: 'flex', justifyContent: 'center', paddingTop: 10 }}>
          <div style={{ width: 44, height: 5, borderRadius: 10, background: '#d7dfe6' }}/>
        </div>
        {title && (
          <div style={{ padding: '14px 20px 8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ fontSize: 18, fontWeight: 700 }}>{title}</div>
            <button onClick={onClose} style={{ width: 32, height: 32, border: 'none', background: '#f1f4f7', borderRadius: 999, cursor: 'pointer' }}>
              <Ic.close width={16} height={16} style={{display:'block',margin:'auto',color:'var(--ink-2)'}}/>
            </button>
          </div>
        )}
        <div style={{ overflowY: 'auto', flex: 1, padding: '0 20px 28px' }} className="phone-scroll">{children}</div>
      </div>
    </div>
  );
}

function Badge({ children, tone='brand' }) {
  const tones = {
    brand: { bg: 'var(--brand-50)', fg: 'var(--brand)' },
    green: { bg: '#e9f6df', fg: 'var(--accent-600)' },
    amber: { bg: '#fff4e0', fg: '#b8770e' },
    red:   { bg: '#fde7e7', fg: '#b53a3a' },
    gray:  { bg: '#eef2f6', fg: '#546474' },
  };
  const t = tones[tone] || tones.brand;
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 4,
      padding: '3px 9px', borderRadius: 999,
      background: t.bg, color: t.fg,
      fontSize: 11, fontWeight: 700, letterSpacing: .2,
      textTransform: 'uppercase',
    }}>{children}</span>
  );
}

function ScreenHeader({ title, subtitle, onBack, right }) {
  return (
    <div style={{ padding: '58px 20px 14px', display: 'flex', alignItems: 'flex-end', gap: 12 }}>
      {onBack && (
        <button onClick={onBack} style={{
          width: 40, height: 40, borderRadius: 12, border: '1px solid var(--line)',
          background: '#fff', cursor: 'pointer', display: 'grid', placeItems: 'center',
          flexShrink: 0,
        }}>
          <Ic.chevL width={18} height={18} style={{color: 'var(--ink)'}}/>
        </button>
      )}
      <div style={{ flex: 1, minWidth: 0 }}>
        {subtitle && <div style={{ fontSize: 12, color: 'var(--ink-3)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: .6 }}>{subtitle}</div>}
        <div style={{ fontSize: 26, fontWeight: 800, lineHeight: 1.1, color: 'var(--ink)', letterSpacing: -0.5 }}>{title}</div>
      </div>
      {right}
    </div>
  );
}

function Input({ label, value, onChange, placeholder, textarea, rows=3, type='text' }) {
  return (
    <label style={{ display: 'block', marginBottom: 14 }}>
      {label && <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--ink-2)', marginBottom: 6, textTransform: 'uppercase', letterSpacing: .5 }}>{label}</div>}
      {textarea ? (
        <textarea value={value} onChange={e=>onChange(e.target.value)} placeholder={placeholder} rows={rows}
          style={{
            width:'100%', resize:'none', padding: '12px 14px', fontSize: 15, lineHeight: 1.4,
            border: '1px solid var(--line)', borderRadius: 14, background: '#fafcfd',
            fontFamily: 'inherit', color: 'var(--ink)', outline: 'none',
          }}/>
      ) : (
        <input value={value} type={type} onChange={e=>onChange(e.target.value)} placeholder={placeholder}
          style={{
            width:'100%', padding: '14px 14px', fontSize: 15,
            border: '1px solid var(--line)', borderRadius: 14, background: '#fafcfd',
            fontFamily: 'inherit', color: 'var(--ink)', outline: 'none',
          }}/>
      )}
    </label>
  );
}

function Avatar({ initials, color='#0a84c8', size=40 }) {
  return (
    <div style={{
      width: size, height: size, borderRadius: size,
      background: color,
      color: '#fff', fontWeight: 700, fontSize: size * 0.38,
      display: 'grid', placeItems: 'center', flexShrink: 0,
      letterSpacing: .2,
    }}>{initials}</div>
  );
}

// Placeholder photo — if img missing show striped placeholder
function Photo({ src, alt, style, className }) {
  const [ok, setOk] = useState(true);
  if (!src || !ok) {
    return (
      <div className={className} style={{
        background: 'repeating-linear-gradient(45deg, #e9eef3 0 8px, #dde4ec 8px 16px)',
        color: '#93a2b0', fontFamily: 'var(--font-mono)', fontSize: 11,
        display: 'grid', placeItems: 'center', ...style,
      }}>{alt || 'image'}</div>
    );
  }
  return <img src={src} alt={alt||''} onError={()=>setOk(false)} className={className} style={{ objectFit: 'cover', ...style }}/>;
}

window.UI = { Card, Chip, PrimaryButton, GhostButton, Sheet, Badge, ScreenHeader, Input, Avatar, Photo };
