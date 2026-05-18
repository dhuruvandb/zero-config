import Header from "./components/Header";
import SectionCard from "./components/SectionCard";
import StackShowcase from "./components/StackShowcase";
import CliCopyButton from "./components/CliCopyButton";
import Footer from "./components/Footer";

export default function Home() {
  return (
    <div className="page-shell">
      <Header />
      <main className="max-w-5xl mx-auto px-4 py-8">
        {/* Hero CTA */}
        <SectionCard title="One Command. Instant Stack." subtitle="4 frontends × 3 backends × 7 databases = 84 stack combinations.">
          <div className="cli-hero">
            <div className="cli-command-box">
              <code className="cli-command">npx zero-config-cli my-project</code>
              <CliCopyButton command="npx zero-config-cli my-project" />
            </div>
            <div className="cli-badges">
              <a href="https://www.npmjs.com/package/zero-config-cli" target="_blank" rel="noreferrer">
                <img src="https://img.shields.io/npm/v/zero-config-cli?style=flat-square&logo=npm&color=cb3837" alt="npm version" />
              </a>
            <a href="https://github.com/dhuruvandb/zero-config-cli" target="_blank" rel="noreferrer">
                <img src="https://img.shields.io/github/stars/dhuruvandb/zero-config-cli?style=flat-square&logo=github&color=2ec4b6" alt="GitHub stars" />
              </a>
            </div>
          </div>
        </SectionCard>

        {/* Available Stacks */}
        <SectionCard title="🎨 Available Stacks" subtitle="Mix and match any frontend with any backend and any database.">
          <StackShowcase />
        </SectionCard>

        {/* What's Included */}
        <SectionCard title="📦 What's Included" subtitle="Every generated project comes production-ready.">
          <div className="features-grid">
            <div className="feature-chip">🔐 JWT Auth (access + refresh tokens)</div>
            <div className="feature-chip">📝 Full CRUD with ownership verification</div>
            <div className="feature-chip">🗄️ Prisma ORM — 7 databases supported</div>
            <div className="feature-chip">🔑 bcrypt password hashing</div>
            <div className="feature-chip">🧪 Pre-written tests (auth, CRUD, edge cases)</div>
            <div className="feature-chip">⚙️ TypeScript, ESLint, CORS, env vars</div>
            <div className="feature-chip">🚀 Zero config — start coding immediately</div>
            <div className="feature-chip">📦 Auto npm install (optional)</div>
          </div>
        </SectionCard>

        {/* CLI Walkthrough */}
        <SectionCard title="💻 Interactive Walkthrough" subtitle="5 prompts. One project. Zero hassle.">
          <pre className="code-block">{`$ npx zero-config-cli my-project

? Select a frontend:   ⚛️ React  🅰️ Angular  💚 Vue.js  ▲ Next.js
? Name your folder:    (defaults to framework name)
? Select a backend:    🚀 Express  🐱 NestJS  ⚡ Fastify
? Name your folder:    (defaults to framework name)
? Select a database:   🐘 PostgreSQL  🐬 MySQL  📁 SQLite  ...

[⏳] Generating...
[✔] Project ready!

✨ cd my-project/frontend && npm run dev
✨ cd my-project/backend && npm run dev`}</pre>
          <div className="cli-options-grid">
            <div className="cli-option">
              <span className="cli-option-flag">-f, --frontend</span>
              <span className="cli-option-desc">react, angular, vuejs, nextjs</span>
            </div>
            <div className="cli-option">
              <span className="cli-option-flag">-b, --backend</span>
              <span className="cli-option-desc">express, nestjs, fastify</span>
            </div>
            <div className="cli-option">
              <span className="cli-option-flag">-d, --database</span>
              <span className="cli-option-desc">7 databases — Prisma auto-configured</span>
            </div>
            <div className="cli-option">
              <span className="cli-option-flag">--no-install</span>
              <span className="cli-option-desc">Skip npm install step</span>
            </div>
            <div className="cli-option">
              <span className="cli-option-flag">-t, --templates-path</span>
              <span className="cli-option-desc">Local folder or GitHub zip URL</span>
            </div>
          </div>
        </SectionCard>

        {/* Why CLI */}
        <SectionCard title="⚡ Why the CLI?" subtitle="The same generator you know, now in your terminal.">
          <div className="why-grid">
            <div className="why-item">
              <span className="why-icon">🌐</span>
              <div>
                <strong>Works anywhere</strong>
                <p>No server needed. Everything runs on your machine.</p>
              </div>
            </div>
            <div className="why-item">
              <span className="why-icon">📂</span>
              <div>
                <strong>Custom folders</strong>
                <p>Name your frontend and backend whatever you want.</p>
              </div>
            </div>
            <div className="why-item">
              <span className="why-icon">📦</span>
              <div>
                <strong>Auto npm install</strong>
                <p>Both, frontend only, backend only, or skip.</p>
              </div>
            </div>
            <div className="why-item">
              <span className="why-icon">🔌</span>
              <div>
                <strong>Offline support</strong>
                <p>Works with local templates — no internet needed.</p>
              </div>
            </div>
            <div className="why-item">
              <span className="why-icon">🤖</span>
              <div>
                <strong>CI/CD ready</strong>
                <p>Flag-based mode for automation pipelines.</p>
              </div>
            </div>
            <div className="why-item">
              <span className="why-icon">💰</span>
              <div>
                <strong>Zero cost</strong>
                <p>No cloud bills. No server maintenance.</p>
              </div>
            </div>
          </div>
        </SectionCard>

      </main>
      <Footer />
    </div>
  );
}