import { existsSync } from "node:fs";
import { join } from "node:path";
import { select, text, isCancel, confirm } from "@clack/prompts";
import pc from "picocolors";

function getPkgManager(): "pnpm" | "bun" | "npm" {
  if (existsSync(join(process.cwd(), "pnpm-lock.yaml"))) return "pnpm";
  if (existsSync(join(process.cwd(), "bun.lock"))) return "bun";
  return "npm";
}

function getCreateCommand(
  framework: string,
  name: string,
  pkgManager: string,
): string {
  const cmds: Record<string, string> = {
    react: `npm create vite@latest ${name} -- --template react-ts`,
    nextjs: `npx create-next-app@latest ${name} --ts --eslint --tailwind --src-dir --app --import-alias "@/*"`,
    expo: `npx create-expo-app@latest ${name}`,
  };

  let cmd = cmds[framework];
  if (!cmd) throw new Error(`Unknown framework: ${framework}`);

  if (pkgManager === "pnpm") {
    cmd = cmd.replace(/^npm create/, "pnpm create");
  }

  return cmd;
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

  const initGitRepo = (await confirm({
    message: "Initialize git with first commit?",
    initialValue: true,
  })) as boolean;

  const dir = join(process.cwd(), name);

  if (existsSync(dir)) {
    console.log(pc.red(`\n  Directory "${name}" already exists.`));
    process.exit(1);
  }

  const pkgManager = getPkgManager();
  const cmd = getCreateCommand(framework, name, pkgManager);

  console.log(pc.dim(`\n  Running: ${cmd}\n`));

  const { execSync } = await import("node:child_process");

  try {
    execSync(cmd, { stdio: "inherit" });
  } catch {
    process.exit(1);
  }

  if (initGitRepo && !existsSync(join(dir, ".git"))) {
    const spinner = (await import("ora")).default("Initializing git...").start();
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

  console.log(pc.green(`\n  ✓ Project "${name}" created successfully!\n`));
  console.log(pc.dim(`  cd ${name}`));
  console.log(pc.dim(`  ${pkgManager} run dev`));
  console.log("");
};
