export type TemplateType = "frontend" | "backend";

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
  version: string;
  database: string;
  databaseIcon: string;
  orm: string;
}

export interface DatabaseOption {
  id: string;
  name: string;
  icon: string;
  description: string;
  defaultOrm: string;
}

export type Template = FrontendTemplate | BackendTemplate;