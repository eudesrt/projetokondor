// Tickets — list + multi-step new + detail (timeline) with photo attachments
const { Card: TCard, Badge: TBadge, ScreenHeader: THead, PrimaryButton: TPB, Sheet: TSheet, Input: TInput } = window.UI;

function StatusPill({ status }) {
  const map = {
    aberto: { label: 'Aberto', tone: 'amber', ic: '●' },
    andamento: { label: 'Em andamento', tone: 'brand', ic: '◐' },
    finalizado: { label: 'Finalizado', tone: 'green', ic: '✓' },
  };
  const s = map[status];
  return <TBadge tone={s.tone}>{s.ic} {s.label}</TBadge>;
}

function StatusStep({ status, current }) {
  const steps = [
    { id: 'aberto', label: 'Aberto' },
    { id: 'andamento', label: 'Em andamento' },
    { id: 'finalizado', label: 'Finalizado' },
  ];
  const idx = steps.findIndex(s => s.id === current);
  return (
    <div style={{ display:'flex', alignItems:'center', gap: 6 }}>
      {steps.map((s, i) => {
        const done = i <= idx;
        const active = i === idx;
        return (
          <React.Fragment key={s.id}>
            <div style={{
              flex: 1, textAlign:'center',
            }}>
              <div style={{
                width: 28, height: 28, borderRadius: 28, margin:'0 auto 6px',
                background: done ? 'var(--brand)' : '#fff',
                border: `2px solid ${done ? 'var(--brand)' : 'var(--line)'}`,
                color: '#fff', fontSize: 13, fontWeight:700,
                display:'grid', placeItems:'center',
                transform: active ? 'scale(1.08)' : 'scale(1)',
                transition: 'all .3s',
                boxShadow: active ? '0 0 0 4px var(--brand-50)' : 'none',
              }}>{done ? <Ic.check width={14} height={14}/> : i+1}</div>
              <div style={{ fontSize: 10, color: done?'var(--ink)':'var(--ink-3)', fontWeight: active?700:500 }}>{s.label}</div>
            </div>
            {i < steps.length-1 && (
              <div style={{ flex: 0.3, height: 2, background: i < idx ? 'var(--brand)' : 'var(--line)', marginTop: -20, transition:'background .3s' }}/>
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
}

function TicketsScreen({ nav, data, state, setState }) {
  const [filter, setFilter] = React.useState('todos');
  const [newOpen, setNewOpen] = React.useState(false);
  const [step, setStep] = React.useState(1);
  const [title, setTitle] = React.useState('');
  const [desc, setDesc] = React.useState('');
  const [cat, setCat] = React.useState('');
  const [priority, setPriority] = React.useState('normal');
  const [location, setLocation] = React.useState('');
  const [photos, setPhotos] = React.useState([]);

  const tickets = state.tickets;
  const counts = {
    todos: tickets.length,
    aberto: tickets.filter(t=>t.status==='aberto').length,
    andamento: tickets.filter(t=>t.status==='andamento').length,
    finalizado: tickets.filter(t=>t.status==='finalizado').length,
  };
  const filtered = filter==='todos' ? tickets : tickets.filter(t => t.status === filter);

  const resetForm = () => { setStep(1); setTitle(''); setDesc(''); setCat(''); setPriority('normal'); setLocation(''); setPhotos([]); };

  const submit = () => {
    const nt = {
      id: 't' + Date.now(), code: '#'+Math.floor(2500+Math.random()*500),
      title, status: 'aberto', category: cat, priority, location,
      created: 'hoje', lastUpdate: 'agora',
      photos,
      timeline: [{ t: 'agora', who: 'Você', text: desc || title }],
    };
    setState({ ...state, tickets: [nt, ...tickets] });
    setNewOpen(false);
    setTimeout(resetForm, 400);
  };

  const CATEGORIES = [
    { id: 'Manutenção', ic: <Ic.wrench width={16} height={16}/>, color: '#b8770e', bg: '#fff4e0' },
    { id: 'Reclamação', ic: <Ic.alert width={16} height={16}/>, color: '#b53a3a', bg: '#fde7e7' },
    { id: 'Sugestão',   ic: <Ic.star width={16} height={16}/>,  color: 'var(--accent-600)', bg: '#eef7dd' },
    { id: 'Limpeza',    ic: <Ic.settings width={16} height={16}/>, color: 'var(--brand)', bg: 'var(--brand-50)' },
    { id: 'Segurança',  ic: <Ic.shield width={16} height={16}/>, color: 'var(--ink)', bg: '#eef2f6' },
    { id: 'Outros',     ic: <Ic.menu width={16} height={16}/>, color: 'var(--ink-2)', bg: '#eef2f6' },
  ];

  return (
    <div className="fade-in" style={{ paddingBottom: 120 }}>
      <THead title="Chamados" subtitle="Manutenção & Reclamações" onBack={()=>nav.back()} right={
        <button onClick={()=>setNewOpen(true)} style={{ height: 40, width: 40, padding: 0, borderRadius: 12, background:'var(--brand)', border:'none', color:'#fff', cursor:'pointer', display:'grid', placeItems:'center', boxShadow:'0 6px 16px -4px rgba(10,132,200,.45)' }}>
          <Ic.plus width={18} height={18}/>
        </button>
      }/>

      {/* Status summary cards */}
      <div style={{ padding: '4px 16px 16px', display:'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}>
        {[
          { k: 'aberto', label: 'Abertos', color: '#b8770e', bg: '#fff4e0' },
          { k: 'andamento', label: 'Em andamento', color: 'var(--brand)', bg: 'var(--brand-50)' },
          { k: 'finalizado', label: 'Finalizados', color: 'var(--accent-600)', bg: '#eef7dd' },
        ].map(s => (
          <button key={s.k} onClick={()=>setFilter(s.k)} style={{
            padding: 14, borderRadius: 16, border: `1px solid ${filter===s.k?s.color:'var(--line)'}`,
            background: filter===s.k ? s.bg : '#fff', textAlign:'left', cursor:'pointer',
            transition: 'all .2s',
          }}>
            <div style={{ fontSize: 22, fontWeight: 800, color: s.color, lineHeight: 1 }}>{counts[s.k]}</div>
            <div style={{ fontSize: 11, color: 'var(--ink-3)', marginTop: 4, fontWeight: 600 }}>{s.label}</div>
          </button>
        ))}
      </div>

      {/* filter tabs */}
      <div style={{ padding: '0 16px 12px', display:'flex', gap: 8, overflowX:'auto' }} className="phone-scroll">
        {[['todos','Todos'],['aberto','Abertos'],['andamento','Em andamento'],['finalizado','Finalizados']].map(([id,label])=>(
          <button key={id} onClick={()=>setFilter(id)} style={{
            padding: '8px 14px', borderRadius: 999,
            background: filter===id ? 'var(--ink)' : '#fff',
            color: filter===id ? '#fff' : 'var(--ink-2)',
            border: `1px solid ${filter===id ? 'var(--ink)' : 'var(--line)'}`,
            fontSize: 13, fontWeight: 600, cursor:'pointer', whiteSpace:'nowrap',
          }}>{label} <span style={{opacity:.6, marginLeft: 4}}>{counts[id]}</span></button>
        ))}
      </div>

      <div style={{ padding: '0 16px', display:'flex', flexDirection:'column', gap: 10 }}>
        {filtered.map(t => (
          <TCard key={t.id} interactive onClick={()=>nav.go('ticket-detail',{id: t.id})} style={{ padding: 16 }}>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', gap: 10 }}>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display:'flex', alignItems:'center', gap: 8, marginBottom: 8, flexWrap:'wrap' }}>
                  <span style={{ fontFamily:'var(--font-mono)', fontSize: 11, color:'var(--ink-3)' }}>{t.code}</span>
                  <StatusPill status={t.status}/>
                  {t.priority === 'alta' && <TBadge tone="red">alta</TBadge>}
                </div>
                <div style={{ fontSize: 15, fontWeight: 700, color:'var(--ink)', lineHeight: 1.3 }}>{t.title}</div>
                <div style={{ fontSize: 12, color:'var(--ink-3)', marginTop: 8, display:'flex', gap: 10, flexWrap:'wrap' }}>
                  <span>{t.category}</span>
                  {t.location && <><span>•</span><span>{t.location}</span></>}
                  <span>•</span><span>Aberto {t.created}</span>
                </div>
              </div>
              <Ic.chevR width={18} height={18} style={{color:'var(--ink-3)', flexShrink: 0, marginTop: 4}}/>
            </div>
          </TCard>
        ))}
        {filtered.length === 0 && (
          <TCard style={{ padding: 40, textAlign:'center' }}>
            <div style={{ fontSize: 40, marginBottom: 10 }}>📋</div>
            <div style={{ fontSize: 14, fontWeight: 700, color:'var(--ink)' }}>Nenhum chamado</div>
            <div style={{ fontSize: 12, color:'var(--ink-3)', marginTop: 4 }}>Toque no + para abrir um novo</div>
          </TCard>
        )}
      </div>

      {/* Multi-step new ticket sheet */}
      <TSheet open={newOpen} onClose={()=>{setNewOpen(false); setTimeout(resetForm, 400);}} title={`Novo chamado ${step}/3`}>
        {/* Progress */}
        <div style={{ display:'flex', gap: 4, marginBottom: 20 }}>
          {[1,2,3].map(n => (
            <div key={n} style={{
              flex: 1, height: 4, borderRadius: 4,
              background: n <= step ? 'var(--brand)' : 'var(--line)',
              transition: 'background .3s',
            }}/>
          ))}
        </div>

        {step === 1 && (
          <div className="fade-in">
            <div style={{ fontSize: 18, fontWeight: 800, color:'var(--ink)', marginBottom: 4 }}>Qual o tipo do problema?</div>
            <div style={{ fontSize: 13, color:'var(--ink-3)', marginBottom: 18 }}>Selecione a categoria que melhor descreve sua solicitação.</div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 20 }}>
              {CATEGORIES.map(c => (
                <button key={c.id} onClick={()=>setCat(c.id)} style={{
                  padding: 14, borderRadius: 14, textAlign:'left',
                  background: cat === c.id ? c.bg : '#fff',
                  border: `1px solid ${cat === c.id ? c.color : 'var(--line)'}`,
                  cursor:'pointer', display:'flex', flexDirection:'column', gap: 8,
                  transition: 'all .2s',
                }}>
                  <div style={{ width: 34, height: 34, borderRadius: 10, background: c.bg, color: c.color, display:'grid', placeItems:'center' }}>{c.ic}</div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--ink)' }}>{c.id}</div>
                </button>
              ))}
            </div>
            <TPB onClick={()=>setStep(2)} disabled={!cat}>Continuar</TPB>
          </div>
        )}

        {step === 2 && (
          <div className="fade-in">
            <div style={{ fontSize: 18, fontWeight: 800, color:'var(--ink)', marginBottom: 4 }}>Conte o que aconteceu</div>
            <div style={{ fontSize: 13, color:'var(--ink-3)', marginBottom: 18 }}>Quanto mais detalhes, mais rápida a resolução.</div>

            <TInput label="Título resumido" value={title} onChange={setTitle} placeholder="Ex. Torneira vazando na cozinha"/>

            <TInput label="Local específico" value={location} onChange={setLocation} placeholder="Ex. Garagem G2, vaga 42 • Hall do 12º andar"/>

            <TInput label="Descreva o problema" value={desc} onChange={setDesc} textarea rows={4} placeholder="Dê detalhes que possam ajudar a equipe a resolver..."/>

            <div style={{ marginBottom: 16 }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--ink-2)', marginBottom: 8, textTransform: 'uppercase', letterSpacing: .5 }}>Prioridade</div>
              <div style={{ display:'flex', gap: 8 }}>
                {[
                  { id: 'baixa', label: 'Baixa', color: 'var(--ink-3)' },
                  { id: 'normal', label: 'Normal', color: 'var(--brand)' },
                  { id: 'alta', label: 'Alta', color: 'var(--danger)' },
                ].map(p => (
                  <button key={p.id} onClick={()=>setPriority(p.id)} style={{
                    flex:1, padding:'12px 8px', borderRadius: 12,
                    background: priority===p.id ? '#fff' : 'var(--bg-2)',
                    color: priority===p.id ? p.color : 'var(--ink-2)',
                    border: `1px solid ${priority===p.id ? p.color : 'var(--line)'}`,
                    fontSize: 13, fontWeight: 700, cursor:'pointer',
                  }}>{p.label}</button>
                ))}
              </div>
            </div>

            {/* Photo upload */}
            <div style={{ marginBottom: 20 }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--ink-2)', marginBottom: 8, textTransform: 'uppercase', letterSpacing: .5 }}>Fotos (opcional)</div>
              <div style={{ display:'flex', gap: 8, flexWrap:'wrap' }}>
                {photos.map((p, i) => (
                  <div key={i} style={{ width: 72, height: 72, borderRadius: 12, background: `linear-gradient(135deg, ${p})`, position:'relative' }}>
                    <button onClick={()=>setPhotos(photos.filter((_,idx)=>idx!==i))} style={{
                      position:'absolute', top:-6, right:-6, width: 22, height: 22, borderRadius:999,
                      background: '#fff', border: '1px solid var(--line)', cursor:'pointer', display:'grid', placeItems:'center',
                    }}>
                      <Ic.close width={12} height={12}/>
                    </button>
                  </div>
                ))}
                {photos.length < 3 && (
                  <button onClick={()=>setPhotos([...photos, ['#e8f4fc','#c8e3f5','#0a84c8'][photos.length] + ', ' + ['#8dc63f','#a0d058','#6ea82d'][photos.length]])} style={{
                    width: 72, height: 72, borderRadius: 12, border: '1.5px dashed var(--line)',
                    background: '#fafcfd', color: 'var(--ink-3)', cursor:'pointer',
                    display:'grid', placeItems:'center',
                  }}>
                    <Ic.camera width={22} height={22}/>
                  </button>
                )}
              </div>
            </div>

            <div style={{ display:'flex', gap: 10 }}>
              <button onClick={()=>setStep(1)} style={{ flex: '0 0 auto', height: 52, padding:'0 20px', borderRadius: 16, border:'1px solid var(--line)', background:'#fff', color:'var(--ink)', fontWeight:700, cursor:'pointer' }}>Voltar</button>
              <div style={{ flex: 1 }}><TPB onClick={()=>setStep(3)} disabled={!title || !desc}>Revisar</TPB></div>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="fade-in">
            <div style={{ fontSize: 18, fontWeight: 800, color:'var(--ink)', marginBottom: 4 }}>Revise antes de enviar</div>
            <div style={{ fontSize: 13, color:'var(--ink-3)', marginBottom: 18 }}>Confira os dados. Você poderá acompanhar tudo em "Chamados".</div>

            <TCard style={{ padding: 16, marginBottom: 16 }}>
              <div style={{ display:'flex', alignItems:'center', gap: 8, marginBottom: 10 }}>
                <TBadge tone="amber">Aberto</TBadge>
                {priority === 'alta' && <TBadge tone="red">alta</TBadge>}
                <span style={{ fontSize: 11, color:'var(--ink-3)', marginLeft: 'auto' }}>{cat}</span>
              </div>
              <div style={{ fontSize: 16, fontWeight: 700, color:'var(--ink)', marginBottom: 8 }}>{title}</div>
              {location && <div style={{ fontSize: 12, color:'var(--ink-3)', marginBottom: 8, display:'flex', alignItems:'center', gap: 4 }}>
                <Ic.pin width={12} height={12}/>{location}
              </div>}
              <div style={{ fontSize: 13, color:'var(--ink-2)', lineHeight: 1.5 }}>{desc}</div>
              {photos.length > 0 && (
                <div style={{ display:'flex', gap: 6, marginTop: 10 }}>
                  {photos.map((p,i)=>(
                    <div key={i} style={{ width: 50, height: 50, borderRadius: 8, background: `linear-gradient(135deg, ${p})` }}/>
                  ))}
                </div>
              )}
            </TCard>

            <div style={{ display:'flex', gap: 10 }}>
              <button onClick={()=>setStep(2)} style={{ flex: '0 0 auto', height: 52, padding:'0 20px', borderRadius: 16, border:'1px solid var(--line)', background:'#fff', color:'var(--ink)', fontWeight:700, cursor:'pointer' }}>Editar</button>
              <div style={{ flex: 1 }}><TPB onClick={submit} icon={<Ic.check width={18} height={18}/>}>Abrir chamado</TPB></div>
            </div>
          </div>
        )}
      </TSheet>
    </div>
  );
}

function TicketDetailScreen({ nav, data, params, state, setState }) {
  const [reply, setReply] = React.useState('');
  const t = state.tickets.find(x => x.id === params.id);
  if (!t) return null;

  const addMsg = () => {
    if (!reply.trim()) return;
    const updated = state.tickets.map(x => x.id === t.id ? {
      ...x, timeline: [{ t: 'agora', who: 'Você', text: reply.trim() }, ...x.timeline], lastUpdate: 'agora',
    } : x);
    setState({...state, tickets: updated });
    setReply('');
  };

  const closeTicket = () => {
    const updated = state.tickets.map(x => x.id === t.id ? {
      ...x, status: 'finalizado',
      timeline: [{ t: 'agora', who: 'Você', text: 'Problema resolvido. Obrigada!' }, ...x.timeline],
    } : x);
    setState({...state, tickets: updated });
  };

  return (
    <div className="fade-in" style={{ paddingBottom: 180 }}>
      <THead title={t.title} subtitle={`${t.code} • ${t.category}`} onBack={()=>nav.back()}/>

      <div style={{ padding:'0 20px 20px' }}>
        <div style={{ padding: '20px 16px', background: '#fff', border: '1px solid var(--line)', borderRadius: 16, marginBottom: 16 }}>
          <StatusStep current={t.status}/>
        </div>

        {t.location && (
          <div style={{ padding: '12px 14px', background:'var(--bg-2)', borderRadius: 12, marginBottom: 12, display:'flex', alignItems:'center', gap: 10 }}>
            <Ic.pin width={16} height={16} style={{color:'var(--brand)'}}/>
            <span style={{ fontSize: 13, color: 'var(--ink-2)' }}>{t.location}</span>
          </div>
        )}

        {t.photos && t.photos.length > 0 && (
          <div style={{ display:'flex', gap: 8, marginBottom: 16, overflowX:'auto' }} className="phone-scroll">
            {t.photos.map((p, i) => (
              <div key={i} style={{ width: 100, height: 100, borderRadius: 12, background: `linear-gradient(135deg, ${p})`, flexShrink: 0 }}/>
            ))}
          </div>
        )}
      </div>

      <div style={{ padding: '0 20px 20px' }}>
        <div style={{ fontSize: 12, color:'var(--ink-3)', fontWeight:700, textTransform:'uppercase', letterSpacing:.6, marginBottom: 12 }}>Histórico</div>
        <div style={{ position:'relative' }}>
          <div style={{ position:'absolute', left: 11, top: 10, bottom: 10, width: 2, background: 'var(--line-2)' }}/>
          {t.timeline.map((m, i) => (
            <div key={i} style={{ position:'relative', paddingLeft: 34, marginBottom: 18 }}>
              <div style={{
                position:'absolute', left: 4, top: 6,
                width: 16, height: 16, borderRadius: 8,
                background: m.who==='Você' ? 'var(--brand)' : m.who==='Síndico' ? 'var(--accent)' : m.who==='Zelador' ? 'var(--warn)' : '#fff',
                border: !['Você','Síndico','Zelador'].includes(m.who) ? '2px solid var(--line)' : 'none',
                boxShadow: '0 0 0 3px #fff',
              }}/>
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'baseline' }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--ink)' }}>{m.who}</div>
                <div style={{ fontSize: 11, color: 'var(--ink-3)' }}>{m.t}</div>
              </div>
              <div style={{ fontSize: 14, color: 'var(--ink-2)', marginTop: 6, lineHeight: 1.45, textWrap:'pretty' }}>{m.text}</div>
            </div>
          ))}
        </div>
      </div>

      {t.status !== 'finalizado' && (
        <div style={{ padding: '0 20px' }}>
          <TInput label="Adicionar comentário" value={reply} onChange={setReply} textarea rows={2} placeholder="Digite aqui..."/>
          <div style={{ display:'flex', gap: 10 }}>
            <button onClick={closeTicket} style={{ flex:'0 0 auto', height: 52, padding: '0 18px', borderRadius: 16, border: '1px solid var(--success)', background:'#fff', color: 'var(--success)', fontWeight: 700, cursor:'pointer' }}>Finalizar</button>
            <div style={{ flex: 1 }}><TPB onClick={addMsg} disabled={!reply.trim()}>Enviar</TPB></div>
          </div>
        </div>
      )}

      {t.status === 'finalizado' && (
        <div style={{ padding: '0 20px' }}>
          <TCard style={{ padding: 20, textAlign:'center', background: 'linear-gradient(135deg, #eef7dd 0%, #e8f4fc 100%)', border:'1px solid var(--brand-50)' }}>
            <div style={{ width: 52, height: 52, borderRadius: 999, background:'var(--success)', color:'#fff', display:'grid', placeItems:'center', margin:'0 auto 10px' }}>
              <Ic.check width={26} height={26}/>
            </div>
            <div style={{ fontSize: 15, fontWeight: 700, color:'var(--ink)' }}>Chamado finalizado</div>
            <div style={{ fontSize: 12, color:'var(--ink-3)', marginTop: 4, marginBottom: 14 }}>Avalie o atendimento para ajudar a melhorar</div>
            <div style={{ display:'flex', gap: 6, justifyContent:'center' }}>
              {[1,2,3,4,5].map(n => (
                <button key={n} style={{ width: 36, height: 36, borderRadius: 999, background:'#fff', border:'1px solid var(--line)', cursor:'pointer', display:'grid', placeItems:'center', color: n<=4 ? 'var(--warn)' : 'var(--ink-3)' }}>
                  <Ic.star width={16} height={16}/>
                </button>
              ))}
            </div>
          </TCard>
        </div>
      )}
    </div>
  );
}

window.Screens = window.Screens || {};
window.Screens.Tickets = TicketsScreen;
window.Screens.TicketDetail = TicketDetailScreen;
