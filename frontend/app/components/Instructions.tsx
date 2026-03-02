import SectionCard from "./SectionCard";
import { templateData } from "../data/templates";
import type { TemplateKey } from "../data/templates";
import type { BackendTemplate } from "../types/templates";

interface InstructionsProps {
  isStandalone: boolean;
  selectedFrontend: TemplateKey | null;
  selectedBackend: TemplateKey | null;
}

export default function Instructions({
  isStandalone,
  selectedFrontend,
  selectedBackend,
}: InstructionsProps) {
  const frontendPort = selectedFrontend
    ? templateData[selectedFrontend].port
    : "5173 or 4200";
  const backendPort = selectedBackend
    ? templateData[selectedBackend].port
    : "5000 or 8080";
  const backendDatabase = selectedBackend
    ? (templateData[selectedBackend] as BackendTemplate).database
    : "Database setup included";

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
        {isStandalone
          ? `1. Select "Next.js Full-Stack" (standalone app)
2. Click "Download Stack"
3. UNBLOCK THE ZIP FILE FIRST (see above)
4. Extract the ZIP file
5. Run:
   cd nextjs
   npm install
   npm run dev
6. Open http://localhost:3000
7. Full-stack app with auth and SQLite database included!`
          : `1. Select one frontend framework (React/Angular/Vue)
2. Select one backend framework (Express/NestJS/Spring Boot)
3. Click "Download Stack"
4. UNBLOCK THE ZIP FILE FIRST (see above)
5. Extract the ZIP file
6. For each template folder, run:
   cd [template-name]
   npm install  # or mvn install for Spring Boot
   npm run dev  # or mvn spring-boot:run for Spring Boot
7. Frontend: http://localhost:${frontendPort}
8. Backend: http://localhost:${backendPort}
   ${backendDatabase}
9. Start building your full-stack project instantly!`}
      </pre>
    </SectionCard>
  );
}
