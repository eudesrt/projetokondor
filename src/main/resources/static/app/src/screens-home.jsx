// Home screen + urgent banner

const { Card, Chip, Badge, Avatar, Photo } = window.UI;

function NewsTicker({ items, onOpen }) {
  // duplicate the list so the scroll loops seamlessly
  const doubled = [...items, ...items];

  const toneFor = (kind) => {
    if (kind === 'urgent')     return { dot: '#e45454', chipBg: '#fde7e7', chipFg: '#b53a3a' };
    if (kind === 'prevention') return { dot: '#8dc63f', chipBg: '#eef7dd', chipFg: 'var(--accent-600)' };
    if (kind === 'event')      return { dot: '#0a84c8', chipBg: 'var(--brand-50)', chipFg: 'var(--brand)' };
    return { dot: '#b8770e', chipBg: '#fff4e0', chipFg: '#b8770e' };
  };

  return (
    <div style={{
      margin: '0 16px 16px', borderRadius: 16, overflow: 'hidden',
      background: '#fff', border: '1px solid var(--line)',
      boxShadow: '0 1px 2px rgba(10,30,45,0.03), 0 8px 20px -12px rgba(10,30,45,0.08)',
      display: 'flex', alignItems: 'stretch',
      minHeight: 48,
    }}>
      {/* Left label */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 8,
        padding: '0 12px 0 14px',
        background: 'linear-gradient(135deg, var(--brand) 0%, var(--brand-600) 100%)',
        color: '#fff', fontWeight: 800, fontSize: 11,
        letterSpacing: .7, textTransform: 'uppercase',
        flexShrink: 0, position: 'relative',
      }}>
        <span style={{
          width: 7, height: 7, borderRadius: 999, background: '#fff',
          animation: 'tickerDot 1.4s ease-in-out infinite',
        }}/>
        Ao vivo
        {/* diagonal edge */}
        <div style={{
          position: 'absolute', right: -10, top: 0, bottom: 0, width: 10,
          background: 'var(--brand-600)',
          clipPath: 'polygon(0 0, 100% 50%, 0 100%)',
        }}/>
      </div>

      {/* Scrolling track (masked edges) */}
      <div style={{
        flex: 1, minWidth: 0, overflow: 'hidden', position: 'relative',
        WebkitMaskImage: 'linear-gradient(90deg, transparent 0, #000 24px, #000 calc(100% - 24px), transparent 100%)',
                maskImage: 'linear-gradient(90deg, transparent 0, #000 24px, #000 calc(100% - 24px), transparent 100%)',
        display: 'flex', alignItems: 'center',
      }}>
        <div className="ticker-track" style={{ paddingLeft: 12 }}>
          {doubled.map((it, i) => {
            const t = toneFor(it.kind);
            return (
              <button key={`${it.id}-${i}`} onClick={() => onOpen(it)} style={{
                display: 'inline-flex', alignItems: 'center', gap: 10,
                background: 'none', border: 'none', cursor: 'pointer',
                padding: '10px 0', whiteSpace: 'nowrap', flexShrink: 0,
                fontFamily: 'inherit',
              }}>
                <span style={{
                  display: 'inline-flex', alignItems: 'center', gap: 5,
                  padding: '3px 9px', borderRadius: 999,
                  background: t.chipBg, color: t.chipFg,
                  fontSize: 10, fontWeight: 800, letterSpacing: .5, textTransform: 'uppercase',
                }}>
                  <span style={{ width: 5, height: 5, borderRadius: 999, background: t.dot }}/>
                  {it.label}
                </span>
                <span style={{ fontSize: 13, color: 'var(--ink)', fontWeight: 500 }}>{it.text}</span>
                <span style={{ color: 'var(--line)', fontSize: 10 }}>●</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function UrgentBanner({ data, onOpen }) {
  return (
    <div
      onClick={onOpen}
      className="urgent-pulse"
      style={{
        margin: '0 16px 16px', borderRadius: 20, cursor: 'pointer',
        background: 'linear-gradient(135deg, #fff5f5 0%, #fde7e7 100%)',
        border: '1px solid #f8c8c8',
        padding: '14px 16px', display: 'flex', alignItems: 'center', gap: 12,
        position: 'relative', overflow: 'hidden',
      }}>
      <div style={{
        width: 40, height: 40, borderRadius: 12,
        background: '#e45454', color: '#fff', display: 'grid', placeItems: 'center', flexShrink: 0,
      }}><Ic.alert width={20} height={20}/></div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 11, fontWeight: 800, color: '#b53a3a', textTransform: 'uppercase', letterSpacing: .6 }}>Comunicado urgente</div>
        <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--ink)', marginTop: 2, lineHeight: 1.25 }}>{data.title}</div>
        <div style={{ fontSize: 12, color: 'var(--ink-3)', marginTop: 2 }}>{data.when}</div>
      </div>
      <Ic.chevR width={18} height={18} style={{color:'#b53a3a', flexShrink: 0}}/>
    </div>
  );
}

function HomeHero({ user }) {
  return (
    <div style={{
      padding: '58px 20px 22px',
      position: 'relative',
    }}>
      <div style={{ display:'flex', alignItems:'center', justifyContent: 'space-between' }}>
        <div style={{ display:'flex', alignItems:'center', gap: 10 }}>
          <Ic.logo width={38} height={38}/>
          <div>
            <div style={{ fontSize: 11, color: 'var(--ink-3)', fontWeight: 600, letterSpacing: .5, textTransform: 'uppercase' }}>Condomínio</div>
            <div style={{ fontSize: 15, fontWeight: 800, color: 'var(--ink)', letterSpacing: -.3 }}>Torre Mascote</div>
          </div>
        </div>
        <div style={{ display:'flex', gap: 8 }}>
          <button style={{ width:40, height:40, borderRadius: 12, background: '#fff', border: '1px solid var(--line)', display:'grid', placeItems:'center', cursor:'pointer', position:'relative' }}>
            <Ic.bell width={18} height={18} style={{color:'var(--ink)'}}/>
            <span style={{ position:'absolute', top: 8, right: 9, width: 8, height: 8, borderRadius: 8, background: '#e45454', border: '2px solid #fff' }}/>
          </button>
        </div>
      </div>
      <div style={{ marginTop: 22, display:'flex', alignItems:'center', gap: 12 }}>
        <Avatar initials={user.initials} color="var(--brand)" size={50}/>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontFamily:'var(--font-serif)', fontSize: 28, color: 'var(--ink)', lineHeight: 1.15, whiteSpace:'nowrap' }}>Olá, <span style={{fontStyle:'italic', color: 'var(--brand)'}}>{user.name}</span></div>
          <div style={{ fontSize: 13, color: 'var(--ink-3)', marginTop: 6 }}>{user.unit}</div>
        </div>
      </div>
    </div>
  );
}

function QuickTile({ icon, label, count, onClick, tone }) {
  const tones = {
    brand:  { ic: 'var(--brand)', bg: 'var(--brand-50)' },
    accent: { ic: 'var(--accent-600)', bg: '#eef7dd' },
    amber:  { ic: '#b8770e', bg: '#fff4e0' },
    gray:   { ic: 'var(--ink-2)', bg: '#eef2f6' },
  };
  const t = tones[tone] || tones.brand;
  return (
    <button onClick={onClick} style={{
      flex: 1, minWidth: 0, background: '#fff', border: '1px solid var(--line)',
      borderRadius: 18, padding: 14, cursor: 'pointer', textAlign: 'left',
      display: 'flex', flexDirection: 'column', gap: 10,
      transition: 'transform .15s',
    }}
      onMouseDown={e => e.currentTarget.style.transform='scale(.97)'}
      onMouseUp={e => e.currentTarget.style.transform='scale(1)'}
      onMouseLeave={e => e.currentTarget.style.transform='scale(1)'}
    >
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between' }}>
        <div style={{ width: 38, height: 38, borderRadius: 12, background: t.bg, color: t.ic, display:'grid', placeItems:'center' }}>{icon}</div>
        {count != null && <span style={{ fontSize: 11, fontWeight: 700, color: t.ic, background: t.bg, padding:'3px 8px', borderRadius: 999 }}>{count}</span>}
      </div>
      <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--ink)', lineHeight: 1.25 }}>{label}</div>
    </button>
  );
}

function HomeScreen({ nav, data }) {
  const latestNews = data.NEWS.slice(0, 2);
  return (
    <div className="fade-in">
      <HomeHero user={data.USER}/>
      <NewsTicker
        items={data.TICKER_ITEMS}
        onOpen={(it) => {
          if (it.kind === 'urgent') nav.go('news-detail', { id: 'urgent' });
          else nav.go('news');
        }}
      />
      <UrgentBanner data={data.URGENT} onOpen={() => nav.go('news-detail', { id: 'urgent' })}/>

      {/* QR access big card */}
      <div style={{ margin: '0 16px 16px' }}>
        <Card interactive onClick={() => nav.go('access')} style={{
          padding: 18, background: 'linear-gradient(135deg, #0a84c8 0%, #076fa8 100%)',
          border: 'none', color: '#fff', overflow: 'hidden', position: 'relative',
        }}>
          <div style={{ position:'absolute', right:-30, top:-30, width: 160, height: 160, borderRadius: 999, background: 'rgba(141,198,63,.2)', filter:'blur(10px)' }}/>
          <div style={{ display:'flex', alignItems:'center', gap: 14, position:'relative' }}>
            <div style={{
              width: 60, height: 60, borderRadius: 14, background: '#fff',
              display: 'grid', placeItems:'center', boxShadow:'0 6px 18px rgba(0,0,0,.15)',
            }}>
              <Ic.qr width={32} height={32} style={{color: 'var(--brand)'}}/>
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 11, fontWeight: 700, opacity: .8, letterSpacing: .6, textTransform: 'uppercase' }}>Seu acesso</div>
              <div style={{ fontSize: 16, fontWeight: 700, marginTop: 2 }}>Toque para exibir QR Code</div>
              <div style={{ fontSize: 12, opacity: .8, marginTop: 4 }}>Portaria • Catracas • Estacionamento</div>
            </div>
            <Ic.chevR width={20} height={20}/>
          </div>
        </Card>
      </div>

      {/* Quick tiles */}
      <div style={{ padding: '0 16px', display:'grid', gridTemplateColumns:'1fr 1fr', gap: 10, marginBottom: 6 }}>
        <QuickTile icon={<Ic.wrench width={18} height={18}/>} label="Abrir chamado" count={2} tone="amber" onClick={()=>nav.go('tickets')}/>
        <QuickTile icon={<Ic.cal width={18} height={18}/>} label="Reservar área" tone="accent" onClick={()=>nav.go('amenities')}/>
        <QuickTile icon={<Ic.box width={18} height={18}/>} label="Encomendas" count={2} tone="brand" onClick={()=>nav.go('packages')}/>
        <QuickTile icon={<Ic.poll width={18} height={18}/>} label="Votações" count={1} tone="gray" onClick={()=>nav.go('poll')}/>
      </div>

      {/* News preview */}
      <div style={{ padding: '24px 20px 10px', display:'flex', alignItems:'baseline', justifyContent:'space-between' }}>
        <div>
          <div style={{ fontSize: 12, color: 'var(--ink-3)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: .6 }}>Portal de notícias</div>
          <div style={{ fontFamily:'var(--font-serif)', fontSize: 24, color: 'var(--ink)' }}>Últimas do condomínio</div>
        </div>
        <button onClick={() => nav.go('news')} style={{ fontSize: 13, color: 'var(--brand)', fontWeight: 700, background:'none', border:'none', cursor:'pointer' }}>Ver tudo</button>
      </div>

      <div style={{ padding: '0 16px 20px', display:'flex', flexDirection:'column', gap: 12 }}>
        {latestNews.map(n => (
          <Card key={n.id} interactive onClick={() => nav.go('news-detail', { id: n.id })} style={{ overflow: 'hidden', padding: 0 }}>
            <div style={{ display: 'flex', gap: 12, padding: 12 }}>
              <Photo src={n.img} alt={n.title} style={{ width: 96, height: 96, borderRadius: 14, flexShrink: 0 }}/>
              <div style={{ flex: 1, minWidth: 0, paddingRight: 6 }}>
                <Badge tone={n.tag==='eventos'?'green':n.tag==='avisos'?'amber':'brand'}>{n.cat}</Badge>
                <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--ink)', marginTop: 6, lineHeight: 1.3,
                  display:'-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient:'vertical', overflow:'hidden',
                }}>{n.title}</div>
                <div style={{ fontSize: 11, color: 'var(--ink-3)', marginTop: 6 }}>{n.date} • {n.read}</div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Contacts rail */}
      <div style={{ padding: '0 20px 10px', display:'flex', alignItems:'baseline', justifyContent:'space-between' }}>
        <div style={{ fontFamily:'var(--font-serif)', fontSize: 20, color: 'var(--ink)' }}>Contatos rápidos</div>
        <button onClick={()=>nav.go('contacts')} style={{ fontSize: 13, color: 'var(--brand)', fontWeight: 700, background:'none', border:'none', cursor:'pointer' }}>Ver todos</button>
      </div>
      <div style={{ padding: '0 16px 120px', display:'flex', gap: 10, overflowX:'auto' }} className="phone-scroll">
        {data.CONTACTS.slice(0,4).map(c => (
          <div key={c.id} onClick={()=>nav.go('contacts')} style={{
            minWidth: 108, background:'#fff', border: '1px solid var(--line)', borderRadius: 16,
            padding: 12, display:'flex', flexDirection:'column', gap: 8, cursor:'pointer',
          }}>
            <Avatar initials={c.avatar} color={c.color} size={36}/>
            <div>
              <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--ink)', lineHeight:1.2 }}>{c.name}</div>
              <div style={{ fontSize: 11, color: 'var(--ink-3)', marginTop: 2 }}>{c.role}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

window.Screens = window.Screens || {};
window.Screens.Home = HomeScreen;
