# 🔔 Notificacao Front

> **Sistema de notificações em tempo real** com **Angular**, **WebSockets** e **Kafka**  
> ![Angular](https://img.shields.io/badge/Angular-DD0031?style=flat&logo=angular&logoColor=white)
> ![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=flat&logo=typescript&logoColor=white)
> ![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=flat&logo=tailwind-css&logoColor=white)

## 📖 Resumo
Este projeto é um **sistema de notificações em tempo real**, desenvolvido com **Angular** no front-end.  
Permite gerenciar usuários e receber notificações instantâneas utilizando **WebSockets (STOMP)** no backend.  
Possui interface moderna, utiliza **TailwindCSS** para estilização e **Angular Material** para componentes visuais.

## ⚡ Funcionalidades Principais
- ➕ Cadastro, edição e exclusão de usuários
- 📋 Listagem de usuários em tabela com paginação e busca
- 🔔 **Notificações em tempo real** via WebSocket
- 📱 Interface **responsiva** e moderna
- 🍞 Toasts para feedback ao usuário
- ⚠️ Diálogos de confirmação para ações críticas

## 🛠️ Principais Dependências
| Ícone | Pacote | Versão |
|-------|--------|--------|
| <img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/angularjs/angularjs-original.svg" width="20"/> | **Angular** | 20+ |
| <img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/rxjs/rxjs-original.svg" width="20"/> | **RxJS** | ^7.x |
| <img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/socketio/socketio-original.svg" width="20"/> | **@stomp/stompjs** | ^7.x |
| <img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/tailwindcss/tailwindcss-plain.svg" width="20"/> | **TailwindCSS** | ^3.x |
| <img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/materialui/materialui-original.svg" width="20"/> | **Angular Material** | ^20.x |

## 🚀 Como Rodar o Projeto

```bash
# 1. Clone o repositório
git clone https://github.com/seu-usuario/notificacao-front.git
cd notificacao-front

# 2. Instale as dependências
npm install

# 3. Inicie o servidor de desenvolvimento
npm start
