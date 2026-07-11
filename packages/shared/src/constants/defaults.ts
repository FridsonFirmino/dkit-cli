import type {
  DetectedTools,
  DetectedFramework,
  DetectedGit,
  DetectedEnvironment,
  DetectedMobile,
  PackageManager,
  ProjectType,
} from "../types/index.js";

export const EMPTY_TOOLS: DetectedTools = {
  tailwind: false,
  shadcn: false,
  eslint: false,
  prettier: false,
  biome: false,
  storybook: false,
  husky: false,
  commitlint: false,
  tanstackQuery: false,
  redux: false,
  zustand: false,
  jotai: false,
  firebase: false,
  supabase: false,
  prisma: false,
  sentry: false,
  posthog: false,
  docker: false,
  githubActions: false,
};

export const EMPTY_FRAMEWORK: DetectedFramework = {
  name: "react",
  version: null,
};

export const EMPTY_GIT: DetectedGit = {
  initialized: false,
  branch: null,
  remote: null,
  hasUncommittedChanges: false,
};

export const EMPTY_ENVIRONMENT: DetectedEnvironment = {
  hasEnv: false,
  envFiles: [],
};

export const EMPTY_MOBILE: DetectedMobile = {
  expoRouter: false,
  reactNavigation: false,
  androidSdk: false,
  adb: false,
  java: false,
  pods: false,
  xcode: false,
};

export const FRAMEWORK_DISPLAY_NAMES: Record<string, string> = {
  react: "React",
  nextjs: "Next.js",
  expo: "Expo",
  "react-native": "React Native",
};

export const PM_DISPLAY_NAMES: Record<PackageManager, string> = {
  npm: "npm",
  pnpm: "pnpm",
  bun: "bun",
  yarn: "yarn",
};

export const PROJECT_TYPE_LABELS: Record<ProjectType, string> = {
  frontend: "Frontend",
  mobile: "Mobile",
  none: "No project detected",
};
