# 🚀 Zero-Config Full-Stack Starter Generator

**Instantly generate production-ready full-stack projects without manual setup.**

A web-based generator that creates fully configured full-stack projects with TypeScript, authentication, and tests — all in one click. Supports React, Angular, Vue.js, Next.js, Express.js, NestJS, and Fastify.

---

## What It Does

Pick your stack, download a ZIP, and start coding. Zero-Config handles the boilerplate so you don't have to.

1. **Select** frontend (React, Angular, Vue.js, or Next.js for full-stack)
2. **Select** backend (Express.js, NestJS, or Fastify)
3. **Select** database (PostgreSQL, MySQL, MariaDB, SQL Server, SQLite, CockroachDB, or MongoDB)
4. **Download** a project with auth, CRUD, and tests built-in

---

## Templates

### Frontend

|     | Template    | Stack                                               | Tests  |
| --- | ----------- | --------------------------------------------------- | ------ |
| ⚛️  | **React**   | React 19 + Vite 7.2 + TypeScript 5.9 + Tailwind CSS | Vitest |
| 🅰️  | **Angular** | Angular 21 + SSR + Signals + Tailwind CSS 4.x       | Vitest |
| 💚  | **Vue.js**  | Vue 3.5 + Pinia 3.0 + Vite 7.3 + Oxlint             | Vitest |
| ▲   | **Next.js** | Next.js 16 + App Router + SQLite + Tailwind CSS 4   | Vitest |

### Backend

|     | Template    | Stack                                  | Tests               |
| --- | ----------- | -------------------------------------- | ------------------- |
| 🚀  | **Express** | Express 4.18 + Prisma + JWT            | Jest + supertest    |
| 🐱  | **NestJS**  | NestJS 11 + Passport.js + Prisma + JWT | Jest (mocked)       |
| ⚡  | **Fastify** | Fastify 5 + @fastify/jwt + Prisma      | Vitest + app.inject |

### Databases

|     | Database        | Prisma Provider |
| --- | --------------- | --------------- |
| 🐘  | **PostgreSQL**  | `postgresql`    |
| 🐬  | **MySQL**       | `mysql`         |
| 🗄️  | **MariaDB**     | `mysql`         |
| 🏢  | **SQL Server**  | `sqlserver`     |
| 📁  | **SQLite**      | `sqlite`        |
| 🪳  | **CockroachDB** | `cockroachdb`   |
| 🍃  | **MongoDB**     | `mongodb`       |

The Prisma provider is auto-configured based on your selection.

---

## What's Included

Every generated project comes with:

- **JWT Auth** — Access tokens (15m) + Refresh tokens (7d) with rotation
- **Full CRUD** — Create, Read, Update, Delete with ownership verification
- **Prisma ORM** — Type-safe database access, provider auto-configured
- **bcrypt** — Password hashing (10 rounds) + strong password validation
- **Pre-written Tests** — Auth flow, CRUD, edge cases, and auth guards

---

## Generator Architecture

The generator itself is a **Next.js 15 frontend** + **NestJS 11 backend**.

The backend resolves templates from a local folder, GitHub URL, or auto-detected sibling directory, extracts the selected folders, swaps the Prisma provider, and packages a ZIP.

**API:**

```
GET  /api/                       Health check
GET  /api/templates              List available templates
POST /api/templates              Download selected stack + database
```

**Security:** CORS whitelist · Helmet headers · Rate limiting · Input validation · Path traversal prevention · Size limits · 30s fetch timeout

---

## Live Demo

**👉 [https://zero-config.vercel.app/](https://zero-config.vercel.app/)**

---

## Template Source

All boilerplate code: [github.com/dhuruvandb/zero-config-templates](https://github.com/dhuruvandb/zero-config-templates)

---

<div align="center">

Made by [@dhuruvandb](https://github.com/dhuruvandb)

</div>
