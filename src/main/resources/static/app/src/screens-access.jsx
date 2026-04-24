// Access control — QR code + visitors + log
const { Card: ACard, Chip: AChip, Badge: ABadge, ScreenHeader: AHead, Photo: APhoto, Avatar: AAvatar, PrimaryButton: APB, Sheet: ASheet, Input: AInput } = window.UI;

function QRCodePattern({ size = 220 }) {
  // Stylized fake QR — not a real scannable code (it's a prototype)
  const cells = 21;
  const cell = size / cells;
  const rng = (i, j) => {
    const x = Math.sin(i * 12.9898 + j * 78.233) * 43758.5453;
    return (x - Math.floor(x)) > 0.5;
  };
  const finders = [[0,0],[0,cells-7],[cells-7,0]];
  const isFinder = (i,j) => finders.some(([fi,fj]) => i>=fi && i<fi+7 && j>=fj && j<fj+7);
  const rects = [];
  for (let i=0;i<cells;i++) for (let j=0;j<cells;j++) {
    if (isFinder(i,j)) continue;
    if (rng(i,j)) rects.push(<rect key={`${i}-${j}`} x={j*cell} y={i*cell} width={cell} height={cell} fill="#0b1e2d"/>);
  }
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <rect width={size} height={size} fill="#fff"/>
      {rects}
      {finders.map(([fi,fj],k)=>(
        <g key={k} transform={`translate(${fj*cell},${fi*cell})`}>
          <rect width={cell*7} height={cell*7} fill="#0b1e2d"/>
          <rect x={cell} y={cell} width={cell*5} height={cell*5} fill="#fff"/>
          <rect x={cell*2} y={cell*2} width={cell*3} height={cell*3} fill="#0a84c8"/>
        </g>
      ))}
    </svg>
  );
}

function AccessScreen({ nav, data }) {
  const [tab, setTab] = React.useState('qr');
  const [inviteOpen, setInviteOpen] = React.useState(false);
  const [guestName, setGuestName] = React.useState('');
  const [guestDate, setGuestDate] = React.useState('');
  const [invited, setInvited] = React.useState(false);

  const ioColor = (io, kind) => kind==='delivery' ? 'var(--warn)' : io==='in' ? 'var(--success)' : 'var(--ink-3)';

  return (
    <div className="fade-in" style={{ paddingBottom: 120 }}>
      <AHead title="Controle de acesso" subtitle="Portaria 24h" onBack={()=>nav.back()}/>

      {/* tabs */}
      <div style={{ padding: '0 16px 14px' }}>
        <div style={{ display:'flex', background:'#eef2f6', padding: 4, borderRadius: 14 }}>
          {[['qr','Meu QR'],['visitors','Visitantes'],['log','Histórico']].map(([id,label])=>(
            <button key={id} onClick={()=>setTab(id)} style={{
              flex:1, height: 40, border:'none', borderRadius: 10,
              background: tab===id?'#fff':'transparent', color: tab===id?'var(--ink)':'var(--ink-3)',
              fontSize: 13, fontWeight: 700, cursor:'pointer',
              boxShadow: tab===id?'0 2px 6px rgba(10,30,45,.08)':'none',
              transition: 'all .2s',
            }}>{label}</button>
          ))}
        </div>
      </div>

      {tab === 'qr' && (
        <div style={{ padding: '0 16px', textAlign: 'center' }}>
          <ACard style={{ padding: 28, display:'flex', flexDirection:'column', alignItems:'center', gap: 16, background: 'linear-gradient(180deg, #fff, #f7fbfe)' }}>
            <div style={{ display:'flex', alignItems:'center', gap: 8, fontSize: 12, color: 'var(--ink-3)', fontWeight: 600 }}>
              <span style={{ width: 8, height:8, borderRadius: 4, background: 'var(--success)' }}/> AUTENTICADO
            </div>
            <div style={{
              padding: 14, borderRadius: 20, background: '#fff',
              boxShadow: '0 24px 40px -18px rgba(10,30,45,.2), 0 0 0 1px var(--line)',
            }}>
              <QRCodePattern size={200}/>
            </div>
            <div>
              <div style={{ fontSize: 22, fontWeight: 800, color: 'var(--ink)' }}>{data.USER.fullName}</div>
              <div style={{ fontSize: 13, color: 'var(--ink-3)', marginTop: 2 }}>{data.USER.unit}</div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--ink-3)', marginTop: 10, letterSpacing: 1.5 }}>{data.USER.qrId}</div>
            </div>
            <div style={{ fontSize: 11, color: 'var(--ink-3)' }}>Expira em <b style={{color:'var(--ink-2)'}}>4 min 22s</b> • renova automaticamente</div>
          </ACard>
          <p style={{ fontSize: 12, color: 'var(--ink-3)', marginTop: 14, padding: '0 20px' }}>Apresente este código na portaria, catracas e cancelas do estacionamento.</p>
        </div>
      )}

      {tab === 'visitors' && (
        <div style={{ padding: '0 16px' }}>
          <div style={{ display: 'flex', gap: 10, marginBottom: 14 }}>
            <button onClick={()=>setInviteOpen(true)} style={{
              flex: 1, height: 54, border: 'none', borderRadius: 16,
              background: 'var(--brand)', color: '#fff', fontWeight: 700,
              display:'flex', alignItems:'center', justifyContent:'center', gap: 8, cursor:'pointer',
              boxShadow:'0 8px 20px -6px rgba(10,132,200,.45)',
            }}>
              <Ic.plus width={18} height={18}/> Autorizar visitante
            </button>
          </div>
          <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--ink-3)', textTransform:'uppercase', letterSpacing: .6, padding: '4px 4px 10px' }}>Pré-autorizados</div>
          {invited && (
            <ACard style={{ padding: 14, marginBottom: 10, display:'flex', alignItems:'center', gap: 12, border: '1px solid #c9e8d4', background: '#f3fbf6' }}>
              <div style={{ width: 40, height: 40, borderRadius: 12, background: '#22a06b', color:'#fff', display:'grid', placeItems:'center' }}>
                <Ic.check width={18} height={18}/>
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 14, fontWeight: 700, color:'var(--ink)' }}>{guestName || 'Convidado'}</div>
                <div style={{ fontSize: 12, color:'var(--ink-3)', marginTop: 2 }}>{guestDate || 'Hoje'} • código enviado por WhatsApp</div>
              </div>
              <ABadge tone="green">Ativo</ABadge>
            </ACard>
          )}
          <ACard style={{ padding: 14, display:'flex', alignItems:'center', gap: 12 }}>
            <AAvatar initials="CM" color="#6b7a87"/>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 14, fontWeight: 700, color:'var(--ink)' }}>Carlos Mendes</div>
              <div style={{ fontSize: 12, color:'var(--ink-3)', marginTop: 2 }}>Hoje • a partir das 14h</div>
            </div>
            <ABadge tone="green">Ativo</ABadge>
          </ACard>
        </div>
      )}

      {tab === 'log' && (
        <div style={{ padding: '0 16px', display:'flex', flexDirection:'column', gap: 10 }}>
          {data.ACCESS_LOG.map(a => (
            <ACard key={a.id} style={{ padding: 14, display:'flex', alignItems:'center', gap: 12 }}>
              <div style={{
                width: 42, height: 42, borderRadius: 12,
                background: a.kind==='delivery'?'#fff4e0':a.kind==='service'?'#eef2f6':'var(--brand-50)',
                color: a.kind==='delivery'?'#b8770e':a.kind==='service'?'var(--ink-2)':'var(--brand)',
                display:'grid', placeItems:'center',
              }}>
                {a.kind==='delivery'?<Ic.box width={18} height={18}/>:a.kind==='service'?<Ic.settings width={18} height={18}/>:<Ic.user width={18} height={18}/>}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 14, fontWeight: 700, color:'var(--ink)' }}>{a.who}</div>
                <div style={{ fontSize: 12, color:'var(--ink-3)', marginTop: 2 }}>{a.role} • {a.unit}</div>
              </div>
              <div style={{ textAlign:'right' }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: ioColor(a.io, a.kind), textTransform:'uppercase', letterSpacing: .5 }}>
                  {a.io==='in' ? 'Entrada' : 'Saída'}
                </div>
                <div style={{ fontSize: 11, color:'var(--ink-3)', marginTop: 2 }}>{a.time}</div>
              </div>
            </ACard>
          ))}
        </div>
      )}

      <ASheet open={inviteOpen} onClose={()=>setInviteOpen(false)} title="Autorizar visitante">
        <div style={{ paddingTop: 8 }}>
          <AInput label="Nome do visitante" value={guestName} onChange={setGuestName} placeholder="Ex. João Silva"/>
          <AInput label="Data e horário previstos" value={guestDate} onChange={setGuestDate} placeholder="Ex. Hoje, 19h"/>
          <div style={{ fontSize: 12, color: 'var(--ink-3)', marginBottom: 14, lineHeight: 1.5 }}>
            Enviaremos um código de acesso temporário via WhatsApp. Ele pode ser usado apenas na data informada.
          </div>
          <APB onClick={()=>{ setInvited(true); setInviteOpen(false); }} disabled={!guestName}>
            Gerar código de acesso
          </APB>
        </div>
      </ASheet>
    </div>
  );
}

window.Screens = window.Screens || {};
window.Screens.Access = AccessScreen;
