import type {
  DetectedEnvironment,
  DetectedFramework,
  DetectedGit,
  DetectedMobile,
  DetectedTools,
  PackageManager,
  ProjectInfo,
  ProjectType,
} from "@dkit/shared";
import { EMPTY_GIT, EMPTY_MOBILE } from "@dkit/shared";
import { execSync } from "node:child_process";
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import process from "node:process";

function readJsonSafe(filePath: string): Record<string, unknown> | null {
  try {
    if (!existsSync(filePath)) return null;
    return JSON.parse(readFileSync(filePath, "utf-8"));
  } catch {
    return null;
  }
}

function detectPackageManager(rootPath: string): PackageManager {
  if (existsSync(join(rootPath, "pnpm-lock.yaml"))) return "pnpm";
  if (existsSync(join(rootPath, "bun.lock"))) return "bun";
  if (existsSync(join(rootPath, "yarn.lock"))) return "yarn";
  return "npm";
}

function detectFramework(
  pkg: Record<string, unknown>,
): DetectedFramework | null {
  const deps = {
    ...(pkg.dependencies as Record<string, string> | undefined),
    ...(pkg.devDependencies as Record<string, string> | undefined),
  };

  if (deps["next"]) return { name: "nextjs", version: deps["next"] };
  if (deps["expo"]) return { name: "expo", version: deps["expo"] };
  if (deps["react-native"])
    return { name: "react-native", version: deps["react-native"] };
  if (deps["react"]) return { name: "react", version: deps["react"] };

  return null;
}

function detectProjectType(
  framework: DetectedFramework | null,
  _rootPath: string,
): ProjectType {
  if (!framework) return "none";
  if (framework.name === "expo" || framework.name === "react-native")
    return "mobile";
  if (framework.name === "react" || framework.name === "nextjs")
    return "frontend";
  return "none";
}

function detectTools(
  pkg: Record<string, unknown>,
  rootPath: string,
): DetectedTools {
  const deps = {
    ...(pkg.dependencies as Record<string, string> | undefined),
    ...(pkg.devDependencies as Record<string, string> | undefined),
  };

  return {
    tailwind: !!deps["tailwindcss"],
    shadcn: existsSync(join(rootPath, "components.json")),
    eslint:
      !!deps["eslint"] ||
      existsSync(join(rootPath, ".eslintrc.js")) ||
      existsSync(join(rootPath, ".eslintrc.json")) ||
      existsSync(join(rootPath, ".eslintrc")),
    prettier: !!deps["prettier"] || existsSync(join(rootPath, ".prettierrc")),
    biome: !!deps["@biomejs/biome"] || existsSync(join(rootPath, "biome.json")),
    storybook:
      !!deps["@storybook/react"] ||
      !!deps["@storybook/nextjs"] ||
      existsSync(join(rootPath, ".storybook")),
    husky: !!deps["husky"] || existsSync(join(rootPath, ".husky")),
    commitlint:
      !!deps["@commitlint/cli"] ||
      existsSync(join(rootPath, "commitlint.config.js")),
    tanstackQuery: !!deps["@tanstack/react-query"],
    redux: !!deps["@reduxjs/toolkit"] || !!deps["react-redux"],
    zustand: !!deps["zustand"],
    jotai: !!deps["jotai"],
    firebase: !!deps["firebase"] || !!deps["firebase-admin"],
    supabase: !!deps["@supabase/supabase-js"],
    prisma: !!deps["prisma"] || !!deps["@prisma/client"],
    sentry: !!deps["@sentry/nextjs"] || !!deps["@sentry/react"],
    posthog: !!deps["posthog-js"],
    docker: existsSync(join(rootPath, "Dockerfile")),
    githubActions: existsSync(join(rootPath, ".github", "workflows")),
  };
}

function detectGit(rootPath: string): DetectedGit {
  const result = { ...EMPTY_GIT };
  try {
    execSync("git rev-parse --git-dir", { cwd: rootPath, stdio: "pipe" });
    result.initialized = true;
  } catch {
    return result;
  }

  try {
    result.branch = execSync("git branch --show-current", {
      cwd: rootPath,
      stdio: "pipe",
    })
      .toString()
      .trim();
  } catch {
    /* ignore */
  }

  try {
    const remotes = execSync("git remote -v", {
      cwd: rootPath,
      stdio: "pipe",
    }).toString();
    result.remote =
      remotes.split("\n")[0]?.split("\t")[1]?.split(" ")[0] ?? null;
  } catch {
    /* ignore */
  }

  try {
    const status = execSync("git status --porcelain", {
      cwd: rootPath,
      stdio: "pipe",
    }).toString();
    result.hasUncommittedChanges = status.trim().length > 0;
  } catch {
    /* ignore */
  }

  return result;
}

function detectEnvironment(rootPath: string): DetectedEnvironment {
  const envFiles = [
    ".env",
    ".env.local",
    ".env.development",
    ".env.production",
    ".env.staging",
  ].filter((f) => existsSync(join(rootPath, f)));

  return {
    hasEnv: envFiles.length > 0,
    envFiles,
  };
}

function detectMobile(
  rootPath: string,
  pkg: Record<string, unknown>,
): DetectedMobile | null {
  const deps = {
    ...(pkg.dependencies as Record<string, string> | undefined),
    ...(pkg.devDependencies as Record<string, string> | undefined),
  };

  const isMobile =
    !!deps["expo"] ||
    !!deps["react-native"] ||
    existsSync(join(rootPath, "app.json")) ||
    existsSync(join(rootPath, "app.config.ts")) ||
    existsSync(join(rootPath, "app.config.js"));

  if (!isMobile) return null;

  const result = { ...EMPTY_MOBILE };

  result.expoRouter = !!deps["expo-router"];
  result.reactNavigation = !!deps["@react-navigation/native"];

  try {
    result.androidSdk =
      !!process.env.ANDROID_HOME || existsSync("/usr/local/lib/android/sdk");
  } catch {
    /* ignore */
  }

  try {
    execSync("adb version", { stdio: "pipe" });
    result.adb = true;
  } catch {
    /* ignore */
  }

  try {
    execSync("java -version", { stdio: "pipe" });
    result.java = true;
  } catch {
    /* ignore */
  }

  try {
    result.pods = existsSync(join(rootPath, "ios", "Pods"));
  } catch {
    /* ignore */
  }

  try {
    execSync("xcodebuild -version", { stdio: "pipe" });
    result.xcode = true;
  } catch {
    /* ignore */
  }

  return result;
}

function detectStructure(rootPath: string): string[] {
  const structure: string[] = [];
  const dirs = [
    "src",
    "app",
    "pages",
    "components",
    "features",
    "lib",
    "utils",
    "hooks",
    "contexts",
    "stores",
    "services",
    "types",
    "constants",
    "assets",
    "public",
  ];
  for (const dir of dirs) {
    if (existsSync(join(rootPath, dir))) structure.push(dir);
  }
  return structure;
}

function detectTypeScript(
  pkg: Record<string, unknown>,
  rootPath: string,
): boolean {
  const deps = {
    ...(pkg.dependencies as Record<string, string> | undefined),
    ...(pkg.devDependencies as Record<string, string> | undefined),
  };
  return !!deps["typescript"] || existsSync(join(rootPath, "tsconfig.json"));
}

function getProjectName(pkg: Record<string, unknown>): string | null {
  return (pkg.name as string) ?? null;
}

export function detectProject(rootPath: string = process.cwd()): ProjectInfo {
  const pkg = readJsonSafe(join(rootPath, "package.json")) ?? {};
  const framework = detectFramework(pkg);
  const type = detectProjectType(framework, rootPath);

  return {
    type,
    name: getProjectName(pkg),
    rootPath,
    framework,
    packageManager: detectPackageManager(rootPath),
    hasTypeScript: detectTypeScript(pkg, rootPath),
    tools: detectTools(pkg, rootPath),
    environment: detectEnvironment(rootPath),
    git: detectGit(rootPath),
    mobile: detectMobile(rootPath, pkg),
    structure: detectStructure(rootPath),
  };
}
