# Vila Mascote — App do Condomínio

Aplicação React mobile para gerenciamento de condomínio residencial.

## Estrutura

- **index.html** - Página principal que carrega a aplicação React
- **ios-frame.jsx** - Simulador de frame iOS (visual do telefone)
- **tweaks-panel.jsx** - Painel de controle para ajustes de design
- **src/** - Módulos da aplicação
  - `app.jsx` - Aplicação principal e gerenciamento de estado
  - `data.jsx` - Dados e estrutura do condomínio
  - `icons.jsx` - Ícones SVG reutilizáveis
  - `ui.jsx` - Componentes UI comuns
  - `desktop.jsx` - Layout e responsividade desktop
  - `screens-*.jsx` - Telas específicas:
    - `screens-home.jsx` - Tela inicial
    - `screens-news.jsx` - Notícias e comunicados
    - `screens-access.jsx` - Controle de acesso (QR code, cartões)
    - `screens-tickets.jsx` - Chamados e suporte
    - `screens-contacts.jsx` - Contatos úteis
    - `screens-extras.jsx` - Facilidades e extras
- **assets/** - Imagens do condomínio (bilhar, entrada, fachada, etc.)

## Como Acessar

Acesse em: `http://localhost:8080/app/`

## Tecnologias

- React 18.3.1 (CDN)
- React DOM 18.3.1 (CDN)
- Babel Standalone 7.29.0 (transpilação JSX no navegador)
- Fontes Google: Plus Jakarta Sans, Instrument Serif, Inter, JetBrains Mono

## Design System

Variáveis CSS definidas em `index.html`:
- **Cores**: --brand (azul), --accent (verde), --danger (vermelho)
- **Espaçamento e tipografia**: variáveis de cores e fontes customizadas
- **Animações**: softPulse, fadeIn, slideUp, tickerScroll

## Notas

- Todos os JSX são carregados via `<script type="text/babel">` no navegador
- As imagens estão em `assets/` e são referenciadas como URLs relativas
- O painel de tweaks permite ajustar cores e propriedades em tempo real
