import { Command } from "commander";
import { execSync } from "node:child_process";
import ora from "ora";
import { detectProject } from "../detection/index.js";

export function createUpdateCommand(): Command {
  return new Command("update")
    .description("Update project dependencies")
    .option("--check", "Only check for updates without installing")
    .action((options) => {
      const project = detectProject();
      const spinner = ora();

      spinner.start("Checking for outdated dependencies...");
      try {
        const cmd =
          project.packageManager === "npm"
            ? "npm outdated --json"
            : project.packageManager === "pnpm"
              ? "pnpm outdated --json"
              : project.packageManager === "bun"
                ? "bun outdated"
                : "yarn outdated";
        execSync(cmd, { cwd: project.rootPath, stdio: "pipe" });
        spinner.succeed("All dependencies are up to date.");
      } catch {
        spinner.info("Some dependencies are outdated.");
      }

      if (options.check) return;

      spinner.start("Updating dependencies...");
      try {
        const cmd =
          project.packageManager === "npm"
            ? "npm update"
            : project.packageManager === "pnpm"
              ? "pnpm update"
              : project.packageManager === "bun"
                ? "bun update"
                : "yarn upgrade";
        execSync(cmd, { cwd: project.rootPath, stdio: "pipe" });
        spinner.succeed("Dependencies updated successfully.");
      } catch {
        spinner.fail("Failed to update dependencies.");
      }
    });
}
