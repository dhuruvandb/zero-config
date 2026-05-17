import SectionCard from "./SectionCard";
import { templateData, frontendOptions, backendOptions, databaseOptions } from "../data/templates";
import type { TemplateKey } from "../data/templates";
import type { FrontendTemplate, BackendTemplate } from "../types/templates";

interface StackSelectorProps {
  selectedFrontend: TemplateKey | null;
  selectedBackend: TemplateKey | null;
  selectedDatabase: string | null;
  onSelectFrontend: (key: TemplateKey) => void;
  onSelectBackend: (key: TemplateKey) => void;
  onSelectDatabase: (id: string) => void;
  onClearError: () => void;
}

export default function StackSelector({
  selectedFrontend,
  selectedBackend,
  selectedDatabase,
  onSelectFrontend,
  onSelectBackend,
  onSelectDatabase,
  onClearError,
}: StackSelectorProps) {
  return (
    <SectionCard
      title="Select Your Stack"
      subtitle="Pick a frontend, a backend, and a database to build your full-stack project."
    >
      <div className="stack-columns-grid">
        {/* Frontend Column */}
        <div className="stack-column">
          <div className="stack-column-header">
            <span className="th-icon">🎨</span>
            <span>Frontend</span>
          </div>
          <div className="stack-options-list" role="radiogroup" aria-label="Frontend framework">
            {frontendOptions.map((key) => {
              const t = templateData[key] as FrontendTemplate;
              const isSelected = selectedFrontend === key;
              return (
                <label
                  key={key}
                  className={`stack-option-label ${isSelected ? "is-selected" : ""}`}
                >
                  <input
                    type="radio"
                    name="frontend"
                    value={key}
                    checked={isSelected}
                    onChange={() => {
                      onSelectFrontend(key);
                      onClearError();
                    }}
                    className="stack-radio-input"
                  />
                  <span className="stack-radio-dot" />
                  <span className="stack-cell-icon">{t.icon}</span>
                  <div className="stack-cell-body">
                    <span className="stack-cell-name">{t.name}</span>
                    <span className="stack-cell-meta">
                      {t.version} · Port {t.port}
                    </span>
                  </div>
                </label>
              );
            })}
          </div>
        </div>

        {/* Backend Column */}
        <div className="stack-column">
          <div className="stack-column-header">
            <span className="th-icon">⚙️</span>
            <span>Backend</span>
          </div>
          <div className="stack-options-list" role="radiogroup" aria-label="Backend framework">
            {backendOptions.map((key) => {
              const t = templateData[key] as BackendTemplate;
              const isSelected = selectedBackend === key;
              return (
                <label
                  key={key}
                  className={`stack-option-label ${isSelected ? "is-selected" : ""}`}
                >
                  <input
                    type="radio"
                    name="backend"
                    value={key}
                    checked={isSelected}
                    onChange={() => {
                      onSelectBackend(key);
                      onClearError();
                    }}
                    className="stack-radio-input"
                  />
                  <span className="stack-radio-dot" />
                  <span className="stack-cell-icon">{t.icon}</span>
                  <div className="stack-cell-body">
                    <span className="stack-cell-name">{t.name}</span>
                    <span className="stack-cell-meta">
                      {t.version} · Port {t.port}
                    </span>
                  </div>
                </label>
              );
            })}
          </div>
        </div>

        {/* Database Column */}
        <div className="stack-column">
          <div className="stack-column-header">
            <span className="th-icon">🗄️</span>
            <span>Database</span>
          </div>
          <div className="stack-options-list" role="radiogroup" aria-label="Database">
            {databaseOptions.map((db) => {
              const isSelected = selectedDatabase === db.id;
              return (
                <label
                  key={db.id}
                  className={`stack-option-label ${isSelected ? "is-selected" : ""}`}
                >
                  <input
                    type="radio"
                    name="database"
                    value={db.id}
                    checked={isSelected}
                    onChange={() => {
                      onSelectDatabase(db.id);
                      onClearError();
                    }}
                    className="stack-radio-input"
                  />
                  <span className="stack-radio-dot" />
                  <span className="stack-cell-icon">{db.icon}</span>
                  <div className="stack-cell-body">
                    <span className="stack-cell-name">{db.name}</span>
                    <span className="stack-cell-meta">{db.description}</span>
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