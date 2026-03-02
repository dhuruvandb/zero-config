import type { Template } from "../types/templates";

export const templateData = {
  react: {
    name: "React",
    fullName: "React + Vite",
    icon: "⚛️",
    type: "frontend",
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
    type: "frontend",
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
    type: "frontend",
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
    type: "standalone",
    version: "v15",
    port: 3000,
    database: "SQLite",
    databaseIcon: "🗄️",
    description: "SQLite auth, Server Actions, Full CRUD",
    technologies: "Next.js 15, SQLite, Server Actions, Tailwind CSS 4",
  },
  express: {
    name: "Express",
    fullName: "Express.js",
    icon: "🚀",
    type: "backend",
    database: "MongoDB",
    databaseIcon: "🍃",
    orm: "Mongoose",
    port: 5000,
    description: "In-memory fallback, Auto-migration",
    technologies:
      "Express 4.18, Mongoose 7, mongodb-memory-server, JWT, bcrypt",
  },
  nestjs: {
    name: "NestJS",
    fullName: "NestJS",
    icon: "🐱",
    type: "backend",
    database: "PostgreSQL",
    databaseIcon: "🐘",
    orm: "Prisma",
    port: 5000,
    description: "Modular architecture, Passport.js",
    technologies: "NestJS 11, Prisma 6.2, Passport.js, JWT, class-validator",
  },
  springboot: {
    name: "Spring Boot",
    fullName: "Spring Boot",
    icon: "🍃",
    type: "backend",
    database: "MySQL",
    databaseIcon: "🐬",
    orm: "JPA",
    port: 8080,
    description: "Spring Security, Enterprise-grade",
    technologies: "Spring Boot 4.0.2, Spring Security, JPA, JJWT 0.12, MySQL",
  },
} satisfies Record<string, Template>;

export type TemplateKey = keyof typeof templateData;

export const frontendOptions: TemplateKey[] = ["react", "angular", "vuejs"];
export const backendOptions: TemplateKey[] = ["express", "nestjs", "springboot"];
