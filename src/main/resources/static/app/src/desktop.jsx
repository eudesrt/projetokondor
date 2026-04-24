// Desktop admin dashboard (síndico)
const { Card: DCard, Badge: DBadge } = window.UI;

function DesktopStat({ label, value, delta, tone='brand' }) {
  const tones = { brand:'var(--brand)', accent:'var(--accent-600)', amber:'#b8770e', red:'#b53a3a' };
  return (
    <DCard style={{ padding: 20, flex: 1 }}>
      <div style={{ fontSize: 12, color:'var(--ink-3)', fontWeight:700, textTransform:'uppercase', letterSpacing:.5 }}>{label}</div>
      <div style={{ fontSize: 32, fontWeight: 800, color: 'var(--ink)', marginTop: 8, letterSpacing:-1 }}>{value}</div>
      {delta && <div style={{ fontSize: 12, color: tones[tone], marginTop: 4, fontWeight: 600 }}>{delta}</div>}
    </DCard>
  );
}

function DesktopAdmin({ data }) {
  return (
    <div style={{
      width: 1280, height: 1280, background: '#f4f7fa', borderRadius: 16, overflow: 'hidden',
      display: 'flex', fontFamily: 'var(--font-ui)', color: 'var(--ink)',
      boxShadow: '0 40px 80px rgba(0,0,0,.2), 0 0 0 1px rgba(0,0,0,.1)',
    }}>
      {/* Sidebar */}
      <div style={{ width: 240, background: '#fff', borderRight: '1px solid var(--line)', padding: '24px 16px', display:'flex', flexDirection:'column', gap: 4 }}>
        <div style={{ display:'flex', alignItems:'center', gap: 10, padding: '8px 8px 20px' }}>
          <Ic.logo width={32} height={32}/>
          <div>
            <div style={{ fontSize: 13, fontWeight: 800, color:'var(--ink)' }}>Vila Mascote</div>
            <div style={{ fontSize: 11, color:'var(--ink-3)' }}>Painel do síndico</div>
          </div>
        </div>
        {[
          { ic: <Ic.home width={16} height={16}/>, label: 'Dashboard', active: true },
          { ic: <Ic.wrench width={16} height={16}/>, label: 'Chamados', badge: 8 },
          { ic: <Ic.news width={16} height={16}/>, label: 'Publicações' },
          { ic: <Ic.shield width={16} height={16}/>, label: 'Controle de acesso' },
          { ic: <Ic.cal width={16} height={16}/>, label: 'Reservas' },
          { ic: <Ic.box width={16} height={16}/>, label: 'Encomendas', badge: 12 },
          { ic: <Ic.poll width={16} height={16}/>, label: 'Votações' },
          { ic: <Ic.user width={16} height={16}/>, label: 'Moradores' },
        ].map((it, i) => (
          <div key={i} style={{
            display:'flex', alignItems:'center', gap: 12, padding: '10px 12px', borderRadius: 10,
            background: it.active ? 'var(--brand-50)' : 'transparent',
            color: it.active ? 'var(--brand)' : 'var(--ink-2)',
            fontSize: 13, fontWeight: it.active ? 700 : 500, cursor:'pointer',
          }}>
            {it.ic}<span style={{ flex: 1 }}>{it.label}</span>
            {it.badge && <span style={{ fontSize: 10, fontWeight: 700, background: 'var(--danger)', color:'#fff', padding:'2px 7px', borderRadius: 999 }}>{it.badge}</span>}
          </div>
        ))}
        <div style={{ flex: 1 }}/>
        <div style={{ padding: 12, background: '#f4f7fa', borderRadius: 12, display:'flex', alignItems:'center', gap: 10 }}>
          <div style={{ width: 34, height: 34, borderRadius: 999, background: 'var(--ink)', color:'#fff', display:'grid', placeItems:'center', fontSize:12, fontWeight:700 }}>RA</div>
          <div style={{ flex:1, minWidth:0 }}>
            <div style={{ fontSize: 12, fontWeight: 700 }}>Roberto Almeida</div>
            <div style={{ fontSize: 10, color:'var(--ink-3)' }}>Síndico</div>
          </div>
        </div>
      </div>

      {/* Main */}
      <div style={{ flex: 1, overflow: 'auto' }}>
        {/* topbar */}
        <div style={{ padding: '20px 32px', borderBottom: '1px solid var(--line)', background:'#fff', display:'flex', alignItems:'center', gap: 16 }}>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 11, color:'var(--ink-3)', fontWeight: 700, textTransform:'uppercase', letterSpacing:.5 }}>Painel do síndico</div>
            <div style={{ fontSize: 22, fontWeight: 800, letterSpacing:-.5 }}>Visão geral — abril / 2026</div>
          </div>
          <div style={{ display:'flex', alignItems:'center', gap:10, background:'#f4f7fa', padding:'10px 14px', borderRadius: 10, width: 260 }}>
            <Ic.search width={16} height={16} style={{color:'var(--ink-3)'}}/>
            <span style={{ fontSize: 13, color:'var(--ink-3)' }}>Buscar morador, unidade...</span>
          </div>
          <button style={{ padding:'10px 16px', borderRadius: 10, background:'var(--brand)', color:'#fff', border:'none', fontSize: 13, fontWeight:700, cursor:'pointer', display:'flex', alignItems:'center', gap:6 }}>
            <Ic.plus width={14} height={14}/> Nova publicação
          </button>
        </div>

        <div style={{ padding: 32 }}>
          {/* stats */}
          <div style={{ display:'flex', gap: 16, marginBottom: 20 }}>
            <DesktopStat label="Moradores ativos" value="284" delta="+12 este mês" tone="accent"/>
            <DesktopStat label="Chamados abertos" value="8" delta="3 aguardando resposta" tone="amber"/>
            <DesktopStat label="Encomendas" value="12" delta="7 há +48h" tone="red"/>
            <DesktopStat label="Reservas hoje" value="5" delta="Churrasqueira lotada sábado" tone="brand"/>
          </div>

          {/* Featured news section */}
          <DCard style={{ padding: 0, overflow:'hidden', marginBottom: 20 }}>
            <div style={{ padding: '18px 24px', display:'flex', justifyContent:'space-between', alignItems:'center', borderBottom:'1px solid var(--line)' }}>
              <div>
                <div style={{ fontSize: 11, color:'var(--ink-3)', fontWeight: 700, textTransform:'uppercase', letterSpacing:.6 }}>Portal de notícias</div>
                <div style={{ fontFamily:'var(--font-serif)', fontSize: 24, color:'var(--ink)', lineHeight: 1.1, marginTop: 2 }}>Notícias em destaque</div>
              </div>
              <div style={{ display:'flex', alignItems:'center', gap: 8 }}>
                <button style={{ padding:'8px 14px', borderRadius: 10, background:'#fff', border:'1px solid var(--line)', color:'var(--ink-2)', fontSize: 12, fontWeight:700, cursor:'pointer' }}>Gerenciar</button>
                <button style={{ padding:'8px 14px', borderRadius: 10, background:'var(--brand)', color:'#fff', border:'none', fontSize: 12, fontWeight:700, cursor:'pointer', display:'flex', alignItems:'center', gap:6 }}>
                  <Ic.plus width={12} height={12}/> Publicar notícia
                </button>
              </div>
            </div>

            <div style={{ padding: 24, display:'grid', gridTemplateColumns: '1.6fr 1fr 1fr', gap: 18 }}>
              {/* HERO */}
              {(() => {
                const hero = data.NEWS[0];
                const toneOf = (tag) => tag==='eventos'?'green':tag==='avisos'?'amber':'brand';
                return (
                  <div style={{
                    borderRadius: 16, overflow: 'hidden', position: 'relative',
                    cursor: 'pointer', minHeight: 320,
                    background: '#eef2f6',
                  }}>
                    <div style={{
                      position:'absolute', inset: 0,
                      backgroundImage: `url(${hero.img})`,
                      backgroundSize: 'cover', backgroundPosition: 'center',
                    }}/>
                    <div style={{
                      position:'absolute', inset: 0,
                      background:'linear-gradient(180deg, rgba(0,0,0,0) 30%, rgba(0,0,0,.75) 100%)',
                    }}/>
                    <div style={{ position:'absolute', top: 16, left: 16, display:'flex', gap: 8 }}>
                      <DBadge tone={toneOf(hero.tag)}>{hero.cat}</DBadge>
                      <span style={{ padding:'3px 9px', borderRadius: 999, background:'rgba(255,255,255,.9)', fontSize: 10, fontWeight: 800, color:'var(--ink)', letterSpacing:.5, textTransform:'uppercase' }}>⭐ Destaque</span>
                    </div>
                    <div style={{ position:'absolute', top: 16, right: 16, display:'flex', gap: 6 }}>
                      <button style={{ padding:'6px 10px', borderRadius: 8, background:'rgba(255,255,255,.95)', border:'none', fontSize: 11, fontWeight: 700, cursor:'pointer', color:'var(--ink)' }}>Editar</button>
                    </div>
                    <div style={{ position:'absolute', bottom: 0, left: 0, right: 0, padding: 24, color:'#fff' }}>
                      <div style={{ fontFamily:'var(--font-serif)', fontSize: 28, lineHeight: 1.15, letterSpacing:-.5, textShadow:'0 1px 2px rgba(0,0,0,.3)' }}>
                        {hero.title}
                      </div>
                      <div style={{ fontSize: 13, lineHeight: 1.5, opacity: .9, marginTop: 10,
                        display:'-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient:'vertical', overflow:'hidden',
                      }}>{hero.excerpt}</div>
                      <div style={{ display:'flex', alignItems:'center', gap: 12, marginTop: 14, fontSize: 11, opacity: .85 }}>
                        <span>{hero.author || 'Administração'}</span>
                        <span>•</span>
                        <span>{hero.date}</span>
                        <span>•</span>
                        <span>{hero.read}</span>
                        <span style={{ marginLeft:'auto', display:'inline-flex', alignItems:'center', gap: 4 }}>
                          <Ic.user width={11} height={11}/> 218 leituras
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })()}

              {/* Secondary 1 */}
              {data.NEWS.slice(1, 3).map(n => {
                const toneOf = (tag) => tag==='eventos'?'green':tag==='avisos'?'amber':'brand';
                return (
                  <div key={n.id} style={{
                    borderRadius: 14, overflow:'hidden', cursor:'pointer',
                    border: '1px solid var(--line)', background:'#fff',
                    display:'flex', flexDirection:'column',
                  }}>
                    <div style={{
                      height: 150, position:'relative',
                      backgroundImage: `url(${n.img})`,
                      backgroundSize:'cover', backgroundPosition:'center',
                      backgroundColor:'#eef2f6',
                    }}>
                      <div style={{ position:'absolute', top: 10, left: 10 }}>
                        <DBadge tone={toneOf(n.tag)}>{n.cat}</DBadge>
                      </div>
                    </div>
                    <div style={{ padding: 14, display:'flex', flexDirection:'column', flex: 1 }}>
                      <div style={{ fontSize: 14, fontWeight: 700, color:'var(--ink)', lineHeight: 1.3,
                        display:'-webkit-box', WebkitLineClamp:2, WebkitBoxOrient:'vertical', overflow:'hidden',
                      }}>{n.title}</div>
                      <div style={{ fontSize: 12, color:'var(--ink-3)', lineHeight: 1.45, marginTop: 6,
                        display:'-webkit-box', WebkitLineClamp:2, WebkitBoxOrient:'vertical', overflow:'hidden',
                      }}>{n.excerpt}</div>
                      <div style={{ marginTop: 'auto', paddingTop: 10, display:'flex', justifyContent:'space-between', alignItems:'center', fontSize: 11, color:'var(--ink-3)' }}>
                        <span>{n.date}</span>
                        <span>{n.read}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Secondary list row: remaining 3 */}
            <div style={{ padding: '0 24px 24px' }}>
              <div style={{ display:'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 14 }}>
                {data.NEWS.slice(3).map(n => {
                  const toneOf = (tag) => tag==='eventos'?'green':tag==='avisos'?'amber':'brand';
                  return (
                    <div key={n.id} style={{
                      padding: 12, borderRadius: 12, background: '#fafcfd',
                      border: '1px solid var(--line)', cursor: 'pointer',
                      display:'flex', gap: 12,
                    }}>
                      <div style={{
                        width: 72, height: 72, flexShrink: 0, borderRadius: 10,
                        backgroundImage:`url(${n.img})`, backgroundSize:'cover', backgroundPosition:'center',
                        backgroundColor:'#eef2f6',
                      }}/>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <DBadge tone={toneOf(n.tag)}>{n.cat}</DBadge>
                        <div style={{ fontSize: 13, fontWeight: 700, color:'var(--ink)', marginTop: 5, lineHeight: 1.3,
                          display:'-webkit-box', WebkitLineClamp:2, WebkitBoxOrient:'vertical', overflow:'hidden',
                        }}>{n.title}</div>
                        <div style={{ fontSize: 11, color:'var(--ink-3)', marginTop: 5 }}>{n.date} • {n.read}</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </DCard>

          {/* two columns */}
          <div style={{ display:'grid', gridTemplateColumns: '1.4fr 1fr', gap: 16 }}>
            {/* Tickets table */}
            <DCard style={{ padding: 0, overflow:'hidden' }}>
              <div style={{ padding: '18px 20px', display:'flex', justifyContent:'space-between', alignItems:'center', borderBottom:'1px solid var(--line)' }}>
                <div>
                  <div style={{ fontSize: 15, fontWeight: 800 }}>Chamados recentes</div>
                  <div style={{ fontSize: 12, color:'var(--ink-3)', marginTop: 2 }}>Priorizados por status e data</div>
                </div>
                <button style={{ fontSize: 12, color:'var(--brand)', background:'none', border:'none', fontWeight:700, cursor:'pointer' }}>Ver todos →</button>
              </div>
              <div>
                {data.TICKETS.concat([
                  { id:'t4', code:'#2501', title:'Portão social travando', status:'aberto', category:'Manutenção', created:'hoje' },
                  { id:'t5', code:'#2478', title:'Limpeza do hall', status:'andamento', category:'Reclamação', created:'20 abr' },
                ]).map((t, i) => (
                  <div key={t.id} style={{
                    padding: '14px 20px', display:'grid',
                    gridTemplateColumns: '80px 1fr 120px 110px 28px', gap: 14, alignItems:'center',
                    borderBottom: i<4 ? '1px solid var(--line-2)' : 'none',
                  }}>
                    <span style={{ fontFamily:'var(--font-mono)', fontSize: 12, color:'var(--ink-3)' }}>{t.code}</span>
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 700 }}>{t.title}</div>
                      <div style={{ fontSize: 11, color:'var(--ink-3)', marginTop: 2 }}>Apto 1208 • {t.category}</div>
                    </div>
                    <span style={{ fontSize: 12, color:'var(--ink-3)' }}>{t.created}</span>
                    <DBadge tone={t.status==='aberto'?'amber':t.status==='andamento'?'brand':'green'}>{t.status}</DBadge>
                    <Ic.chevR width={16} height={16} style={{color:'var(--ink-3)'}}/>
                  </div>
                ))}
              </div>
            </DCard>

            {/* Right column: urgent + activity */}
            <div style={{ display:'flex', flexDirection:'column', gap: 16 }}>
              <DCard style={{ padding: 18, border:'1px solid #f8c8c8', background:'linear-gradient(135deg,#fff5f5,#fde7e7)' }}>
                <div style={{ display:'flex', alignItems:'center', gap: 10 }}>
                  <div style={{ width: 34, height: 34, borderRadius: 10, background:'#e45454', color:'#fff', display:'grid', placeItems:'center' }}>
                    <Ic.alert width={16} height={16}/>
                  </div>
                  <div style={{ fontSize: 11, fontWeight: 800, color:'#b53a3a', textTransform:'uppercase', letterSpacing:.5 }}>Comunicado urgente ativo</div>
                </div>
                <div style={{ fontSize: 15, fontWeight: 700, marginTop: 10 }}>Manutenção da caixa d'água — terça, 09h</div>
                <div style={{ fontSize: 12, color:'var(--ink-2)', marginTop: 6, lineHeight:1.5 }}>Visualizado por 218 de 284 moradores (77%)</div>
                <div style={{ marginTop: 10, height: 6, borderRadius: 999, background: '#fff', overflow:'hidden' }}>
                  <div style={{ width: '77%', height:'100%', background:'#e45454' }}/>
                </div>
              </DCard>

              <DCard style={{ padding: 20 }}>
                <div style={{ fontSize: 15, fontWeight: 800, marginBottom: 14 }}>Atividade agora</div>
                {[
                  { t:'14:32', txt:'Carlos Mendes entrou (visitante Apto 1208)', c:'var(--success)' },
                  { t:'14:15', txt:'Novo chamado #2501 aberto (Apto 502)', c:'var(--warn)' },
                  { t:'13:40', txt:'Encomenda Amazon retirada por Apto 804', c:'var(--ink-3)' },
                  { t:'12:10', txt:'iFood entrou (Apto 1208)', c:'var(--success)' },
                  { t:'11:02', txt:'Reserva salão confirmada — 25 abr', c:'var(--brand)' },
                ].map((a, i) => (
                  <div key={i} style={{ display:'flex', gap: 12, padding:'8px 0', borderBottom: i<4?'1px solid var(--line-2)':'none' }}>
                    <span style={{ width: 8, height: 8, borderRadius: 4, background: a.c, marginTop: 6, flexShrink:0 }}/>
                    <div style={{ flex:1 }}>
                      <div style={{ fontSize: 12, color:'var(--ink-3)' }}>{a.t}</div>
                      <div style={{ fontSize: 13, color:'var(--ink)' }}>{a.txt}</div>
                    </div>
                  </div>
                ))}
              </DCard>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

window.DesktopAdmin = DesktopAdmin;
