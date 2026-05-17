import type { Template, DatabaseOption } from "../types/templates";

export const templateData = {
  react: {
    name: "React",
    fullName: "React + Vite",
    icon: "⚛️",
    type: "frontend" as const,
    version: "v19",
    port: 5173,
    description: "Auth context, Protected routes, Token refresh",
    technologies:
      "React 19, Vite 7.2, React Router v6, TypeScript 5.9, Tailwind CSS",
  },
  angular: {
    name: "Angular",
    fullName: "Angular + SSR",
    icon: "🅰️",
    type: "frontend" as const,
    version: "v21",
    port: 4200,
    description: "Auth guards, Signals, Tailwind CSS 4",
    technologies:
      "Angular 21, SSR, Signals, Tailwind CSS 4.x, Vitest, RxJS",
  },
  vuejs: {
    name: "Vue.js",
    fullName: "Vue.js + Vite",
    icon: "💚",
    type: "frontend" as const,
    version: "v3",
    port: 5173,
    description: "Pinia store, Composition API, Oxlint",
    technologies:
      "Vue 3.5, Pinia 3.0, Vue Router 4.6, Vite 7.3, Oxlint, Tailwind CSS",
  },
  nextjs: {
    name: "Next.js",
    fullName: "Next.js App Router",
    icon: "▲",
    type: "frontend" as const,
    version: "v15",
    port: 3000,
    description: "SQLite auth, Server Actions, Full CRUD",
    technologies: "Next.js 15, SQLite, Server Actions, Tailwind CSS 4",
  },
  express: {
    name: "Express",
    fullName: "Express.js",
    icon: "🚀",
    type: "backend" as const,
    version: "v4.18",
    port: 5000,
    database: "MongoDB",
    databaseIcon: "🍃",
    orm: "Mongoose",
    description: "In-memory fallback, Auto-migration",
    technologies:
      "Express 4.18, Mongoose 7, mongodb-memory-server, JWT, bcrypt",
  },
  nestjs: {
    name: "NestJS",
    fullName: "NestJS",
    icon: "🐱",
    type: "backend" as const,
    version: "v11",
    port: 5000,
    database: "PostgreSQL",
    databaseIcon: "🐘",
    orm: "Prisma",
    description: "Modular architecture, Passport.js",
    technologies: "NestJS 11, Prisma 6.2, Passport.js, JWT, class-validator",
  },
  fastify: {
    name: "Fastify",
    fullName: "Fastify",
    icon: "⚡",
    type: "backend" as const,
    version: "v5",
    port: 5000,
    database: "PostgreSQL",
    databaseIcon: "🐘",
    orm: "Prisma",
    description: "High-performance, low overhead",
    technologies: "Fastify 5, Prisma, JWT, Swagger, TypeScript",
  },
} satisfies Record<string, Template>;

export type TemplateKey = keyof typeof templateData;

export const frontendOptions: TemplateKey[] = ["react", "angular", "vuejs", "nextjs"];
export const backendOptions: TemplateKey[] = ["express", "nestjs", "fastify"];

export const databaseOptions: DatabaseOption[] = [
  {
    id: "postgresql",
    name: "PostgreSQL",
    icon: "🐘",
    description: "Relational SQL database",
    defaultOrm: "Prisma",
  },
  {
    id: "mysql",
    name: "MySQL",
    icon: "🐬",
    description: "Popular open-source RDBMS",
    defaultOrm: "Prisma",
  },
  {
    id: "mariadb",
    name: "MariaDB",
    icon: "🪶",
    description: "MySQL-compatible fork",
    defaultOrm: "Prisma",
  },
  {
    id: "sqlserver",
    name: "SQL Server",
    icon: "🟦",
    description: "Microsoft enterprise database",
    defaultOrm: "Prisma",
  },
  {
    id: "sqlite",
    name: "SQLite",
    icon: "🗄️",
    description: "Lightweight embedded database",
    defaultOrm: "Better-sqlite3",
  },
  {
    id: "mongodb",
    name: "MongoDB",
    icon: "🍃",
    description: "NoSQL document database",
    defaultOrm: "Mongoose",
  },
  {
    id: "cockroachdb",
    name: "CockroachDB",
    icon: "🪳",
    description: "Distributed SQL database",
    defaultOrm: "Prisma",
  },
];