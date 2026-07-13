import { readFileSync, writeFileSync, existsSync, mkdirSync } from "node:fs";
import { join } from "node:path";
import { execSync } from "node:child_process";
import { select, isCancel, text, confirm } from "@clack/prompts";
import pc from "picocolors";
import ora from "ora";
import type { ProjectInfo } from "@dkit/shared";

function getPackageManagerCmd(project: ProjectInfo): string {
  switch (project.packageManager) {
    case "npm": return "npx";
    case "pnpm": return "pnpm dlx";
    case "bun": return "bunx";
    case "yarn": return "yarn dlx";
  }
}

async function configureTailwind(project: ProjectInfo) {
  const spinner = ora("Configuring Tailwind CSS...").start();
  try {
    const pm = getPackageManagerCmd(project);
    execSync(`${pm} tailwindcss init --ts`, { cwd: project.rootPath, stdio: "pipe" });
    execSync(`npm install tailwindcss @tailwindcss/postcss postcss autoprefixer`, {
      cwd: project.rootPath,
      stdio: "pipe",
    });
    const postcssContent = `export default {\n  plugins: {\n    tailwindcss: {},\n    autoprefixer: {},\n  },\n};\n`;
    writeFileSync(join(project.rootPath, "postcss.config.mjs"), postcssContent);
    spinner.succeed("Tailwind CSS configured.");
  } catch {
    spinner.fail("Failed to configure Tailwind.");
  }
}

async function configureESLint(project: ProjectInfo) {
  const spinner = ora("Configuring ESLint...").start();
  try {
    execSync(`npm install -D eslint @eslint/js typescript-eslint`, {
      cwd: project.rootPath,
      stdio: "pipe",
    });
    const eslintConfig = `import eslint from "@eslint/js";
import tseslint from "typescript-eslint";

export default tseslint.config(
  eslint.configs.recommended,
  ...tseslint.configs.recommended,
  {
    rules: {
      "@typescript-eslint/no-unused-vars": "warn",
    },
  },
);
`;
    writeFileSync(join(project.rootPath, "eslint.config.js"), eslintConfig);
    spinner.succeed("ESLint configured.");
  } catch {
    spinner.fail("Failed to configure ESLint.");
  }
}

async function configurePrettier(project: ProjectInfo) {
  const spinner = ora("Configuring Prettier...").start();
  try {
    execSync(`npm install -D prettier eslint-config-prettier`, {
      cwd: project.rootPath,
      stdio: "pipe",
    });
    const prettierConfig = `{\n  "semi": true,\n  "singleQuote": false,\n  "tabWidth": 2,\n  "trailingComma": "all",\n  "printWidth": 100\n}\n`;
    writeFileSync(join(project.rootPath, ".prettierrc"), prettierConfig);
    spinner.succeed("Prettier configured.");
  } catch {
    spinner.fail("Failed to configure Prettier.");
  }
}

async function configureHusky(project: ProjectInfo) {
  const spinner = ora("Configuring Husky...").start();
  try {
    execSync(`npm install -D husky lint-staged`, { cwd: project.rootPath, stdio: "pipe" });
    mkdirSync(join(project.rootPath, ".husky"), { recursive: true });
    const huskyHook = `npx lint-staged\n`;
    writeFileSync(join(project.rootPath, ".husky", "pre-commit"), huskyHook);
    execSync("git init", { cwd: project.rootPath, stdio: "pipe" });
    execSync("npx husky", { cwd: project.rootPath, stdio: "pipe" });
    const lintStaged = `{\n  "*.{ts,tsx,js,jsx}": ["eslint --fix", "prettier --write"]\n}\n`;
    const pkgPath = join(project.rootPath, "package.json");
    if (existsSync(pkgPath)) {
      const pkg = JSON.parse(readFileSync(pkgPath, "utf-8"));
      pkg["lint-staged"] = { "*.{ts,tsx,js,jsx}": ["eslint --fix", "prettier --write"] };
      writeFileSync(pkgPath, JSON.stringify(pkg, null, 2) + "\n");
    }
    spinner.succeed("Husky configured.");
  } catch {
    spinner.fail("Failed to configure Husky.");
  }
}

async function configureTanStackQuery(project: ProjectInfo) {
  const spinner = ora("Installing TanStack Query...").start();
  try {
    execSync(`npm install @tanstack/react-query`, { cwd: project.rootPath, stdio: "pipe" });
    spinner.succeed("TanStack Query installed.");
  } catch {
    spinner.fail("Failed to install TanStack Query.");
  }
}

async function configureZustand(project: ProjectInfo) {
  const spinner = ora("Installing Zustand...").start();
  try {
    execSync(`npm install zustand`, { cwd: project.rootPath, stdio: "pipe" });
    spinner.succeed("Zustand installed.");
  } catch {
    spinner.fail("Failed to install Zustand.");
  }
}

async function configureFirebase(project: ProjectInfo) {
  const spinner = ora("Installing Firebase...").start();
  try {
    execSync(`npm install firebase`, { cwd: project.rootPath, stdio: "pipe" });
    if (project.framework?.name === "nextjs") {
      execSync(`npm install firebase-admin`, { cwd: project.rootPath, stdio: "pipe" });
    }
    spinner.succeed("Firebase installed.");
  } catch {
    spinner.fail("Failed to install Firebase.");
  }
}

async function configureSupabase(project: ProjectInfo) {
  const spinner = ora("Installing Supabase...").start();
  try {
    execSync(`npm install @supabase/supabase-js @supabase/ssr`, {
      cwd: project.rootPath,
      stdio: "pipe",
    });
    spinner.succeed("Supabase installed.");
  } catch {
    spinner.fail("Failed to install Supabase.");
  }
}

export const CONFIGURERS: Record<string, (p: ProjectInfo) => Promise<void>> = {
  tailwind: configureTailwind,
  eslint: configureESLint,
  prettier: configurePrettier,
  husky: configureHusky,
  "tanstack-query": configureTanStackQuery,
  zustand: configureZustand,
  firebase: configureFirebase,
  supabase: configureSupabase,
};

export const CONFIGURABLE_TOOLS = [
  { value: "tailwind", label: "Tailwind CSS", installed: (p: ProjectInfo) => p.tools.tailwind },
  { value: "eslint", label: "ESLint", installed: (p: ProjectInfo) => p.tools.eslint },
  { value: "prettier", label: "Prettier", installed: (p: ProjectInfo) => p.tools.prettier },
  { value: "husky", label: "Husky", installed: (p: ProjectInfo) => p.tools.husky },
  { value: "tanstack-query", label: "TanStack Query", installed: (p: ProjectInfo) => p.tools.tanstackQuery },
  { value: "zustand", label: "Zustand", installed: (p: ProjectInfo) => p.tools.zustand },
  { value: "firebase", label: "Firebase", installed: (p: ProjectInfo) => p.tools.firebase },
  { value: "supabase", label: "Supabase", installed: (p: ProjectInfo) => p.tools.supabase },
];

export const showConfigureMenu = async (project: ProjectInfo): Promise<void> => {
  console.log("");
  console.log(pc.bold(pc.cyan("  Configure Tools")));
  console.log(pc.dim("  ──────────────────────────────"));

  const tool = (await select({
    message: "Which tool would you like to configure?",
    options: CONFIGURABLE_TOOLS.map((t) => ({
      value: t.value,
      label: `${t.label} ${t.installed(project) ? pc.green("(already installed)") : ""}`,
    })),
  })) as string;

  if (isCancel(tool)) return;

  const configurer = CONFIGURERS[tool];
  if (configurer) {
    await configurer(project);
  }
};
