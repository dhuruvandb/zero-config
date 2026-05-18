import { templateData, frontendOptions, backendOptions, databaseOptions } from "../data/templates";
import type { FrontendTemplate, BackendTemplate } from "../types/templates";

export default function StackShowcase() {
  return (
    <div className="stack-showcase">
      <div className="showcase-column">
        <h4 className="showcase-column-title">
          <span className="th-icon">🎨</span> Frontend
        </h4>
        <div className="showcase-list">
          {frontendOptions.map((key) => {
            const t = templateData[key] as FrontendTemplate;
            return (
              <div key={key} className="showcase-card">
                <span className="showcase-icon">{t.icon}</span>
                <div className="showcase-body">
                  <strong className="showcase-name">{t.name} {t.version}</strong>
                  <span className="showcase-meta">Port {t.port} · {t.description}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      <div className="showcase-column">
        <h4 className="showcase-column-title">
          <span className="th-icon">⚙️</span> Backend
        </h4>
        <div className="showcase-list">
          {backendOptions.map((key) => {
            const t = templateData[key] as BackendTemplate;
            return (
              <div key={key} className="showcase-card">
                <span className="showcase-icon">{t.icon}</span>
                <div className="showcase-body">
                  <strong className="showcase-name">{t.name} {t.version}</strong>
                  <span className="showcase-meta">Port {t.port} · {t.description}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      <div className="showcase-column">
        <h4 className="showcase-column-title">
          <span className="th-icon">🗄️</span> Databases
        </h4>
        <div className="showcase-db-list">
          {databaseOptions.map((db) => (
            <div key={db.id} className="showcase-db-chip">
              <span>{db.icon}</span>
              <span>{db.name}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
