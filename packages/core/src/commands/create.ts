import { execSync } from "node:child_process";
import { existsSync } from "node:fs";
import { join } from "node:path";
import { select, text, isCancel, confirm } from "@clack/prompts";
import pc from "picocolors";
import ora from "ora";

interface CreateOptions {
  name: string;
  typescript: boolean;
  git: boolean;
}

async function createViteProject(dir: string, opts: CreateOptions) {
  const spinner = ora("Creating React project with Vite...").start();
  try {
    const template = opts.typescript ? "react-ts" : "react";
    execSync(
      `npm create vite@latest ${dir} -- --template ${template} ${opts.git ? "" : ""}`,
      { stdio: "pipe" },
    );
    spinner.succeed("React project created with Vite.");
  } catch {
    spinner.fail("Failed to create React project.");
    process.exit(1);
  }
}

async function createNextProject(dir: string, opts: CreateOptions) {
  const spinner = ora("Creating Next.js project...").start();
  try {
    const tsFlag = opts.typescript ? "--ts" : "--js";
    const gitFlag = opts.git ? "" : "--no-git";
    execSync(
      `npx create-next-app@latest ${dir} ${tsFlag} --eslint --tailwind --src-dir --app ${gitFlag} --import-alias "@/*" --use-npm`,
      { stdio: "pipe" },
    );
    spinner.succeed("Next.js project created.");
  } catch {
    spinner.fail("Failed to create Next.js project.");
    process.exit(1);
  }
}

async function createExpoProject(dir: string, _opts: CreateOptions) {
  const spinner = ora("Creating Expo project...").start();
  try {
    execSync(`npx create-expo-app@latest ${dir} --template blank-typescript`, {
      stdio: "pipe",
    });
    spinner.succeed("Expo project created.");
  } catch {
    spinner.fail("Failed to create Expo project.");
    process.exit(1);
  }
}

async function initGit(dir: string) {
  const spinner = ora("Initializing git...").start();
  try {
    execSync("git init", { cwd: dir, stdio: "pipe" });
    execSync('git add -A && git commit -m "chore: initial project setup"', {
      cwd: dir,
      stdio: "pipe",
    });
    spinner.succeed("Git initialized with initial commit.");
  } catch {
    spinner.fail("Failed to initialize git.");
  }
}

export const createProject = async (): Promise<void> => {
  console.log("");
  console.log(pc.bold(pc.cyan("  Create a New Project")));
  console.log(pc.dim("  ──────────────────────────────"));

  const name = (await text({
    message: "Project name?",
    validate: (v) => (v.length > 0 ? undefined : "Name is required"),
  })) as string;

  if (isCancel(name)) process.exit(0);

  const framework = (await select({
    message: "Framework?",
    options: [
      { value: "react", label: "React (Vite)" },
      { value: "nextjs", label: "Next.js" },
      { value: "expo", label: "Expo" },
    ],
  })) as string;

  if (isCancel(framework)) process.exit(0);

  const typescript = (await confirm({
    message: "Use TypeScript?",
    initialValue: true,
  })) as boolean;

  const initGitRepo = (await confirm({
    message: "Initialize git?",
    initialValue: true,
  })) as boolean;

  const dir = join(process.cwd(), name);

  if (existsSync(dir)) {
    console.log(pc.red(`\n  Directory "${name}" already exists.`));
    process.exit(1);
  }

  switch (framework) {
    case "react":
      await createViteProject(name, { name, typescript, git: initGitRepo });
      break;
    case "nextjs":
      await createNextProject(name, { name, typescript, git: initGitRepo });
      break;
    case "expo":
      await createExpoProject(name, { name, typescript, git: initGitRepo });
      break;
  }

  if (initGitRepo && !existsSync(join(dir, ".git"))) {
    await initGit(dir);
  }

  console.log(pc.green(`\n  ✓ Project "${name}" created successfully!\n`));
  console.log(pc.dim(`  cd ${name}`));
  if (framework !== "expo") {
    console.log(pc.dim("  npm run dev"));
  }
  console.log("");
};
