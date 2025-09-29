# 📓 EchoPad

> An **intelligent notes app** with a unified screen for **notes** and an **AI chatbot**.  
> Built with **Next.js, TypeScript, and Tailwind CSS**, EchoPad enables CRUD for notes and integrates AI for contextual, seamless assistance.

---

## ✨ Features

- ✍️ **Notes Management** – Create, read, update, and delete notes
- 🤖 **AI Chatbot** – Contextual chat powered by Vercel AI SDK + Google AI
- 🔐 **Authentication** – Secure login with Clerk.js
- 🗄️ **Database Layer** – PostgreSQL + Drizzle ORM
- 📂 **Vector Search** – Semantic search with Pinecone
- 🎨 **Modern UI/UX** – Tailwind CSS + Radix UI + animations
- 🌗 **Light/Dark Theme** – Handled via next-themes
- ✅ **Form Validation** – react-hook-form + zod
- ⚡ **DX Focused** – TypeScript, ESLint, Prettier, Drizzle Kit

---

## 🛠️ Tech Stack

**Frontend & Framework**

- Next.js 14
- React 18
- TypeScript
- Tailwind CSS
- Radix UI

**AI & Vector Search**

- Vercel AI SDK
- @ai-sdk/google
- Pinecone

**Auth & State**

- Clerk.js
- react-hook-form + zod

**Database**

- PostgreSQL
- Drizzle ORM

**Tooling**

- ESLint + Prettier
- Drizzle Kit
- Tailwind Merge / Class Variance Authority / clsx

---

## 🚀 Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/your-username/echopad.git
cd echopad


```

### Install Dependences

npm install

Create a .env.local file:
DATABASE_URL=your_postgres_connection_string
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
CLERK_SECRET_KEY=your_clerk_secret_key
PINECONE_API_KEY=your_pinecone_api_key
GOOGLE_API_KEY=your_google_api_key

### Run Migrations

npm run db:push

### Run Server

npm run dev

## Folder Structure

.
├── drizzle/ # Database migrations & schema
├── src/
│ ├── app/ # Next.js app router
│ ├── components/ # Reusable UI components
│ ├── lib/ # Utilities (db, auth, AI helpers)
│ ├── hooks/ # Custom React hooks
│ └── styles/ # Global styles
├── .env.local # Environment variables
└── package.json
