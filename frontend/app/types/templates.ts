export type TemplateType = "frontend" | "backend" | "standalone";

export interface BaseTemplate {
  name: string;
  fullName: string;
  icon: string;
  type: TemplateType;
  port: number;
  description: string;
  technologies: string;
}

export interface FrontendTemplate extends BaseTemplate {
  type: "frontend";
  version: string;
}

export interface BackendTemplate extends BaseTemplate {
  type: "backend";
  database: string;
  databaseIcon: string;
  orm: string;
}

export interface StandaloneTemplate extends BaseTemplate {
  type: "standalone";
  version: string;
  database: string;
  databaseIcon: string;
}

export type Template = FrontendTemplate | BackendTemplate | StandaloneTemplate;
