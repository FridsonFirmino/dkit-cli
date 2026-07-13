import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { select, isCancel } from "@clack/prompts";
import { Command } from "commander";
import pc from "picocolors";
import type { ProjectInfo } from "@dkit/shared";

function detectEnvFiles(root: string): string[] {
  return [".env", ".env.local", ".env.development", ".env.production", ".env.staging", ".env.test"]
    .filter((f) => existsSync(join(root, f)));
}

export async function createEnv(project: ProjectInfo) {
  const envPath = join(project.rootPath, ".env.local");
  if (existsSync(envPath)) {
    console.log(pc.yellow("\n  .env.local already exists."));
    return;
  }
  writeFileSync(envPath, "# Environment Variables\n# Add your variables here\n\n");
  console.log(pc.green("\n  ✓ .env.local created."));
}

export async function validateEnv(project: ProjectInfo) {
  const envFiles = detectEnvFiles(project.rootPath);
  if (envFiles.length === 0) {
    console.log(pc.yellow("\n  No .env files found."));
    return;
  }
  console.log(pc.cyan("\n  Environment files found:"));
  for (const f of envFiles) {
    const content = readFileSync(join(project.rootPath, f), "utf-8");
    const vars = content.split("\n").filter((l) => l.trim() && !l.startsWith("#"));
    const hasValues = vars.every((v) => v.includes("=") && v.split("=")[1]?.trim());
    console.log(`  ${hasValues ? pc.green("✓") : pc.yellow("⚠")} ${f} (${vars.length} variables)`);
  }
}

export async function switchEnv(project: ProjectInfo) {
  const env = await select({
    message: "Which environment?",
    options: [
      { value: "development", label: "Development" },
      { value: "staging", label: "Staging" },
      { value: "production", label: "Production" },
      { value: "test", label: "Test" },
    ],
  });
  if (isCancel(env)) return;

  const src = join(project.rootPath, `.env.${env}`);
  const dest = join(project.rootPath, ".env");

  if (!existsSync(src)) {
    console.log(pc.yellow(`\n  .env.${env} not found. Create one first.`));
    return;
  }

  writeFileSync(dest, readFileSync(src, "utf-8"));
  console.log(pc.green(`\n  ✓ Switched to ${env} environment.`));
}

export const showEnvMenu = async (project: ProjectInfo): Promise<void> => {
  console.log("");
  console.log(pc.bold(pc.cyan("  Environment Manager")));
  console.log(pc.dim("  ──────────────────────────────"));

  const action = await select({
    message: "What do you want to do?",
    options: [
      { value: "create", label: "Create .env.local" },
      { value: "validate", label: "Validate environment variables" },
      { value: "switch", label: "Switch environment" },
    ],
  });

  if (isCancel(action)) return;

  switch (action) {
    case "create":
      await createEnv(project);
      break;
    case "validate":
      await validateEnv(project);
      break;
    case "switch":
      await switchEnv(project);
      break;
  }
};

export function createEnvCommand(): Command {
  return new Command("env")
    .description("Manage environment variables")
    .addCommand(
      new Command("create")
        .description("Create .env.local file")
        .action(async () => {
          const { detectProject } = await import("../detection/index.js");
          await createEnv(detectProject());
        }),
    )
    .addCommand(
      new Command("validate")
        .description("Validate environment variables")
        .action(async () => {
          const { detectProject } = await import("../detection/index.js");
          await validateEnv(detectProject());
        }),
    )
    .addCommand(
      new Command("switch")
        .description("Switch between environments")
        .action(async () => {
          const { detectProject } = await import("../detection/index.js");
          await switchEnv(detectProject());
        }),
    );
}
