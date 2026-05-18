# 🚀 Zero-Config Full-Stack Starter Generator

**Generate production-ready full-stack projects instantly — from your terminal.**

A CLI-powered project generator with TypeScript, authentication, Prisma ORM, and tests — all built in. Supports 4 frontends, 3 backends, and 7 databases.

---

## Quick Start

```bash
npx zero-config-cli my-project
```

That's it. Follow the prompts and start coding in under 30 seconds.

🌐 **Static landing page:** [zero-config.vercel.app](https://zero-config.vercel.app)  
📦 **npm package:** [zero-config-cli](https://www.npmjs.com/package/zero-config-cli)  
🐙 **CLI repo:** [github.com/dhuruvandb/zero-config-cli](https://github.com/dhuruvandb/zero-config-cli)

---

## What It Does

Pick your stack in 5 interactive prompts, and the CLI generates everything on your machine — no server needed.

1. **Select** frontend (React, Angular, Vue.js, Next.js)
2. **Name** your frontend folder
3. **Select** backend (Express.js, NestJS, Fastify)
4. **Name** your backend folder
5. **Select** database (PostgreSQL, MySQL, MariaDB, SQL Server, SQLite, CockroachDB, or MongoDB)

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

## Live Demo

🌐 [zero-config.vercel.app](https://zero-config.vercel.app/) — Static landing page showcasing stacks and the CLI command.  
📦 [npmjs.com/package/zero-config-cli](https://www.npmjs.com/package/zero-config-cli) — The CLI package.

---

## CLI Generator

The project generator has moved from web to CLI. Run it anywhere:

```bash
npx zero-config-cli my-project
```

It resolves templates from a local folder or GitHub URL, copies the selected frontend + backend, swaps the Prisma provider, and writes everything to disk — **no server needed.**

---

## Related Repos

| Project                                                                      | Description                                 |
| ---------------------------------------------------------------------------- | ------------------------------------------- |
| [zero-config-cli](https://github.com/dhuruvandb/zero-config-cli)             | 💻 **CLI generator** — The main tool        |
| [zero-config](https://github.com/dhuruvandb/zero-config)                     | 🌐 **This repo** — Static landing page      |
| [zero-config-templates](https://github.com/dhuruvandb/zero-config-templates) | 📦 **Templates source** — Auth, CRUD, tests |

---

## Template Source

All boilerplate code: [github.com/dhuruvandb/zero-config-templates](https://github.com/dhuruvandb/zero-config-templates)

---

<div align="center">

Made by [@dhuruvandb](https://github.com/dhuruvandb)

</div>
