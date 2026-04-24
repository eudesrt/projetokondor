# 🔐 Credenciais de Teste - Viva Benx Mascote

## Contas de Teste Disponíveis

### 👨‍💼 Admin / Síndico
```
Usuário: admin
Senha:   admin123
```
**Acesso**: Dashboard administrativo, todas as funcionalidades
**URL**: http://localhost:3000/admin

### 👤 Moradores (em desenvolvimento)
Os usuários marina e joao serão adicionados em futuras migrações com credenciais criptografadas.
Atualmente apenas admin está disponível para teste.

---

## 🚀 Como Testar

### Passo 1: Iniciar a Aplicação
```bash
cd C:\App\workspace_antigravity\projetokondor
mvn clean compile
mvn spring-boot:run
```

### Passo 2: Acessar o Login
```
http://localhost:8080/login
```

### Passo 3: Fazer Login
1. Digite o **Usuário** (ex: `admin`)
2. Digite a **Senha** (ex: `admin`)
3. Clique em **Entrar**

---

## 📱 Telas Disponíveis

### Residente (Marina ou João)
- ✅ **Home** - Dashboard com notícias, chamados rápidos, contatos
- ✅ **Notícias** - Lista de notícias com filtros
- ✅ **Chamados** - Lista de chamados com filtros
- ✅ **Novo Chamado** - Abrir novo chamado
- ✅ **Perfil** - Dados do morador

### Admin (admin)
- ✅ **Dashboard** - Painel síndico com estatísticas
- ✅ **Publicações** - Gerenciar notícias
- ✅ **Moradores** - Listar e editar moradores
- ✅ **Chamados** - Gerenciar chamados
- ✅ **Contatos** - Gerenciar contatos úteis

---

## 🎨 Teste Responsividade

### Mobile (< 900px)
1. Abra DevTools: `F12`
2. Ative modo responsivo: `Ctrl + Shift + M`
3. Veja o layout vertical com tab bar inferior

### Desktop (≥ 900px)
1. Abra DevTools: `F12`
2. Desative modo responsivo ou redimensione
3. Veja o layout horizontal com sidebar (admin)

---

## 📝 Dados de Teste Carregados

### Notícias
- "Manutenção programada" (destaque)
- "Portaria 24h"

### Contatos
- Portaria (WhatsApp habilitado)
- Síndico
- Zelador
- Emergência Médica
- Recepção
- Manutenção

### Usuários
- 1 Admin
- 2 Residentes
- Todos com roles configuradas

---

## ⚠️ Nota Importante

As credenciais estão com **senhas em texto plano** apenas para **desenvolvimento/testes**.

**Em Produção**:
- Use bcrypt ou outro encoder seguro
- Configure senhas fortes
- Remova usuários de teste
- Ative CSRF tokens (veja SecurityConfig)

---

## 🔧 Se o Login Não Funcionar

1. **Verifique o console** do IntelliJ/Eclipse para erros
2. **Limpe o banco**: Delete o arquivo `h2.db` (H2 in-memory)
3. **Reinicie a aplicação**: `mvn spring-boot:run`
4. A migration V2 carregará automaticamente os dados de teste

---

## ✅ Tudo Pronto!

Agora você pode testar toda a aplicação com as credenciais acima! 🎉
