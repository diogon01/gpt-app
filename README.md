# AI Technical Challenge — Fullstack Web Application

This project is a fullstack web application developed as part of a technical challenge. It integrates the **OpenAI API** to deliver creative and useful AI features. The project is structured as a **monorepo** using `pnpm` workspaces, cleanly separating frontend, backend, and shared packages.

---

## 🛠️ Technologies Used

### Frontend (`apps/web`)
- [Vue 3](https://vuejs.org/) + [Vite](https://vitejs.dev/)
- [Pinia](https://pinia.vuejs.org/) — state management
- [Vue Router](https://router.vuejs.org/) — public and private routes
- [Tailwind CSS](https://tailwindcss.com/) — utility-first styling
- [Firebase](https://firebase.google.com/) — optional authentication

### Backend (`apps/api`)
- [Node.js](https://nodejs.org/) + [Express](https://expressjs.com/)
- [MongoDB](https://www.mongodb.com/) with [Mongoose](https://mongoosejs.com/)
- [OpenAI API](https://platform.openai.com/)
- Middleware, CORS, Helmet, Rate Limiting

### Shared Packages
- `@42robotics/domain`: DTOs, entities, mappers, interfaces
- `@42robotics/infra`: shared configuration, authentication strategies, database setup, type definitions

---

## 🤖 AI Features

This application integrates OpenAI's GPT API for dynamic content generation. It includes:
- Real-time prompts to GPT
- Loading state handling
- Proper error boundaries and fallback UI
- Future support for DALL·E or Whisper can be added easily

---

## 📦 Monorepo Structure

```bash
teste-tecnico/
├── apps/
│ ├── api/ # Backend (Express + MongoDB + OpenAI)
│ └── web/ # Frontend (Vue 3 + Vite + Tailwind + Firebase)
├── packages/
│ ├── domain/ # Entities, DTOs, interfaces, mappers, repositories
│ │ └── src/
│ │ ├── dtos/
│ │ ├── entities/
│ │ ├── enums/
│ │ ├── interfaces/
│ │ ├── mappers/
│ │ └── repositories/
│ └── infra/ # Auth strategies, DB config, type definitions
│ └── src/
│ ├── auth/
│ ├── config/
│ ├── database/
│ └── types/
```



## 🚀 How to Run the Project

### Requirements

- [pnpm](https://pnpm.io/) `>= 8.x`
- Node.js `>= 18`
- A running MongoDB instance (local or Atlas)
- OpenAI API Key

### Setup

```bash
# 1. Install dependencies
pnpm install

# 2. Copy example environment files
cp apps/api/.env.example apps/api/.env
cp apps/web/.env.example apps/web/.env

# 3. Start both frontend and backend in parallel
pnpm dev