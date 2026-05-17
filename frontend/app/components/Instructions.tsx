import SectionCard from "./SectionCard";
import { templateData, databaseOptions } from "../data/templates";
import type { TemplateKey } from "../data/templates";
import type { BackendTemplate } from "../types/templates";

interface InstructionsProps {
  selectedFrontend: TemplateKey | null;
  selectedBackend: TemplateKey | null;
  selectedDatabase: string | null;
}

export default function Instructions({
  selectedFrontend,
  selectedBackend,
  selectedDatabase,
}: InstructionsProps) {
  const frontendPort = selectedFrontend
    ? templateData[selectedFrontend].port
    : "5173 or 4200";
  const backendPort = selectedBackend
    ? templateData[selectedBackend].port
    : "5000";
  const backendDatabase = selectedBackend
    ? (templateData[selectedBackend] as BackendTemplate).database
    : "Database setup included";
  const dbName = selectedDatabase
    ? databaseOptions.find((d) => d.id === selectedDatabase)?.name ?? "your database"
    : "your database";

  return (
    <SectionCard title="How To Use" subtitle="Download, unblock, and ship.">
      <div className="notice-card">
        <h3>IMPORTANT: Windows users - unblock the ZIP first</h3>
        <ol>
          <li>After download, do not extract yet.</li>
          <li>Right-click the ZIP file and open Properties.</li>
          <li>Check the Unblock box at the bottom.</li>
          <li>Click Apply, then OK.</li>
          <li>Extract without any warnings.</li>
        </ol>
        <p className="notice-footnote">
          This unblocks all files at once (.gitignore, .editorconfig, etc.).
        </p>
      </div>

      <p className="section-subtitle">Installation steps:</p>
      <pre className="code-block">
        {`1. Select one frontend framework (React/Angular/Vue/Next.js)
2. Select one backend framework (Express/NestJS/Fastify)
3. Select your database (PostgreSQL/MySQL/MariaDB/SQL Server/SQLite/MongoDB/CockroachDB)
4. Click "Download Stack"
5. UNBLOCK THE ZIP FILE FIRST (see above)
6. Extract the ZIP file
7. For each template folder, run:
   cd [template-name]
   npm install
   npm run dev
8. Frontend: http://localhost:${frontendPort}
9. Backend: http://localhost:${backendPort}
   ${backendDatabase}
10. Start building your full-stack project with ${dbName}!`}
      </pre>
    </SectionCard>
  );
}