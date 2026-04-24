// Contacts screen
const { Card: CCard, Avatar: CAvatar, ScreenHeader: CHead } = window.UI;

function ContactsScreen({ nav, data }) {
  const [q, setQ] = React.useState('');
  const filtered = data.CONTACTS.filter(c =>
    c.name.toLowerCase().includes(q.toLowerCase()) ||
    c.role.toLowerCase().includes(q.toLowerCase())
  );

  return (
    <div className="fade-in" style={{ paddingBottom: 120 }}>
      <CHead title="Agenda" subtitle="Contatos do condomínio" onBack={()=>nav.back()}/>

      <div style={{ padding: '0 16px 16px' }}>
        <div style={{
          display:'flex', alignItems:'center', gap: 10,
          background: '#fff', border: '1px solid var(--line)', borderRadius: 14,
          padding: '0 14px', height: 46,
        }}>
          <Ic.search width={18} height={18} style={{color:'var(--ink-3)'}}/>
          <input value={q} onChange={e=>setQ(e.target.value)} placeholder="Buscar por nome ou cargo..."
            style={{ flex:1, border:'none', outline:'none', background:'transparent', fontFamily:'inherit', fontSize: 14, color:'var(--ink)' }}/>
        </div>
      </div>

      <div style={{ padding: '0 16px', display:'flex', flexDirection:'column', gap: 10 }}>
        {filtered.map(c => (
          <CCard key={c.id} style={{ padding: 14, display:'flex', alignItems:'center', gap: 12 }}>
            <CAvatar initials={c.avatar} color={c.color} size={48}/>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--ink)' }}>{c.name}</div>
              <div style={{ fontSize: 12, color: 'var(--ink-3)', marginTop: 2 }}>{c.role}</div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--ink-2)', marginTop: 4 }}>{c.phone}</div>
            </div>
            <div style={{ display:'flex', gap: 8 }}>
              <button title="Ligar" style={{
                width: 40, height: 40, borderRadius: 12, border: '1px solid var(--line)',
                background: '#fff', cursor: 'pointer', display:'grid', placeItems:'center', color: 'var(--brand)',
              }}>
                <Ic.phone width={18} height={18}/>
              </button>
              {c.whats && (
                <button title="WhatsApp" style={{
                  width: 40, height: 40, borderRadius: 12, border:'none',
                  background: '#25D366', cursor: 'pointer', display:'grid', placeItems:'center', color: '#fff',
                }}>
                  <Ic.whatsapp width={20} height={20}/>
                </button>
              )}
            </div>
          </CCard>
        ))}
      </div>
    </div>
  );
}

window.Screens = window.Screens || {};
window.Screens.Contacts = ContactsScreen;
