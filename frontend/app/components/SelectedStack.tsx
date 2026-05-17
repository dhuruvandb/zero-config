import { templateData, databaseOptions } from "../data/templates";
import type { TemplateKey } from "../data/templates";
import type { FrontendTemplate, BackendTemplate } from "../types/templates";

interface SelectedStackProps {
  selectedFrontend: TemplateKey | null;
  selectedBackend: TemplateKey | null;
  selectedDatabase: string | null;
}

export default function SelectedStack({
  selectedFrontend,
  selectedBackend,
  selectedDatabase,
}: SelectedStackProps) {
  if (!selectedFrontend || !selectedBackend || !selectedDatabase) {
    return null;
  }

  const frontendTemplate = templateData[selectedFrontend] as FrontendTemplate;
  const backendTemplate = templateData[selectedBackend] as BackendTemplate;
  const dbOption = databaseOptions.find((d) => d.id === selectedDatabase)!;

  return (
    <div className="selected-stack">
      <h3>🎯 Your Selected Stack</h3>
      <div className="selected-stack-grid">
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
          </div>
        </div>
        <div className="selected-connector">+</div>
        <div className="selected-card">
          <div className="selected-title">
            <span>{dbOption.icon}</span>
            <span>{dbOption.name}</span>
          </div>
          <div className="selected-meta">
            <span>{dbOption.defaultOrm}</span>
          </div>
        </div>
      </div>
    </div>
  );
}