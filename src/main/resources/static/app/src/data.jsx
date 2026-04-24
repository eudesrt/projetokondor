// Seed data used across the app

const USER = {
  name: 'Marina',
  fullName: 'Marina Oliveira',
  unit: 'Torre 1 • Apto 1208',
  initials: 'MO',
  qrId: 'BX-2487-1208',
};

const URGENT = {
  id: 'u1',
  title: 'Manutenção da caixa d\'água — terça, 09h',
  excerpt: 'Abastecimento será interrompido das 09h às 13h. Recomenda-se reserva prévia.',
  when: 'Terça, 28 abr • 09:00',
};

const NEWS = [
  {
    id: 'n0', cat: 'Melhoria', tag: 'melhorias',
    title: 'Rooftop ganha nova iluminação LED e paisagismo',
    excerpt: 'O terraço panorâmico foi totalmente revitalizado com luminárias LED inteligentes, novo piso técnico e plantas ornamentais tropicais.',
    img: 'assets/rooftop-day.jpg',
    date: '23 abr • 2026', read: '3 min', author: 'Síndico Roberto',
    body: [
      'O rooftop do nosso condomínio acabou de passar por uma grande revitalização. Durante três semanas, a equipe técnica trabalhou na substituição completa da iluminação, agora com luminárias LED inteligentes que se ajustam automaticamente ao horário do dia.',
      'Além disso, o paisagismo foi renovado com palmeiras tropicais, vegetação baixa e vasos de cerâmica nacional. O mobiliário de madeira teak recebeu tratamento impermeável para durar mais tempo.',
      'O espaço continua disponível para reservas pelo app. A próxima disponibilidade para churrasco é sábado (27 abr) a partir das 18h.',
    ],
  },
  {
    id: 'n1', cat: 'Evento', tag: 'eventos',
    title: 'Festa Junina do Vila Mascote — inscrições abertas',
    excerpt: 'Venha celebrar com quadrilha, comidas típicas e brincadeiras no salão de festas. Garanta sua vaga até sexta.',
    img: 'assets/rooftop-lounge.jpg',
    date: '22 abr • 2026', read: '3 min',
    body: [
      'Neste ano a Festa Junina do condomínio vai acontecer no dia 21 de junho, das 16h às 22h, no salão de festas e terraço panorâmico.',
      'Teremos quadrilha com animador profissional, quitutes típicos, barraca de pescaria para a criançada e concurso de traje junino premiado.',
      'As inscrições são gratuitas para moradores e vão até sexta-feira pelo próprio app. Convidados pagam R$ 25 (crianças até 8 anos não pagam).',
      'Contamos com a participação de todos para fazer uma festa inesquecível — como nos anos anteriores!',
    ],
  },
  {
    id: 'n2', cat: 'Aviso', tag: 'avisos',
    title: 'Nova empresa de portaria começa em 1º de maio',
    excerpt: 'Após processo de seleção, a Proteq Serviços assume a portaria com equipe treinada e novo protocolo.',
    img: 'assets/entrance.jpg',
    date: '20 abr • 2026', read: '2 min',
    body: [
      'A partir de 1º de maio, a empresa Proteq Serviços assume a operação da portaria 24h.',
      'Todos os moradores precisam atualizar o cadastro facial na portaria até 30 de abril.',
      'A nova equipe foi treinada pelo síndico e passou por avaliação de referências.',
    ],
  },
  {
    id: 'n3', cat: 'Melhoria', tag: 'melhorias',
    title: 'Academia ganha 4 novos equipamentos',
    excerpt: 'Novas esteiras profissionais e estação multifuncional disponíveis a partir desta semana.',
    img: 'assets/gym.jpg',
    date: '18 abr • 2026', read: '1 min',
    body: [
      'A academia do condomínio foi reforçada com 2 novas esteiras profissionais, 1 estação multifuncional e 1 bicicleta ergométrica.',
      'Os equipamentos antigos foram doados para instituição parceira na Vila Mascote.',
    ],
  },
  {
    id: 'n4', cat: 'Evento', tag: 'eventos',
    title: 'Torneio de FIFA 25 no salão de jogos',
    excerpt: 'Sábado, 15h. Premiação para os 3 primeiros colocados. Inscrições limitadas a 16 participantes.',
    img: 'assets/games-teen.jpg',
    date: '16 abr • 2026', read: '2 min',
    body: [ 'Chaveamento eliminatório, melhor de 3 partidas nas semifinais e final. Inscrições pelo app.' ],
  },
  {
    id: 'n5', cat: 'Aviso', tag: 'avisos',
    title: 'Coleta seletiva ganha novos pontos',
    excerpt: 'Coletores instalados em todos os andares pares para facilitar o descarte.',
    img: 'assets/laundry.jpg',
    date: '12 abr • 2026', read: '1 min',
    body: ['A coleta passa pelos andares pares toda quarta e sábado.' ],
  },
];

const TICKER_ITEMS = [
  { id: 'tk1', kind: 'urgent',     label: 'Urgente',    text: 'Manutenção da caixa d\'água terça (28/abr), das 09h às 13h — reserve água antes.' },
  { id: 'tk2', kind: 'prevention', label: 'Prevenção',  text: 'Mantenha a porta do hall sempre fechada. Não libere acesso a desconhecidos pelo interfone.' },
  { id: 'tk3', kind: 'event',      label: 'Evento',     text: 'Festa Junina 21/jun — inscrições abertas até sexta pelo próprio app.' },
  { id: 'tk4', kind: 'prevention', label: 'Prevenção',  text: 'Dengue: descarte corretamente água parada em vasos, pratos e garrafas na sua varanda.' },
  { id: 'tk5', kind: 'info',       label: 'Aviso',      text: 'Nova empresa de portaria assume em 1º de maio — atualize seu cadastro facial até 30/abr.' },
  { id: 'tk6', kind: 'prevention', label: 'Prevenção',  text: 'Elevador parou entre andares? Acione o botão de alarme, não tente abrir a porta manualmente.' },
  { id: 'tk7', kind: 'info',       label: 'Informe',    text: 'Academia com 4 novos equipamentos disponíveis a partir desta semana.' },
  { id: 'tk8', kind: 'prevention', label: 'Prevenção',  text: 'Descarte de óleo de cozinha no ponto azul da garagem G1 — evita entupimento da rede.' },
];

const CATEGORIES = [
  { id: 'todos', label: 'Todos' },
  { id: 'eventos', label: 'Eventos' },
  { id: 'avisos', label: 'Avisos' },
  { id: 'melhorias', label: 'Melhorias' },
];

const ACCESS_LOG = [
  { id: 'a1', who: 'Carlos Mendes', role: 'Visitante', unit: 'Convidado seu', time: 'hoje • 14:32', io: 'in', kind: 'visitor' },
  { id: 'a2', who: 'iFood — Pedro',  role: 'Entregador', unit: 'Apto 1208', time: 'hoje • 12:10', io: 'in', kind: 'delivery' },
  { id: 'a3', who: 'Marina Oliveira', role: 'Moradora', unit: 'Apto 1208', time: 'hoje • 09:05', io: 'out', kind: 'resident' },
  { id: 'a4', who: 'Correios', role: 'Encomenda', unit: 'Apto 1208', time: 'ontem • 16:44', io: 'in', kind: 'delivery' },
  { id: 'a5', who: 'Beatriz Lima', role: 'Faxina', unit: 'Prestadora', time: 'ontem • 08:00', io: 'in', kind: 'service' },
];

const TICKETS = [
  {
    id: 't1', code: '#2487', title: 'Lâmpada queimada na garagem G2',
    status: 'andamento', category: 'Manutenção',
    created: '21 abr', lastUpdate: 'hoje',
    timeline: [
      { t: 'hoje • 10:14', who: 'Zelador', text: 'Técnico agendado para amanhã pela manhã.' },
      { t: '21 abr • 19:22', who: 'Síndico', text: 'Chamado encaminhado para manutenção.' },
      { t: '21 abr • 18:55', who: 'Você', text: 'Lâmpada da vaga 42 queimada há 3 dias.' },
    ],
  },
  {
    id: 't2', code: '#2455', title: 'Infiltração no teto da sala',
    status: 'aberto', category: 'Manutenção',
    created: '19 abr', lastUpdate: '19 abr',
    timeline: [
      { t: '19 abr • 11:03', who: 'Você', text: 'Infiltração aumentou após a chuva.' },
    ],
  },
  {
    id: 't3', code: '#2399', title: 'Barulho excessivo — vizinho 1305',
    status: 'finalizado', category: 'Reclamação',
    created: '8 abr', lastUpdate: '12 abr',
    timeline: [
      { t: '12 abr • 15:00', who: 'Síndico', text: 'Conversa realizada. Caso encerrado.' },
    ],
  },
];

const CONTACTS = [
  { id: 'c1', name: 'Roberto Almeida', role: 'Síndico',    phone: '+55 11 9xxxx-1234', whats: true, avatar: 'RA', color: '#0a84c8' },
  { id: 'c2', name: 'Jorge Silva',     role: 'Zelador',    phone: '+55 11 9xxxx-5678', whats: true, avatar: 'JS', color: '#8dc63f' },
  { id: 'c3', name: 'Portaria 24h',    role: 'Portaria',   phone: '+55 11 3xxx-0000',  whats: false, avatar: 'PO', color: '#6b7a87' },
  { id: 'c4', name: 'Administradora',  role: 'Financeiro', phone: '+55 11 3xxx-4242',  whats: true, avatar: 'AD', color: '#5a6d7f' },
  { id: 'c5', name: 'Emergência — Bombeiros', role: 'Emergência', phone: '193', whats: false, avatar: '!', color: '#e45454' },
];

const AMENITIES = [
  { id: 'am1', name: 'Piscina',           img: 'assets/pool.jpg',          max: 'Livre',       slot: '06h–22h' },
  { id: 'am2', name: 'Salão de festas',   img: 'assets/bistro.jpg',        max: '40 pessoas',  slot: 'Por período' },
  { id: 'am3', name: 'Churrasqueira Rooftop', img: 'assets/rooftop-day.jpg', max: '20 pessoas', slot: 'Por período' },
  { id: 'am4', name: 'Quadra Futebol',    img: 'assets/soccer.jpg',        max: '10 pessoas',  slot: '1h' },
  { id: 'am5', name: 'Salão de jogos',    img: 'assets/games-adult.jpg',   max: '12 pessoas',  slot: '2h' },
  { id: 'am6', name: 'Playground',        img: 'assets/playground.jpg',    max: 'Livre',       slot: '08h–20h' },
];

const PACKAGES = [
  { id: 'p1', carrier: 'Mercado Livre', code: 'ME4821...', arrived: 'hoje • 11:30', status: 'waiting' },
  { id: 'p2', carrier: 'Amazon',         code: 'AMZ...984', arrived: 'ontem', status: 'waiting' },
  { id: 'p3', carrier: 'Correios',       code: 'BR8721...', arrived: '20 abr', status: 'picked' },
];

const POLL = {
  id: 'poll1',
  title: 'Reforma do playground',
  desc: 'Proposta de renovação completa do playground infantil com novos brinquedos. Custo estimado: R$ 48.000 (rateio em 3x).',
  ends: 'Encerra em 4 dias',
  options: [
    { id: 'o1', label: 'Aprovar a reforma completa', votes: 87 },
    { id: 'o2', label: 'Aprovar apenas reparos essenciais', votes: 34 },
    { id: 'o3', label: 'Adiar para 2027', votes: 12 },
  ],
  total: 133,
};

const CLASSIFIEDS = [
  { id: 'cl1', title: 'Bicicleta aro 29 — seminova', price: 'R$ 850', user: 'Apto 804', img: null, category: 'Esporte', when: '2 dias' },
  { id: 'cl2', title: 'Sofá 3 lugares cinza',       price: 'R$ 1.200', user: 'Apto 502', img: null, category: 'Móveis', when: '5 dias' },
  { id: 'cl3', title: 'Aulas de violão (morador)',  price: 'R$ 80/h',  user: 'Apto 1403', img: null, category: 'Serviços', when: '1 sem' },
  { id: 'cl4', title: 'Carrinho de bebê',            price: 'R$ 400', user: 'Apto 302', img: null, category: 'Infantil', when: '1 sem' },
];

window.AppData = { USER, URGENT, NEWS, CATEGORIES, TICKER_ITEMS, ACCESS_LOG, TICKETS, CONTACTS, AMENITIES, PACKAGES, POLL, CLASSIFIEDS };
