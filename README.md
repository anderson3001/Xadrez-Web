# ♟️ Chess Bot Full Stack

![React](https://img.shields.io/badge/React-20232a?style=for-the-badge&logo=react&logoColor=61DAFB)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![Python](https://img.shields.io/badge/Python-3776AB?style=for-the-badge&logo=python&logoColor=white)
![FastAPI](https://img.shields.io/badge/FastAPI-005571?style=for-the-badge&logo=fastapi)

Um jogo de Xadrez completo desenvolvido como uma aplicação Full Stack. O projeto integra um frontend interativo em React com um backend em Python responsável pela inteligência artificial e validação de jogadas.

🔗 **[Acesse o Projeto Online Aqui](https://xadrez-web-lac.vercel.app/)**

---

## 🚀 Funcionalidades

- **Jogabilidade vs IA:** Jogue contra um bot inteligente (engine baseada em Python).
- **Validação de Regras:** Movimentos ilegais são bloqueados automaticamente.
- **Movimentos Especiais:** Suporte completo para Roque, En Passant e Promoção de Peões (com menu de escolha).
- **Detecção de Fim de Jogo:** Reconhece Xeque-mate, Afogamento (Stalemate), Repetição e Insuficiência Material.
- **Desfazer Jogada (Undo):** Sistema sincronizado que reverte o estado tanto no cliente quanto no servidor.
- **Áudio Imersivo:** Efeitos sonoros para movimentos, capturas e fim de jogo.
- **Responsivo:** Layout adaptável para Desktop e Mobile.

---

## 🛠️ Tecnologias Utilizadas

### Frontend (Client)
- **React.js** com **Vite**: Para alta performance e desenvolvimento rápido.
- **TypeScript**: Para tipagem estática e segurança do código.
- **Chess.js**: Lógica de geração de movimentos e validação no front.
- **React-Chessboard**: Componente visual do tabuleiro.

### Backend (Server)
- **Python 3.13.1**: Linguagem base.
- **FastAPI**: Framework moderno e assíncrono para criação da API REST.
- **Python-Chess**: Biblioteca robusta para gerenciamento do estado do jogo e IA no servidor.
- **Uvicorn**: Servidor ASGI para produção.

### Infraestrutura & DevOps
- **Vercel**: Hospedagem do Frontend.
- **Render**: Hospedagem do Backend (Serverless).
- **Uptime Monitor**: Implementação de *keep-alive* para mitigar o "Cold Start" do plano gratuito do Render.

---

## ⚙️ Como rodar o projeto localmente

Siga os passos abaixo para rodar a aplicação na sua máquina.

### Pré-requisitos
- Node.js e npm instalados.
- Python 3.10+ instalado.

### 1. Clone o repositório
```bash
git clone https://github.com/anderson3001/Xadrez-Web.git
cd Xadrez-Web
```
### 2. Configurando o Backend (Python)
Abra o terminal na pasta backend:

```bash
cd backend

# Crie um ambiente virtual (Windows)
python -m venv venv
# Ative o ambiente (Windows)
venv\Scripts\activate

# Crie um ambiente virtual (Linux/Mac)
# python3 -m venv venv
# source venv/bin/activate

# Instale as dependências
pip install -r requirements.txt

# Rode o servidor
uvicorn main:app --reload
```
O Backend rodará em http://127.0.0.1:8000


### 3. Configurando o Frontend (React)
Abra um novo terminal na pasta frontend:

```bash
cd frontend

# Instale as dependências
npm install

# Rode o projeto
npm run dev
```
O Frontend rodará em http://localhost:5173 (ou porta similar indicada no terminal)

---
Feito por Anderson Gomes.
