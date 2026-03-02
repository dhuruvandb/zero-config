import SectionCard from "./SectionCard";
import { backendOptions, frontendOptions, templateData } from "../data/templates";
import type { TemplateKey } from "../data/templates";
import type { BackendTemplate } from "../types/templates";

interface StackSelectorProps {
  selectedFrontend: TemplateKey | null;
  selectedBackend: TemplateKey | null;
  isStandalone: boolean;
  onSelectFrontend: (key: TemplateKey) => void;
  onSelectBackend: (key: TemplateKey) => void;
  onClearBackend: () => void;
  onClearError: () => void;
}

export default function StackSelector({
  selectedFrontend,
  selectedBackend,
  isStandalone,
  onSelectFrontend,
  onSelectBackend,
  onClearBackend,
  onClearError,
}: StackSelectorProps) {
  return (
    <SectionCard
      title="Select Your Stack"
      subtitle="Pick a full-stack Next.js app or combine a frontend with a backend."
    >
      <div className="stack-grid">
        <div className="stack-column">
          <div className="stack-header">Full-Stack (All-in-One)</div>
          <label
            className={`option-card ${
              selectedFrontend === "nextjs" ? "is-active" : ""
            }`}
          >
            <input
              type="radio"
              name="stack"
              value="nextjs"
              checked={selectedFrontend === "nextjs"}
              onChange={() => {
                onSelectFrontend("nextjs");
                onClearBackend();
                onClearError();
              }}
            />
            <span className="option-icon">▲</span>
            <div className="option-body">
              <h3>Next.js v15 App Router (Full-Stack)</h3>
              <p>
                {templateData.nextjs.description} - Frontend and backend wired
                together.
              </p>
              <div className="badge-row">
                <span className="pill">🗄️ SQLite (zero-config)</span>
                <span className="pill pill-accent">Port 3000</span>
              </div>
            </div>
          </label>
        </div>

        <div className="divider">OR</div>

        <div className="stack-column">
          <div className="stack-header">Frontend</div>
          <div className="option-list">
            {frontendOptions.map((frontend) => (
              <label
                key={frontend}
                className={`option-card ${
                  selectedFrontend === frontend ? "is-active" : ""
                }`}
              >
                <input
                  type="radio"
                  name="frontend"
                  value={frontend}
                  checked={selectedFrontend === frontend}
                  onChange={() => {
                    onSelectFrontend(frontend);
                    onClearError();
                  }}
                />
                <span className="option-icon">
                  {templateData[frontend].icon}
                </span>
                <div className="option-body">
                  <h3>{templateData[frontend].fullName}</h3>
                  <p>{templateData[frontend].description}</p>
                  <div className="badge-row">
                    <span className="pill pill-neutral">
                      {String("version" in templateData[frontend]
                        ? templateData[frontend].version
                        : "")}
                    </span>
                    <span className="pill pill-accent">Port {templateData[frontend].port}</span>
                  </div>
                </div>
              </label>
            ))}
          </div>
        </div>

        <div className="stack-column">
          <div className="stack-header">Backend</div>
          <div className="option-list">
            {backendOptions.map((backend) => {
              const backendTemplate = templateData[backend] as BackendTemplate;
              return (
                <label
                  key={backend}
                  className={`option-card ${
                    selectedBackend === backend ? "is-active" : ""
                  } ${isStandalone ? "is-disabled" : ""}`}
                  aria-disabled={isStandalone}
                >
                  <input
                    type="radio"
                    name="backend"
                    value={backend}
                    checked={selectedBackend === backend}
                    disabled={isStandalone}
                    onChange={() => {
                      if (isStandalone) {
                        return;
                      }
                      onSelectBackend(backend);
                      onClearError();
                    }}
                  />
                  <span className="option-icon">{backendTemplate.icon}</span>
                  <div className="option-body">
                    <h3>{backendTemplate.fullName}</h3>
                    <p>{backendTemplate.description}</p>
                    <div className="badge-row">
                      <span className="pill">
                        {backendTemplate.databaseIcon} {backendTemplate.database}
                      </span>
                      <span className="pill pill-neutral">
                        {backendTemplate.orm}
                      </span>
                      <span className="pill pill-accent">
                        Port {backendTemplate.port}
                      </span>
                    </div>
                  </div>
                </label>
              );
            })}
          </div>
        </div>
      </div>
    </SectionCard>
  );
}
