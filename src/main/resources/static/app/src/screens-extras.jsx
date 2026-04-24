// Extras — Amenities (reservas), Packages, Poll, Classifieds, Profile, Notifications
const { Card: XCard, Badge: XBadge, ScreenHeader: XHead, Photo: XPhoto, PrimaryButton: XPB, Sheet: XSheet, Avatar: XAvatar, Input: XInput } = window.UI;

// ─── Amenities / Reservations ─────────────────────────────────
function AmenitiesScreen({ nav, data, state, setState }) {
  const [open, setOpen] = React.useState(null);
  const [date, setDate] = React.useState('');
  const [slot, setSlot] = React.useState('');
  const [ok, setOk] = React.useState(false);

  const slots = ['10h–13h', '14h–17h', '18h–22h'];

  const book = () => {
    const r = { id: 'r'+Date.now(), amenity: open.name, date, slot, img: open.img };
    setState({ ...state, reservations: [r, ...(state.reservations||[])] });
    setOk(true);
    setTimeout(()=>{ setOpen(null); setOk(false); setDate(''); setSlot(''); }, 1400);
  };

  return (
    <div className="fade-in" style={{ paddingBottom: 120 }}>
      <XHead title="Áreas comuns" subtitle="Reservas" onBack={()=>nav.back()}/>

      {(state.reservations||[]).length > 0 && (
        <div style={{ padding: '0 16px 16px' }}>
          <div style={{ fontSize: 12, fontWeight:700, color:'var(--ink-3)', textTransform:'uppercase', letterSpacing:.6, marginBottom:10 }}>Suas reservas</div>
          {state.reservations.map(r => (
            <XCard key={r.id} style={{ padding: 12, display:'flex', gap:12, alignItems:'center', marginBottom:8 }}>
              <XPhoto src={r.img} alt={r.amenity} style={{ width:60, height:60, borderRadius:12 }}/>
              <div style={{ flex:1 }}>
                <div style={{ fontSize:14, fontWeight:700, color:'var(--ink)' }}>{r.amenity}</div>
                <div style={{ fontSize:12, color:'var(--ink-3)', marginTop:2 }}>{r.date} • {r.slot}</div>
              </div>
              <XBadge tone="green">Confirmada</XBadge>
            </XCard>
          ))}
        </div>
      )}

      <div style={{ padding: '0 16px', display:'grid', gridTemplateColumns:'1fr 1fr', gap: 12 }}>
        {data.AMENITIES.map(a => (
          <XCard key={a.id} interactive onClick={()=>setOpen(a)} style={{ padding: 0, overflow:'hidden' }}>
            <XPhoto src={a.img} alt={a.name} style={{ width:'100%', height: 110, display:'block' }}/>
            <div style={{ padding: 12 }}>
              <div style={{ fontSize: 14, fontWeight: 700, color:'var(--ink)' }}>{a.name}</div>
              <div style={{ fontSize: 11, color:'var(--ink-3)', marginTop: 4 }}>{a.max} • {a.slot}</div>
            </div>
          </XCard>
        ))}
      </div>

      <XSheet open={!!open} onClose={()=>setOpen(null)} title={open ? `Reservar ${open.name}` : ''}>
        {open && !ok && (
          <>
            <XPhoto src={open.img} alt={open.name} style={{ width:'100%', height: 160, borderRadius: 16, marginBottom: 16 }}/>
            <XInput label="Data" value={date} onChange={setDate} placeholder="Ex. 15 maio 2026" type="text"/>
            <div style={{ marginBottom: 14 }}>
              <div style={{ fontSize: 12, fontWeight:700, color:'var(--ink-2)', marginBottom:6, textTransform:'uppercase', letterSpacing:.5 }}>Horário</div>
              <div style={{ display:'flex', gap: 8 }}>
                {slots.map(s => (
                  <button key={s} onClick={()=>setSlot(s)} style={{
                    flex:1, padding:'12px 8px', borderRadius: 12,
                    background: slot===s ? 'var(--brand-50)' : '#fff',
                    color: slot===s ? 'var(--brand)' : 'var(--ink-2)',
                    border: `1px solid ${slot===s?'var(--brand)':'var(--line)'}`,
                    fontSize: 13, fontWeight: 600, cursor:'pointer',
                  }}>{s}</button>
                ))}
              </div>
            </div>
            <XPB onClick={book} disabled={!date||!slot}>Confirmar reserva</XPB>
          </>
        )}
        {ok && (
          <div style={{ textAlign:'center', padding: '40px 20px' }}>
            <div style={{ width: 72, height: 72, borderRadius: 999, background: 'var(--success)', color:'#fff', display:'grid', placeItems:'center', margin: '0 auto 16px' }}>
              <Ic.check width={36} height={36}/>
            </div>
            <div style={{ fontSize: 20, fontWeight: 800, color: 'var(--ink)' }}>Reserva confirmada!</div>
            <div style={{ fontSize: 13, color:'var(--ink-3)', marginTop: 6 }}>Você receberá um lembrete no dia.</div>
          </div>
        )}
      </XSheet>
    </div>
  );
}

// ─── Packages ────────────────────────────────────────────────
function PackagesScreen({ nav, data, state, setState }) {
  const pickup = (id) => {
    const updated = state.packages.map(p => p.id===id ? {...p, status:'picked'} : p);
    setState({...state, packages: updated });
  };
  return (
    <div className="fade-in" style={{ paddingBottom: 120 }}>
      <XHead title="Encomendas" subtitle="Portaria" onBack={()=>nav.back()}/>
      <div style={{ padding:'0 16px', display:'flex', flexDirection:'column', gap:10 }}>
        {state.packages.map(p => (
          <XCard key={p.id} style={{ padding: 16, display:'flex', gap: 14, alignItems:'center' }}>
            <div style={{ width:48, height:48, borderRadius: 14, background:'#fff4e0', color:'#b8770e', display:'grid', placeItems:'center' }}>
              <Ic.box width={22} height={22}/>
            </div>
            <div style={{ flex:1, minWidth:0 }}>
              <div style={{ fontSize: 15, fontWeight: 700, color:'var(--ink)' }}>{p.carrier}</div>
              <div style={{ fontFamily:'var(--font-mono)', fontSize: 11, color:'var(--ink-3)', marginTop:2 }}>{p.code}</div>
              <div style={{ fontSize: 12, color:'var(--ink-3)', marginTop:4 }}>Chegou {p.arrived}</div>
            </div>
            {p.status === 'waiting' ? (
              <button onClick={()=>pickup(p.id)} style={{
                padding:'10px 14px', borderRadius: 10, border:'none',
                background: 'var(--brand)', color:'#fff', fontSize: 12, fontWeight: 700, cursor:'pointer',
              }}>Retirar</button>
            ) : (
              <XBadge tone="gray">Retirada</XBadge>
            )}
          </XCard>
        ))}
      </div>
    </div>
  );
}

// ─── Poll ────────────────────────────────────────────────────
function PollScreen({ nav, data, state, setState }) {
  const [voted, setVoted] = React.useState(null);
  const poll = data.POLL;
  const total = poll.total + (voted ? 1 : 0);

  return (
    <div className="fade-in" style={{ paddingBottom: 120 }}>
      <XHead title="Votações" subtitle="Decisões do condomínio" onBack={()=>nav.back()}/>
      <div style={{ padding: '0 16px' }}>
        <XCard style={{ padding: 20 }}>
          <XBadge tone="brand">Ativa</XBadge>
          <div style={{ fontFamily:'var(--font-serif)', fontSize: 24, color:'var(--ink)', marginTop: 10, lineHeight: 1.2 }}>{poll.title}</div>
          <div style={{ fontSize: 13, color:'var(--ink-2)', marginTop: 10, lineHeight: 1.5 }}>{poll.desc}</div>
          <div style={{ fontSize: 11, color:'var(--ink-3)', marginTop: 10, display:'flex', gap:10 }}>
            <span>{poll.ends}</span><span>•</span><span>{total} votos</span>
          </div>

          <div style={{ marginTop: 20, display:'flex', flexDirection:'column', gap: 10 }}>
            {poll.options.map(o => {
              const v = o.votes + (voted===o.id ? 1 : 0);
              const pct = Math.round((v/total)*100);
              const selected = voted === o.id;
              return (
                <button key={o.id} onClick={()=>!voted && setVoted(o.id)} disabled={!!voted && !selected}
                  style={{
                    position:'relative', padding: '14px 16px', borderRadius: 14,
                    border: `1px solid ${selected?'var(--brand)':'var(--line)'}`,
                    background: '#fff', textAlign:'left', overflow: 'hidden', cursor: voted?'default':'pointer',
                  }}>
                  {voted && (
                    <div style={{
                      position:'absolute', inset: 0,
                      background: selected ? 'var(--brand-50)' : 'var(--bg-2)',
                      width: pct+'%', transition: 'width .5s cubic-bezier(.22,.7,.32,1)',
                    }}/>
                  )}
                  <div style={{ position:'relative', display:'flex', justifyContent:'space-between', alignItems:'center' }}>
                    <span style={{ fontSize: 14, fontWeight: 600, color: 'var(--ink)' }}>{o.label}</span>
                    {voted && <span style={{ fontSize: 13, fontWeight: 700, color: selected?'var(--brand)':'var(--ink-2)' }}>{pct}%</span>}
                  </div>
                </button>
              );
            })}
          </div>

          {voted && (
            <div style={{ fontSize: 12, color:'var(--success)', marginTop: 14, display:'flex', alignItems:'center', gap: 6 }}>
              <Ic.check width={14} height={14}/> Seu voto foi registrado
            </div>
          )}
        </XCard>
      </div>
    </div>
  );
}

// ─── Classifieds ─────────────────────────────────────────────
function ClassifiedsScreen({ nav, data }) {
  return (
    <div className="fade-in" style={{ paddingBottom: 120 }}>
      <XHead title="Classificados" subtitle="Entre moradores" onBack={()=>nav.back()}/>
      <div style={{ padding:'0 16px', display:'grid', gridTemplateColumns:'1fr 1fr', gap: 12 }}>
        {data.CLASSIFIEDS.map(c => (
          <XCard key={c.id} interactive style={{ padding: 0, overflow:'hidden' }}>
            <XPhoto src={c.img} alt={c.title} style={{ width:'100%', height: 110, display:'block' }}/>
            <div style={{ padding: 12 }}>
              <XBadge tone="gray">{c.category}</XBadge>
              <div style={{ fontSize: 13, fontWeight: 700, color:'var(--ink)', marginTop: 6, lineHeight: 1.3, minHeight: 36 }}>{c.title}</div>
              <div style={{ fontSize: 15, fontWeight: 800, color:'var(--brand)', marginTop: 4 }}>{c.price}</div>
              <div style={{ fontSize: 11, color:'var(--ink-3)', marginTop: 6 }}>{c.user} • {c.when}</div>
            </div>
          </XCard>
        ))}
      </div>
    </div>
  );
}

// ─── Profile ─────────────────────────────────────────────────
function ProfileScreen({ nav, data }) {
  const items = [
    { icon: <Ic.user width={18} height={18}/>, label: 'Dados pessoais' },
    { icon: <Ic.bell width={18} height={18}/>, label: 'Notificações', to: 'notifications' },
    { icon: <Ic.shield width={18} height={18}/>, label: 'Privacidade & segurança' },
    { icon: <Ic.settings width={18} height={18}/>, label: 'Preferências do app' },
  ];
  return (
    <div className="fade-in" style={{ paddingBottom: 120 }}>
      <XHead title="Perfil" onBack={()=>nav.back()}/>
      <div style={{ padding:'0 16px 20px' }}>
        <XCard style={{ padding: 20, display:'flex', alignItems:'center', gap: 14 }}>
          <XAvatar initials={data.USER.initials} color="var(--brand)" size={60}/>
          <div>
            <div style={{ fontSize: 18, fontWeight: 800, color:'var(--ink)' }}>{data.USER.fullName}</div>
            <div style={{ fontSize: 13, color:'var(--ink-3)', marginTop: 2 }}>{data.USER.unit}</div>
            <div style={{ fontSize: 12, color:'var(--brand)', marginTop: 6, fontWeight: 600 }}>Proprietária • desde 2023</div>
          </div>
        </XCard>
      </div>
      <div style={{ padding:'0 16px', display:'flex', flexDirection:'column', gap: 8 }}>
        {items.map((it, i) => (
          <button key={i} onClick={()=>it.to && nav.go(it.to)} style={{
            display:'flex', alignItems:'center', gap: 14,
            background:'#fff', border:'1px solid var(--line)', borderRadius: 14,
            padding: 14, cursor:'pointer', textAlign:'left',
          }}>
            <div style={{ width: 38, height: 38, borderRadius: 10, background:'var(--bg-2)', color:'var(--ink-2)', display:'grid', placeItems:'center' }}>{it.icon}</div>
            <div style={{ flex: 1, fontSize: 14, fontWeight: 600, color:'var(--ink)' }}>{it.label}</div>
            <Ic.chevR width={16} height={16} style={{color:'var(--ink-3)'}}/>
          </button>
        ))}
      </div>
    </div>
  );
}

// ─── Notifications ───────────────────────────────────────────
function NotificationsScreen({ nav, data }) {
  const items = [
    { id:'n1', kind:'alert', title:'Comunicado urgente', text:'Manutenção da caixa d\'água — terça, 09h', when:'10 min', unread: true },
    { id:'n2', kind:'ticket', title:'Chamado #2487 atualizado', text:'Técnico agendado para amanhã pela manhã.', when:'2h', unread: true },
    { id:'n3', kind:'package', title:'Encomenda chegou', text:'Mercado Livre — retire na portaria', when:'3h' },
    { id:'n4', kind:'news', title:'Nova notícia', text:'Festa Junina do Vila Mascote — inscrições abertas', when:'ontem' },
    { id:'n5', kind:'access', title:'Entrada autorizada', text:'Carlos Mendes acessou o condomínio', when:'ontem' },
  ];
  const iconOf = (k) => ({
    alert:{ i:<Ic.alert width={16} height={16}/>, bg:'#fde7e7', fg:'#b53a3a' },
    ticket:{ i:<Ic.wrench width={16} height={16}/>, bg:'#fff4e0', fg:'#b8770e' },
    package:{ i:<Ic.box width={16} height={16}/>, bg:'var(--brand-50)', fg:'var(--brand)' },
    news:{ i:<Ic.news width={16} height={16}/>, bg:'#eef7dd', fg:'var(--accent-600)' },
    access:{ i:<Ic.shield width={16} height={16}/>, bg:'#eef2f6', fg:'var(--ink-2)' },
  })[k];
  return (
    <div className="fade-in" style={{ paddingBottom: 120 }}>
      <XHead title="Notificações" onBack={()=>nav.back()}/>
      <div style={{ padding: '0 16px', display:'flex', flexDirection:'column', gap: 8 }}>
        {items.map(n => {
          const ic = iconOf(n.kind);
          return (
            <XCard key={n.id} style={{ padding: 14, display:'flex', gap: 12, alignItems:'flex-start',
              background: n.unread ? 'var(--brand-50)' : '#fff',
              border: n.unread ? '1px solid #d2e8f7' : '1px solid var(--line)',
            }}>
              <div style={{ width: 36, height: 36, borderRadius: 10, background: ic.bg, color: ic.fg, display:'grid', placeItems:'center', flexShrink:0 }}>{ic.i}</div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display:'flex', justifyContent:'space-between', gap: 10 }}>
                  <div style={{ fontSize: 14, fontWeight: 700, color:'var(--ink)' }}>{n.title}</div>
                  <div style={{ fontSize: 11, color:'var(--ink-3)', flexShrink:0 }}>{n.when}</div>
                </div>
                <div style={{ fontSize: 13, color:'var(--ink-2)', marginTop: 4, lineHeight: 1.4 }}>{n.text}</div>
              </div>
              {n.unread && <span style={{ width: 8, height: 8, borderRadius: 8, background:'var(--brand)', flexShrink:0, marginTop: 6 }}/>}
            </XCard>
          );
        })}
      </div>
    </div>
  );
}

window.Screens = window.Screens || {};
Object.assign(window.Screens, {
  Amenities: AmenitiesScreen,
  Packages: PackagesScreen,
  Poll: PollScreen,
  Classifieds: ClassifiedsScreen,
  Profile: ProfileScreen,
  Notifications: NotificationsScreen,
});
