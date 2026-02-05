# 🏢 Kondor System Condomínio

Sistema de gestão de condomínio residencial desenvolvido em **Spring Boot**, com foco em organização administrativa, segurança e comunicação entre moradores e administração.

---

## 🚀 Tecnologias Utilizadas

- **Java 8**
- **Spring Boot 2.1.4.RELEASE**
- Spring MVC
- Spring Security
- Spring Data JPA
- Thymeleaf
- Thymeleaf Layout Dialect
- PostgreSQL
- H2 Database (ambiente de desenvolvimento)
- Flyway (versionamento de banco)
- Maven
- Lombok
- Gson

---

## 📦 Estrutura do Projeto

- `controller` → Camada web (controllers MVC)
- `service` → Regras de negócio
- `repository` → Acesso a dados (JPA)
- `entity` → Entidades do sistema
- `config` → Configurações (Security, Mail, etc.)
- `resources/templates` → Templates Thymeleaf
- `resources/static` → CSS, JS, imagens

---

## 🗄️ Banco de Dados

### Produção
- **PostgreSQL**

### Desenvolvimento
- **H2 Database (em memória)**

O versionamento do banco é feito com **Flyway**, garantindo controle das migrations.

---

## ▶️ Como Executar o Projeto

### Pré-requisitos
- Java 8+
- Maven 3+
- PostgreSQL (opcional, dependendo do ambiente)

### Rodar localmente
```bash
mvn spring-boot:run
