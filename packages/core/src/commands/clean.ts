import { isCancel, select } from "@clack/prompts";
import { Command } from "commander";
import { existsSync, rmSync } from "node:fs";
import { join } from "node:path";
import ora from "ora";
import pc from "picocolors";
import { detectProject } from "../detection/index.js";
import type { ProjectInfo } from "@dkit/shared";

const CLEAN_DIRS = [
  "node_modules",
  ".next",
  "dist",
  "build",
  ".turbo",
  ".cache",
  "tmp",
  ".expo",
  "android/.gradle",
  "ios/build",
  "ios/Pods",
];

export async function promptClean(project: ProjectInfo) {
  const selection = await select({
    message: "What do you want to clean?",
    options: [
      {
        value: "safe",
        label: "Clean build artifacts (dist, .next, build, etc.)",
      },
      { value: "all", label: "Clean everything including node_modules" },
    ],
  });

  if (isCancel(selection)) return;

  const root = project.rootPath;
  const spinner = ora();

  const dirsToClean =
    selection === "all"
      ? CLEAN_DIRS
      : CLEAN_DIRS.filter((d) => d !== "node_modules");

  let cleaned = 0;
  for (const dir of dirsToClean) {
    const fullPath = join(root, dir);
    if (existsSync(fullPath)) {
      spinner.start(`Cleaning ${dir}...`);
      try {
        rmSync(fullPath, { recursive: true, force: true });
        spinner.succeed(`Cleaned ${pc.dim(dir)}`);
        cleaned++;
      } catch {
        spinner.fail(`Failed to clean ${pc.dim(dir)}`);
      }
    }
  }

  if (cleaned === 0) {
    console.log(pc.yellow("\n  Nothing to clean."));
  } else {
    console.log(pc.green(`\n  Cleaned ${cleaned} directories.`));
  }
}

export function createCleanCommand(): Command {
  return new Command("clean")
    .description("Clean build artifacts and caches")
    .option("--all", "Clean everything including node_modules")
    .action((options: { all?: boolean }) => {
      const project = detectProject();
      const root = project.rootPath;
      const spinner = ora();

      const dirsToClean = options.all
        ? CLEAN_DIRS
        : CLEAN_DIRS.filter((d) => d !== "node_modules");

      let cleaned = 0;
      for (const dir of dirsToClean) {
        const fullPath = join(root, dir);
        if (existsSync(fullPath)) {
          spinner.start(`Cleaning ${dir}...`);
          try {
            rmSync(fullPath, { recursive: true, force: true });
            spinner.succeed(`Cleaned ${pc.dim(dir)}`);
            cleaned++;
          } catch {
            spinner.fail(`Failed to clean ${pc.dim(dir)}`);
          }
        }
      }

      if (cleaned === 0) {
        console.log(pc.yellow("\n  Nothing to clean."));
      } else {
        console.log(pc.green(`\n  Cleaned ${cleaned} directories.`));
      }
    });
}
