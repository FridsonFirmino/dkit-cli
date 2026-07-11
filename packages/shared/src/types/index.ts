export type Framework = "react" | "nextjs" | "expo" | "react-native";

export type PackageManager = "npm" | "pnpm" | "bun" | "yarn";

export type ProjectType = "frontend" | "mobile" | "none";

export interface DetectedFramework {
  name: Framework;
  version: string | null;
}

export interface DetectedTools {
  tailwind: boolean;
  shadcn: boolean;
  eslint: boolean;
  prettier: boolean;
  biome: boolean;
  storybook: boolean;
  husky: boolean;
  commitlint: boolean;
  tanstackQuery: boolean;
  redux: boolean;
  zustand: boolean;
  jotai: boolean;
  firebase: boolean;
  supabase: boolean;
  prisma: boolean;
  sentry: boolean;
  posthog: boolean;
  docker: boolean;
  githubActions: boolean;
}

export interface DetectedEnvironment {
  hasEnv: boolean;
  envFiles: string[];
}

export interface DetectedGit {
  initialized: boolean;
  branch: string | null;
  remote: string | null;
  hasUncommittedChanges: boolean;
}

export interface DetectedMobile {
  expoRouter: boolean;
  reactNavigation: boolean;
  androidSdk: boolean;
  adb: boolean;
  java: boolean;
  pods: boolean;
  xcode: boolean;
}

export interface ProjectInfo {
  type: ProjectType;
  name: string | null;
  rootPath: string;
  framework: DetectedFramework | null;
  packageManager: PackageManager;
  hasTypeScript: boolean;
  tools: DetectedTools;
  environment: DetectedEnvironment;
  git: DetectedGit;
  mobile: DetectedMobile | null;
  structure: string[];
}

export interface HealthScoreResult {
  score: number;
  maxScore: number;
  checks: HealthCheck[];
  recommendations: string[];
}

export interface HealthCheck {
  name: string;
  passed: boolean;
  warning?: boolean;
  message: string;
}

export interface ComponentOptions {
  name: string;
  type: "ui" | "shared" | "feature" | "layout" | "modal" | "drawer";
  withTests: boolean;
  withStorybook: boolean;
  cssModule: boolean;
  tailwind: boolean;
  styledComponents: boolean;
}

export interface PageOptions {
  name: string;
  withLayout: boolean;
  withLoading: boolean;
  withError: boolean;
  withActions: boolean;
}

export interface HookOptions {
  name: string;
  type: "fetch" | "pagination" | "theme" | "debounce" | "mediaQuery" | "custom";
}

export interface ContextOptions {
  name: string;
  type: "theme" | "auth" | "user" | "custom";
}

export interface StoreOptions {
  name: string;
  type: "redux" | "zustand" | "jotai";
}

export interface CRUDOptions {
  entity: string;
  fields: CRUDField[];
}

export interface CRUDField {
  name: string;
  type: "string" | "number" | "boolean" | "date" | "email" | "image" | "select";
  required: boolean;
  label: string;
  options?: string[];
}

export interface CreateProjectOptions {
  name: string;
  framework: Framework;
  packageManager: PackageManager;
  typescript: boolean;
  tailwind: boolean;
  eslint: boolean;
  prettier: boolean;
  husky: boolean;
  biome: boolean;
  shadcn: boolean;
  storybook: boolean;
  tanstackQuery: boolean;
  redux: boolean;
  zustand: boolean;
  firebase: boolean;
  supabase: boolean;
  prisma: boolean;
  docker: boolean;
  githubActions: boolean;
}

export interface ConfigureOptions {
  tool: string;
  force?: boolean;
}

export interface ScreenOptions {
  name: string;
  type: "stack" | "tab" | "modal" | "drawer";
  withNavigation: boolean;
}
