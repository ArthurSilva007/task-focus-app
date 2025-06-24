# Tasks_focus

# 📝 Tasks Focus - Gerenciador de Tarefas com Prioridades e Notificações

> Um sistema de gestão de tarefas desenvolvido em Java com Spring Boot, com foco em produtividade, organização e notificações inteligentes.

---

## 🚀 Funcionalidades

- ✅ Cadastro, edição e exclusão de tarefas
- 🎯 Definição de prioridade (Alta, Média, Baixa)
- 📆 Acompanhamento de status (Pendente, Em andamento, Concluída)
- 🔔 Notificações automáticas para tarefas vencidas ou próximas do vencimento
- 🔐 Autenticação com Spring Security e JWT
- 📬 Notificações por e-mail (em breve)

---

## 💻 Tecnologias Utilizadas

- Java 17+
- Spring Boot 3.4.4
- Spring Data JPA
- Spring Security (JWT)
- MySQL (ou PostgreSQL)
- Maven
- Thymeleaf (se houver interface)
- Agendamentos com `@Scheduled`

---

## ⚙️ Como Rodar o Projeto Localmente

### Pré-requisitos:

- Java 17
- MySQL ou PostgreSQL rodando
- IDE como IntelliJ ou VS Code

Configure o arquivo application.properties com suas credenciais:

  spring.datasource.url=jdbc:mysql://localhost:3306/tasks_db
spring.datasource.username=seu_usuario
spring.datasource.password=sua_senha
spring.jpa.hibernate.ddl-auto=update

Agora é só rodar a aplicação:

# Rode a classe principal
TasksFocusApplication.java


### Passos:

```bash
# Clone o repositório
git clone https://github.com/ArthurSilva007/Tasks_focus.git
cd Tasks_focus

src/
├── main/
│   ├── java/
│   │   └── com.example.tasksfocus/
│   │       ├── controller/
│   │       ├── model/
│   │       ├── repository/
│   │       ├── service/
│   │       └── config/
│   └── resources/
│       ├── application.properties
│       └── templates/ (se usar Thymeleaf)
