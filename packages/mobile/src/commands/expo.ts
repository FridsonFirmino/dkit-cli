import { detectProject } from "@dkit/core";
import { Command } from "commander";
import { execSync } from "node:child_process";
import ora from "ora";
import pc from "picocolors";

export function createExpoCommand(): Command {
  const expo = new Command("expo").description("Expo-specific commands");

  expo
    .command("prebuild")
    .description("Run expo prebuild")
    .action(() => {
      const project = detectProject();
      const spinner = ora("Running expo prebuild...").start();
      try {
        execSync("npx expo prebuild", { cwd: project.rootPath, stdio: "pipe" });
        spinner.succeed(pc.green("Prebuild completed successfully."));
      } catch {
        spinner.fail(pc.red("Prebuild failed."));
      }
    });

  expo
    .command("build")
    .description("Build the Expo project")
    .option("--platform <platform>", "Platform (android|ios|all)", "all")
    .action((opts: { platform: string }) => {
      const project = detectProject();
      const spinner = ora(`Building for ${opts.platform}...`).start();
      try {
        const cmd =
          opts.platform === "all"
            ? "npx expo build"
            : `npx expo build:${opts.platform}`;
        execSync(cmd, { cwd: project.rootPath, stdio: "pipe" });
        spinner.succeed(pc.green("Build completed successfully."));
      } catch {
        spinner.fail(pc.red("Build failed."));
      }
    });

  expo
    .command("submit")
    .description("Submit the Expo project")
    .option("--platform <platform>", "Platform (android|ios|all)", "all")
    .action((opts: { platform: string }) => {
      const project = detectProject();
      const spinner = ora(`Submitting for ${opts.platform}...`).start();
      try {
        const cmd =
          opts.platform === "all"
            ? "npx expo submit"
            : `npx expo submit --platform ${opts.platform}`;
        execSync(cmd, { cwd: project.rootPath, stdio: "pipe" });
        spinner.succeed(pc.green("Submit completed successfully."));
      } catch {
        spinner.fail(pc.red("Submit failed."));
      }
    });

  return expo;
}
