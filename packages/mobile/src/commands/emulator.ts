import { Command } from "commander";
import { execSync } from "node:child_process";
import pc from "picocolors";
import ora from "ora";

export function createEmulatorCommand(): Command {
  const emulator = new Command("emulator").description("Emulator management");

  emulator
    .command("list")
    .description("List available emulators")
    .action(() => {
      const spinner = ora("Listing emulators...").start();
      try {
        const output = execSync("emulator -list-avds", { encoding: "utf-8" });
        spinner.stop();
        console.log(pc.cyan("\n  Available emulators:"));
        console.log(output || "  No emulators found.");
      } catch {
        spinner.fail(pc.red("Emulator not found. Is Android SDK installed?"));
      }
    });

  emulator
    .command("start <name>")
    .description("Start an emulator")
    .action((name: string) => {
      const spinner = ora(`Starting emulator ${name}...`).start();
      try {
        execSync(`emulator -avd ${name} &`, { stdio: "ignore" });
        spinner.succeed(pc.green(`Emulator ${name} started.`));
      } catch {
        spinner.fail(pc.red(`Failed to start emulator ${name}.`));
      }
    });

  emulator
    .command("stop")
    .description("Stop all running emulators")
    .action(() => {
      const spinner = ora("Stopping emulators...").start();
      try {
        execSync("adb emu kill", { encoding: "utf-8" });
        spinner.succeed(pc.green("Emulators stopped."));
      } catch {
        spinner.fail(pc.red("Failed to stop emulators."));
      }
    });

  return emulator;
}
