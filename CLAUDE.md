# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

🎨 **IMPORTANTE**: Novo design system Thymeleaf implementado! Veja `DESIGN_IMPLEMENTATION.md` para detalhes completos sobre as telas, responsividade mobile/desktop e fragmentos reutilizáveis.

## Overview

**Kondor System Condomínio** is a Java Spring Boot application for condominium residential management. It provides administrative and resident-facing features for managing news, support tickets, resident information, and help contacts.

- **Framework**: Spring Boot 2.1.4 with Spring MVC, Security, and Data JPA
- **Language**: Java 8
- **Database**: PostgreSQL (production), H2 (development, in-memory)
- **Build Tool**: Maven
- **Template Engine**: Thymeleaf
- **Database Migrations**: Flyway

## Common Development Commands

### Running the Application
```bash
mvn spring-boot:run
```
Starts the development server (uses H2 in-memory database by default).

### Building
```bash
mvn clean install
mvn clean compile
```

### Testing
```bash
mvn test
mvn test -Dtest=ClassName
mvn test -Dtest=ClassName#methodName
```

### Cleaning
```bash
mvn clean
```

## Project Structure

### Core Packages

**`config/`** - Application configuration
- `SecurityConfig` - Spring Security configuration (authentication, authorization)
- `WebConfig` - Web application settings
- `CustomAuthenticationFailureHandler` - Custom login failure handling

**`controller/`** - Web layer (MVC controllers)
- `AdminNewsController`, `AdminTicketController`, `AdminResidentController`, `AdminContactController` - Admin features
- `ResidentTicketController`, `NewsController` - Resident-facing features
- `RegistrationController` - User registration
- `HomeController` - Home page
- `GlobalUiControllerAdvice` - Global controller advice for shared UI data

**`model/`** - JPA entities
- Core entities: `User`, `Resident`, `Role`
- Feature entities: `News`, `NewsImage`, `Ticket`, `TicketAttachment`, `Comment`, `HelpContact`

**`repository/`** - Data access layer (Spring Data JPA repositories)
- One repository per entity for database operations

**`service/`** - Business logic layer
- Service classes containing business rules and complex operations
- Called by controllers, use repositories

**`util/`** - Utility classes and helper functions

### Resources

**`application.properties`** - Spring Boot configuration
- Database connection (PostgreSQL)
- JPA/Hibernate settings
- Flyway migration settings
- Thymeleaf configuration
- Email (SMTP) configuration
- File upload limits (20MB per file, 100MB per request)

**`db/migration/`** - Flyway SQL migrations
- `V1__Create_Initial_Schema.sql` - Initial database schema
- New migrations should follow naming: `V<number>__<description>.sql`

**`templates/`** - Thymeleaf HTML templates
- Organized by feature (admin, resident pages)
- Uses layout dialect for shared layouts

**`static/`** - Static resources (CSS, JS, images)
- Also supports file uploads via `spring.resources.static-locations=classpath:/static/,file:uploads/`
- `app/` - Aplicação React mobile (Vila Mascote)
  - `index.html` - Página principal
  - `ios-frame.jsx` - Simulador de frame iOS
  - `tweaks-panel.jsx` - Painel de ajustes de design
  - `src/` - Componentes e telas React
  - `assets/` - Imagens do condomínio
  - Acesso: `http://localhost:8080/app/`

## Architecture Patterns

### MVC Layer Structure
1. **Controller** receives HTTP requests, validates input, calls services
2. **Service** implements business logic, handles domain rules, calls repositories
3. **Repository** provides data access (JPA)
4. **Model (Entity)** represents database tables

### Authentication & Authorization
- Spring Security manages user roles and permissions
- Two main roles: `ADMIN` and `RESIDENT` (defined in Role entity)
- Custom failure handler provides feedback on failed logins

### Key Features

**News System**
- Admins create/edit news with images
- Residents view news with comments

**Ticket/Support System**
- Residents create support tickets with attachments
- Admins manage tickets and provide responses

**User Management**
- Registration for new residents
- Admin controls resident accounts

**File Upload**
- Handles attachments and news images
- Uploads stored in `uploads/` directory
- Max file size: 20MB, max request size: 100MB

## Database Configuration

### Development
- H2 in-memory database (no external setup needed)
- Set in `application.properties`

### Production
- PostgreSQL connection (see `application.properties`)
- Flyway runs migrations automatically on startup
- Set `spring.flyway.baseline-on-migrate=true` for first-time setup

## Frontend Application - Viva Benx Mascote (Thymeleaf)

Design system HTML + CSS + Thymeleaf para gerenciamento de condomínio, totalmente integrado com Spring Boot.

### Tecnologias
- Thymeleaf (template engine)
- CSS com variáveis customizadas (design system)
- Responsive mobile-first

### Estrutura de Templates

**Templates principais** (`src/main/resources/templates/`)
- `index.html` - Home/dashboard
- `login.html` - Formulário de login
- `cadastro.html` - Registro de novos residentes
- `noticias/lista.html` - Lista de notícias
- `noticias/detalhe.html` - Detalhe de notícia
- `chamados/lista.html` - Lista de chamados
- `chamados/novo.html` - Formulário novo chamado
- `chamados/detalhe.html` - Detalhe do chamado
- `admin/dashboard.html` - Painel do síndico

**Fragments reutilizáveis** (`src/main/resources/templates/fragments/layout.html`)
- `head(title)` - Head com CSS do design system
- `tabbar(active)` - Navegação fixa inferior (mobile)
- `logo(size)` - Logo SVG
- `urgent(urgent)` - Banner de comunicado urgente
- `ticker(items)` - Ticker de notícias ao vivo
- `badge` - Badge com contador

### Design System
**CSS** (`src/main/resources/static/css/`)
- `tokens.css` - Variáveis: cores, fonts, espaçamentos
- `components.css` - Componentes: cards, botões, ticker, tabbar, badges
- `desktop.css` - Painel do síndico (desktop)

**Cores principais**
- Brand: `#0a84c8` (azul Viva Benx)
- Accent: `#8dc63f` (verde-limão)
- Danger: `#e45454`
- Success: `#22a06b`

**Fonts**
- UI: Plus Jakarta Sans
- Títulos: Instrument Serif
- Código: JetBrains Mono

### Controllers Disponíveis
- `HomePageController` - Rotas de página (home, news, tickets, login, signup, admin)

### Como Integrar com a API

Os templates esperam os seguintes dados no Model:
- **Home**: `user`, `tickerItems`, `urgent`, `newsPreview`, `contacts`
- **Notícias**: `categories`, `activeCat`, `hero`, `others`
- **Chamados**: `counts`, `filter`, `filters`, `tickets`
- **Admin**: `admin`, `stats`, `featuredHero`, `featuredSecondary`, `recentTickets`, `urgent`, `activity`

### Assets
16 imagens em `src/main/resources/static/assets/`: piscina, playground, academia, bilhar, etc.

## Important Notes

- **JPA DDL**: Set to `ddl-auto=none` - database schema is managed by Flyway migrations only, never auto-generated
- **SQL Logging**: `spring.jpa.show-sql=true` enables SQL query logging (useful for debugging)
- **Thymeleaf Caching**: Disabled in development (`spring.thymeleaf.cache=false`)
- **Mail Integration**: Uses Gmail SMTP - configuration in `application.properties`
- **Dependency Injection**: Uses Spring annotations (`@Service`, `@Repository`, `@Controller`, `@Autowired`)
- **React App**: JSX files are transpiled by Babel in the browser - no build step needed. Modify JSX files directly and refresh the page
