// News list + detail — expanded portal experience

const { Card: NCard, Chip: NChip, Badge: NBadge, ScreenHeader: NHead, Photo: NPhoto, Avatar: NAvatar } = window.UI;

function NewsListScreen({ nav, data }) {
  const [cat, setCat] = React.useState('todos');
  const [search, setSearch] = React.useState('');
  const [searchOpen, setSearchOpen] = React.useState(false);

  let filtered = cat === 'todos' ? data.NEWS : data.NEWS.filter(n => n.tag === cat);
  if (search) {
    filtered = filtered.filter(n =>
      n.title.toLowerCase().includes(search.toLowerCase()) ||
      n.excerpt.toLowerCase().includes(search.toLowerCase())
    );
  }
  const [hero, ...rest] = filtered;

  const toneOf = (tag) => tag==='eventos'?'green':tag==='avisos'?'amber':'brand';

  return (
    <div className="fade-in" style={{ paddingBottom: 120 }}>
      {/* Masthead */}
      <div style={{ padding: '58px 20px 12px' }}>
        <div style={{ display:'flex', alignItems:'center', gap: 10, marginBottom: 12 }}>
          <button onClick={()=>nav.back && nav.back()} style={{ width: 36, height: 36, borderRadius: 10, border:'1px solid var(--line)', background:'#fff', cursor:'pointer', display: nav.back ? 'grid':'none', placeItems:'center' }}>
            <Ic.chevL width={16} height={16}/>
          </button>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 11, color: 'var(--ink-3)', fontWeight: 700, textTransform:'uppercase', letterSpacing: .8 }}>O diário do condomínio</div>
            <div style={{ fontFamily:'var(--font-serif)', fontSize: 34, lineHeight: 1, color: 'var(--ink)', letterSpacing: -1, marginTop: 2 }}>Notícias</div>
          </div>
          <button onClick={()=>setSearchOpen(s=>!s)} style={{ width:40, height:40, borderRadius:12, background: searchOpen?'var(--brand-50)':'#fff', border: `1px solid ${searchOpen?'var(--brand)':'var(--line)'}`, display:'grid', placeItems:'center', cursor:'pointer' }}>
            <Ic.search width={18} height={18} style={{color: searchOpen?'var(--brand)':'var(--ink)'}}/>
          </button>
        </div>

        {searchOpen && (
          <div className="fade-in" style={{ display:'flex', alignItems:'center', gap: 10, background: '#fff', border: '1px solid var(--line)', borderRadius: 14, padding: '0 14px', height: 46, marginBottom: 12 }}>
            <Ic.search width={16} height={16} style={{color:'var(--ink-3)'}}/>
            <input autoFocus value={search} onChange={e=>setSearch(e.target.value)} placeholder="Buscar notícia..."
              style={{ flex:1, border:'none', outline:'none', background:'transparent', fontFamily:'inherit', fontSize: 14, color:'var(--ink)' }}/>
            {search && <button onClick={()=>setSearch('')} style={{ border:'none', background:'none', cursor:'pointer', color:'var(--ink-3)' }}><Ic.close width={16} height={16}/></button>}
          </div>
        )}

        {/* category pills */}
        <div style={{ display:'flex', gap: 8, overflowX:'auto', margin: '0 -20px', padding: '0 20px 4px' }} className="phone-scroll">
          {data.CATEGORIES.map(c => (
            <NChip key={c.id} active={cat===c.id} onClick={()=>setCat(c.id)}>{c.label}</NChip>
          ))}
        </div>
      </div>

      {/* Hero story */}
      {hero && (
        <div style={{ padding: '4px 16px 20px' }}>
          <NCard interactive onClick={()=>nav.go('news-detail',{id: hero.id})} style={{ padding: 0, overflow:'hidden' }}>
            <div style={{ position:'relative' }}>
              <NPhoto src={hero.img} alt={hero.title} style={{ width:'100%', height: 220, display:'block' }}/>
              <div style={{ position:'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(0,0,0,0) 40%, rgba(0,0,0,.55) 100%)' }}/>
              <div style={{ position:'absolute', top: 14, left: 14 }}>
                <NBadge tone={toneOf(hero.tag)}>{hero.cat}</NBadge>
              </div>
              <div style={{ position:'absolute', bottom: 14, left: 16, right: 16, color:'#fff' }}>
                <div style={{ fontSize: 10, fontWeight: 700, opacity: .9, letterSpacing: .8, textTransform:'uppercase' }}>Em destaque</div>
                <div style={{ fontFamily:'var(--font-serif)', fontSize: 22, lineHeight: 1.15, marginTop: 4, textShadow: '0 1px 2px rgba(0,0,0,.2)' }}>{hero.title}</div>
              </div>
            </div>
            <div style={{ padding: '14px 16px 16px' }}>
              <div style={{ fontSize: 13, color: 'var(--ink-2)', lineHeight: 1.5 }}>{hero.excerpt}</div>
              <div style={{ fontSize: 11, color: 'var(--ink-3)', marginTop: 10, display:'flex', gap: 8 }}>
                <span>{hero.date}</span><span>•</span><span>{hero.read}</span>
                {hero.author && <><span>•</span><span>{hero.author}</span></>}
              </div>
            </div>
          </NCard>
        </div>
      )}

      {/* Section header */}
      {rest.length > 0 && (
        <div style={{ padding: '4px 20px 10px', display:'flex', alignItems:'baseline', justifyContent:'space-between' }}>
          <div style={{ fontFamily:'var(--font-serif)', fontSize: 20, color:'var(--ink)' }}>Mais lidas</div>
          <div style={{ fontSize: 11, color:'var(--ink-3)', fontWeight:700, textTransform:'uppercase', letterSpacing:.6 }}>{rest.length} {rest.length===1?'notícia':'notícias'}</div>
        </div>
      )}

      {/* Rest — stacked */}
      <div style={{ padding: '0 16px', display:'flex', flexDirection:'column', gap: 10 }}>
        {rest.map(n => (
          <NCard key={n.id} interactive onClick={()=>nav.go('news-detail',{id: n.id})} style={{ padding: 12, display:'flex', gap: 12 }}>
            <NPhoto src={n.img} alt={n.title} style={{ width: 88, height: 88, borderRadius: 12, flexShrink: 0 }}/>
            <div style={{ flex: 1, minWidth: 0 }}>
              <NBadge tone={toneOf(n.tag)}>{n.cat}</NBadge>
              <div style={{ fontSize: 14, fontWeight: 700, color:'var(--ink)', marginTop: 6, lineHeight:1.3,
                display:'-webkit-box', WebkitLineClamp:2, WebkitBoxOrient:'vertical', overflow:'hidden',
              }}>{n.title}</div>
              <div style={{ fontSize: 11, color: 'var(--ink-3)', marginTop: 6, display:'flex', gap: 8 }}>
                <span>{n.date}</span><span>•</span><span>{n.read}</span>
              </div>
            </div>
          </NCard>
        ))}
        {filtered.length === 0 && (
          <NCard style={{ padding: 40, textAlign:'center' }}>
            <div style={{ fontSize: 40, marginBottom: 10 }}>🔍</div>
            <div style={{ fontSize: 14, fontWeight:700, color:'var(--ink)' }}>Nada encontrado</div>
            <div style={{ fontSize: 12, color:'var(--ink-3)', marginTop: 4 }}>Tente outra busca ou categoria</div>
          </NCard>
        )}
      </div>
    </div>
  );
}

function NewsDetailScreen({ nav, data, params }) {
  const isUrgent = params.id === 'urgent';
  const item = isUrgent ? {
    cat: 'Urgente', tag: 'avisos', date: data.URGENT.when, read: '1 min',
    title: data.URGENT.title, img: 'assets/tower.jpg', author: 'Administração',
    body: [
      'A CASAN realizará manutenção preventiva na caixa d\'água principal do condomínio na próxima terça-feira (28 abr).',
      'O abastecimento será interrompido das 09h às 13h. Recomenda-se que moradores façam reserva de água para uso essencial neste período.',
      'O funcionamento voltará ao normal assim que o serviço for concluído. Em caso de dúvidas, contate o zelador.',
    ],
  } : data.NEWS.find(n => n.id === params.id);

  const [liked, setLiked] = React.useState(false);
  const [saved, setSaved] = React.useState(false);

  if (!item) return null;

  const related = data.NEWS.filter(n => n.id !== item.id && n.tag === (item.tag||'avisos')).slice(0, 2);

  return (
    <div className="fade-in" style={{ paddingBottom: 140 }}>
      <div style={{ position:'relative' }}>
        <NPhoto src={item.img} alt={item.title} style={{ width:'100%', height: 300, display:'block' }}/>
        <div style={{
          position:'absolute', inset: 0,
          background: 'linear-gradient(180deg, rgba(0,0,0,.4) 0%, rgba(0,0,0,0) 35%, rgba(0,0,0,0) 65%, rgba(0,0,0,.35) 100%)',
        }}/>
        <button onClick={()=>nav.back()} style={{
          position:'absolute', top: 58, left: 16,
          width: 40, height: 40, borderRadius: 12, border:'none',
          background: 'rgba(255,255,255,.95)', backdropFilter:'blur(8px)',
          cursor:'pointer', display:'grid', placeItems:'center',
        }}>
          <Ic.chevL width={18} height={18}/>
        </button>
        <div style={{ position:'absolute', top: 58, right: 16, display:'flex', gap: 8 }}>
          <button onClick={()=>setSaved(!saved)} style={{
            width: 40, height: 40, borderRadius: 12, border:'none',
            background: 'rgba(255,255,255,.95)', cursor:'pointer',
            display:'grid', placeItems:'center', color: saved?'var(--warn)':'var(--ink)',
          }}>
            <Ic.star width={16} height={16}/>
          </button>
        </div>
        <div style={{ position:'absolute', bottom: 16, left: 16, right: 16 }}>
          <NBadge tone={isUrgent?'red':item.tag==='eventos'?'green':item.tag==='avisos'?'amber':'brand'}>{item.cat}</NBadge>
        </div>
      </div>

      <div style={{ padding: '22px 22px 0' }}>
        <div style={{ fontFamily:'var(--font-serif)', fontSize: 30, lineHeight: 1.1, color:'var(--ink)', letterSpacing:-.5 }}>{item.title}</div>

        <div style={{ display:'flex', alignItems:'center', gap: 10, marginTop: 16, paddingBottom: 16, borderBottom: '1px solid var(--line)' }}>
          <NAvatar initials={(item.author||'Administração').split(' ').map(s=>s[0]).slice(0,2).join('')} color="var(--brand)" size={36}/>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--ink)' }}>{item.author || 'Administração'}</div>
            <div style={{ fontSize: 11, color: 'var(--ink-3)', marginTop: 1 }}>{item.date} • {item.read} de leitura</div>
          </div>
          <button onClick={()=>setLiked(!liked)} style={{
            padding:'8px 14px', borderRadius: 999,
            background: liked ? 'var(--brand-50)' : '#fff', color: liked?'var(--brand)':'var(--ink-2)',
            border: `1px solid ${liked?'var(--brand)':'var(--line)'}`,
            fontSize: 12, fontWeight: 700, cursor:'pointer', display:'inline-flex', alignItems:'center', gap:6,
          }}>
            <span style={{ fontSize: 14 }}>{liked?'❤':'♡'}</span>
            {liked ? 'Curtido' : 'Curtir'}
          </button>
        </div>

        {item.body.map((p, i) => (
          <p key={i} style={{ fontSize: 16, lineHeight: 1.7, color: 'var(--ink-2)', marginTop: 16, marginBottom: 0, textWrap:'pretty' }}>{p}</p>
        ))}

        {/* Info callout for events */}
        {item.tag === 'eventos' && (
          <div style={{
            marginTop: 22, padding: 16, borderRadius: 16,
            background: 'linear-gradient(135deg, var(--brand-50) 0%, #eef7dd 100%)',
            border: '1px solid var(--brand-50)',
            display:'flex', alignItems:'center', gap: 14,
          }}>
            <div style={{ width: 42, height: 42, borderRadius: 12, background: '#fff', color: 'var(--brand)', display:'grid', placeItems:'center' }}>
              <Ic.cal width={20} height={20}/>
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 12, fontWeight: 800, color: 'var(--brand-600)', textTransform:'uppercase', letterSpacing:.6 }}>Inscreva-se</div>
              <div style={{ fontSize: 13, color: 'var(--ink-2)', marginTop: 2 }}>Vagas limitadas</div>
            </div>
            <button style={{ padding: '10px 14px', borderRadius: 10, background: 'var(--brand)', color: '#fff', border:'none', fontSize: 12, fontWeight: 700, cursor:'pointer' }}>
              Quero ir
            </button>
          </div>
        )}

        {/* Reactions bar */}
        <div style={{ marginTop: 24, padding: '14px 0', borderTop: '1px solid var(--line)', borderBottom: '1px solid var(--line)', display:'flex', alignItems:'center', gap: 20 }}>
          <div style={{ display:'flex', gap: 8 }}>
            {['👍','❤️','🎉','👏'].map(emoji => (
              <button key={emoji} style={{
                width: 40, height: 40, borderRadius: 10, border: '1px solid var(--line)',
                background: '#fff', cursor:'pointer', fontSize: 18,
              }}>{emoji}</button>
            ))}
          </div>
          <div style={{ flex: 1, fontSize: 11, color: 'var(--ink-3)' }}>32 reações • 4 comentários</div>
        </div>

        {/* Related */}
        {related.length > 0 && (
          <div style={{ marginTop: 28 }}>
            <div style={{ fontFamily:'var(--font-serif)', fontSize: 20, color:'var(--ink)', marginBottom: 12 }}>Leia também</div>
            <div style={{ display:'flex', flexDirection:'column', gap: 10 }}>
              {related.map(n => (
                <NCard key={n.id} interactive onClick={()=>nav.go('news-detail',{id: n.id})} style={{ padding: 12, display:'flex', gap: 12 }}>
                  <NPhoto src={n.img} alt={n.title} style={{ width: 72, height: 72, borderRadius: 10, flexShrink: 0 }}/>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <NBadge tone={n.tag==='eventos'?'green':n.tag==='avisos'?'amber':'brand'}>{n.cat}</NBadge>
                    <div style={{ fontSize: 13, fontWeight: 700, color:'var(--ink)', marginTop: 4, lineHeight: 1.3,
                      display:'-webkit-box', WebkitLineClamp:2, WebkitBoxOrient:'vertical', overflow:'hidden',
                    }}>{n.title}</div>
                  </div>
                </NCard>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

window.Screens = window.Screens || {};
window.Screens.NewsList = NewsListScreen;
window.Screens.NewsDetail = NewsDetailScreen;
