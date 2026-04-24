// Main App — navigation, tab bar, tweaks, desktop layout

const { useTweaks, TweaksPanel, TweakSection, TweakRadio, TweakToggle } = window;
const { USER, URGENT, NEWS, CATEGORIES, ACCESS_LOG, TICKETS, CONTACTS, AMENITIES, PACKAGES, POLL, CLASSIFIEDS } = window.AppData;
const AppData = window.AppData;

const THEMES = {
  ocean: { brand: '#0a84c8', brand600: '#076fa8', brand50: '#e8f4fc', accent: '#8dc63f', accent600:'#6ea82d', name: 'Oceano Vila Mascote' },
  midnight: { brand: '#1a3a5c', brand600: '#0f2947', brand50: '#e8ecf2', accent: '#d4a24c', accent600:'#a67d2f', name: 'Premium Midnight' },
  coral:    { brand: '#e05f4a', brand600: '#b8462f', brand50: '#fdecea', accent: '#2aa39a', accent600:'#1f7a73', name: 'Coral & Teal' },
};

const FONTS = {
  classic:   { ui: "'Plus Jakarta Sans', 'Inter', system-ui, sans-serif", serif: "'Instrument Serif', Georgia, serif", name: 'Plus Jakarta + Instrument Serif' },
  editorial: { ui: "'Inter', system-ui, sans-serif", serif: "'Instrument Serif', Georgia, serif", name: 'Inter + Instrument (editorial)' },
  modern:    { ui: "'Plus Jakarta Sans', system-ui, sans-serif", serif: "'Plus Jakarta Sans', system-ui, sans-serif", name: 'Plus Jakarta (geométrico)' },
};

function TabBar({ nav, tab }) {
  const items = [
    { id: 'home', label: 'Início', icon: Ic.home, route: 'home' },
    { id: 'news', label: 'Notícias', icon: Ic.news, route: 'news' },
    { id: 'qr',   label: 'Acesso',   icon: Ic.qr,   route: 'access', raised: true },
    { id: 'tickets', label: 'Chamados', icon: Ic.wrench, route: 'tickets' },
    { id: 'profile', label: 'Perfil', icon: Ic.user, route: 'profile' },
  ];
  return (
    <div style={{
      position:'absolute', bottom: 0, left: 0, right: 0, zIndex: 100,
      paddingBottom: 24, paddingTop: 8,
      background: 'linear-gradient(180deg, rgba(244,247,250,0) 0%, rgba(244,247,250,.95) 50%)',
    }}>
      <div style={{
        margin: '0 14px', background: '#fff',
        borderRadius: 24, border: '1px solid var(--line)',
        boxShadow: '0 14px 30px -12px rgba(10,30,45,.15)',
        display: 'flex', alignItems: 'center', padding: 8, height: 68,
      }}>
        {items.map(it => {
          const active = tab === it.id;
          if (it.raised) {
            return (
              <button key={it.id} onClick={()=>nav.go(it.route)} style={{
                width: 56, height: 56, borderRadius: 16, margin: '0 8px',
                background: 'var(--brand)', border: 'none', cursor:'pointer',
                color:'#fff', display:'grid', placeItems:'center',
                boxShadow:'0 8px 20px -4px rgba(10,132,200,.5)',
                transform: 'translateY(-10px)',
              }}>
                <it.icon width={24} height={24}/>
              </button>
            );
          }
          return (
            <button key={it.id} onClick={()=>nav.go(it.route)} style={{
              flex: 1, height: 52, border: 'none', background: 'transparent',
              display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', gap: 2,
              cursor:'pointer', color: active ? 'var(--brand)' : 'var(--ink-3)',
            }}>
              <it.icon width={20} height={20}/>
              <span style={{ fontSize: 10, fontWeight: 700 }}>{it.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

function PhoneApp({ variant }) {
  const [route, setRoute] = React.useState({ name: 'home', params: {} });
  const [history, setHistory] = React.useState([]);
  const [state, setState] = React.useState({
    tickets: AppData.TICKETS,
    packages: AppData.PACKAGES,
    reservations: [],
  });

  const nav = {
    go: (name, params={}) => { setHistory(h => [...h, route]); setRoute({ name, params }); },
    back: () => {
      setHistory(h => {
        if (h.length === 0) { setRoute({name:'home', params:{}}); return h; }
        const prev = h[h.length-1];
        setRoute(prev);
        return h.slice(0, -1);
      });
    },
  };

  const tabFromRoute = (r) => ({
    home: 'home', news: 'news', 'news-detail': 'news',
    access: 'qr', tickets: 'tickets', 'ticket-detail':'tickets',
    profile: 'profile', notifications: 'profile',
  })[r.name] || '';

  const screenMap = {
    home: Screens.Home,
    news: Screens.NewsList,
    'news-detail': Screens.NewsDetail,
    access: Screens.Access,
    tickets: Screens.Tickets,
    'ticket-detail': Screens.TicketDetail,
    contacts: Screens.Contacts,
    amenities: Screens.Amenities,
    packages: Screens.Packages,
    poll: Screens.Poll,
    classifieds: Screens.Classifieds,
    profile: Screens.Profile,
    notifications: Screens.Notifications,
  };
  const ScreenC = screenMap[route.name] || Screens.Home;

  // Apply variant theme to phone container via inline style
  const theme = THEMES[variant?.theme || 'ocean'];
  const font = FONTS[variant?.font || 'classic'];

  return (
    <div style={{
      position:'relative', width:'100%', height:'100%',
      background: 'var(--bg)',
      '--brand': theme.brand, '--brand-600': theme.brand600, '--brand-50': theme.brand50,
      '--accent': theme.accent, '--accent-600': theme.accent600,
      '--font-ui': font.ui, '--font-serif': font.serif,
      fontFamily: font.ui,
    }}>
      <div style={{ width:'100%', height:'100%', overflowY:'auto', overflowX:'hidden' }} className="phone-scroll" key={route.name+route.params.id}>
        <ScreenC nav={nav} data={AppData} params={route.params} state={state} setState={setState}/>
      </div>
      <TabBar nav={nav} tab={tabFromRoute(route)}/>
    </div>
  );
}

// ─── Layout wrapper with IOSDevice frame ──────────────────────
function PhoneFrame({ label, variant }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14 }}>
      <IOSDevice width={390} height={844}>
        <PhoneApp variant={variant}/>
      </IOSDevice>
      <div style={{
        fontFamily:'var(--font-mono)', fontSize: 11, color:'#5a6d7f',
        letterSpacing: 1.2, textTransform:'uppercase',
      }}>{label}</div>
    </div>
  );
}

function App() {
  const [tweaks, setTweak] = useTweaks(/*EDITMODE-BEGIN*/{
    "theme": "ocean",
    "font": "classic",
    "showDesktop": true,
    "showVariants": false
  }/*EDITMODE-END*/);

  const mainVariant = { theme: tweaks.theme, font: tweaks.font };

  return (
    <>
      <div style={{
        padding: '40px 32px 60px',
        minHeight: '100vh',
        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 40,
      }}>
        {/* Title */}
        <div style={{ textAlign:'center', maxWidth: 680 }}>
          <div style={{ display:'inline-flex', alignItems:'center', gap: 10, padding: '6px 14px', background:'#fff', border:'1px solid var(--line)', borderRadius: 999, fontSize: 11, fontWeight: 700, color:'var(--ink-2)', letterSpacing:.8, textTransform:'uppercase' }}>
            <span style={{ width: 6, height: 6, borderRadius: 3, background:'var(--accent)' }}/>
            App do condomínio — protótipo
          </div>
          <h1 style={{ fontFamily:'var(--font-serif)', fontSize: 48, lineHeight: 1.05, color:'var(--ink)', margin: '16px 0 10px', letterSpacing: -1 }}>
            Vila Mascote — <em style={{ color:'var(--brand)' }}>seu condomínio</em> na palma da mão
          </h1>
          <p style={{ fontSize: 15, color:'var(--ink-3)', margin: 0, lineHeight: 1.55, maxWidth: 560, marginInline:'auto' }}>
            Portal de notícias, controle de acesso por QR, chamados com timeline, agenda de contatos e muito mais. Ative os <b>Tweaks</b> para trocar paleta e tipografia.
          </p>
        </div>

        {/* Main phone */}
        <PhoneFrame label={`${THEMES[tweaks.theme].name} • ${FONTS[tweaks.font].name}`} variant={mainVariant}/>

        {/* Variants */}
        {tweaks.showVariants && (
          <div>
            <div style={{ textAlign:'center', marginBottom: 18 }}>
              <div style={{ fontFamily:'var(--font-serif)', fontSize: 26, color:'var(--ink)' }}>Variações lado a lado</div>
              <div style={{ fontSize: 12, color:'var(--ink-3)', marginTop: 4 }}>Cores + tipografia comparadas</div>
            </div>
            <div style={{ display:'flex', gap: 28, flexWrap:'wrap', justifyContent:'center' }}>
              {['ocean','midnight','coral'].map(t => (
                <PhoneFrame key={t} label={THEMES[t].name} variant={{ theme: t, font: tweaks.font }}/>
              ))}
            </div>
          </div>
        )}

        {/* Desktop admin */}
        {tweaks.showDesktop && (
          <div style={{ width: '100%', maxWidth: 1320, marginTop: 20 }}>
            <div style={{ textAlign:'center', marginBottom: 18 }}>
              <div style={{ fontFamily:'var(--font-serif)', fontSize: 26, color:'var(--ink)' }}>Painel do síndico — desktop</div>
              <div style={{ fontSize: 12, color:'var(--ink-3)', marginTop: 4 }}>Visão administrativa web</div>
            </div>
            <div style={{ display:'flex', justifyContent:'center' }}>
              <div style={{
                '--brand': THEMES[tweaks.theme].brand,
                '--brand-600': THEMES[tweaks.theme].brand600,
                '--brand-50': THEMES[tweaks.theme].brand50,
                '--accent': THEMES[tweaks.theme].accent,
                '--accent-600': THEMES[tweaks.theme].accent600,
              }}>
                <DesktopAdmin data={AppData}/>
              </div>
            </div>
          </div>
        )}
      </div>

      <TweaksPanel title="Tweaks">
        <TweakSection label="Paleta de cores">
          <TweakRadio label="Tema" value={tweaks.theme} onChange={v=>setTweak('theme',v)} options={[
            { value:'ocean', label:'Oceano' },
            { value:'midnight', label:'Midnight' },
            { value:'coral', label:'Coral' },
          ]}/>
        </TweakSection>
        <TweakSection label="Tipografia">
          <TweakRadio label="Pareamento" value={tweaks.font} onChange={v=>setTweak('font',v)} options={[
            { value:'classic', label:'Jakarta + Serif' },
            { value:'editorial', label:'Inter + Serif' },
            { value:'modern', label:'Só Jakarta' },
          ]}/>
        </TweakSection>
        <TweakSection label="Layout">
          <TweakToggle label="Variações lado a lado" value={tweaks.showVariants} onChange={v=>setTweak('showVariants',v)}/>
          <TweakToggle label="Painel desktop do síndico" value={tweaks.showDesktop} onChange={v=>setTweak('showDesktop',v)}/>
        </TweakSection>
      </TweaksPanel>
    </>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App/>);
