import { templateData } from "../data/templates";
import type { TemplateKey } from "../data/templates";
import type { BackendTemplate, FrontendTemplate } from "../types/templates";

interface SelectedStackProps {
  isStandalone: boolean;
  selectedFrontend: TemplateKey | null;
  selectedBackend: TemplateKey | null;
}

export default function SelectedStack({
  isStandalone,
  selectedFrontend,
  selectedBackend,
}: SelectedStackProps) {
  if (!isStandalone && (!selectedFrontend || !selectedBackend)) {
    return null;
  }

  return (
    <div className="selected-stack">
      <h3>🎯 Your Selected Stack</h3>
      <div className="selected-stack-grid">
        {isStandalone ? (
          <div className="selected-card">
            <div className="selected-title">
              <span>▲</span>
              <span>Next.js v15 (Full-Stack)</span>
            </div>
            <div className="selected-meta">
              <span>Port 3000</span>
              <span>•</span>
              <span>🗄️ SQLite</span>
              <span>•</span>
              <span>Server Actions</span>
            </div>
          </div>
        ) : (
          (() => {
            const frontendTemplate = templateData[
              selectedFrontend as TemplateKey
            ] as FrontendTemplate;
            const backendTemplate = templateData[
              selectedBackend as TemplateKey
            ] as BackendTemplate;

            return (
              <>
                <div className="selected-card">
                  <div className="selected-title">
                    <span>{frontendTemplate.icon}</span>
                    <span>
                      {frontendTemplate.name} {frontendTemplate.version}
                    </span>
                  </div>
                  <div className="selected-meta">
                    <span>Port {frontendTemplate.port}</span>
                  </div>
                </div>
                <div className="selected-connector">+</div>
                <div className="selected-card">
                  <div className="selected-title">
                    <span>{backendTemplate.icon}</span>
                    <span>{backendTemplate.name}</span>
                  </div>
                  <div className="selected-meta">
                    <span>Port {backendTemplate.port}</span>
                    <span>•</span>
                    <span>
                      {backendTemplate.databaseIcon} {backendTemplate.database}
                    </span>
                    <span>•</span>
                    <span>{backendTemplate.orm}</span>
                  </div>
                </div>
              </>
            );
          })()
        )}
      </div>
    </div>
  );
}
