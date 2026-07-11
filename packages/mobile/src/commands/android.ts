import { Command } from "commander";
import { execSync } from "node:child_process";
import pc from "picocolors";
import ora from "ora";

export function createAndroidCommand(): Command {
  const android = new Command("android").description("Android device management");

  android
    .command("devices")
    .description("List connected Android devices")
    .action(() => {
      const spinner = ora("Checking devices...").start();
      try {
        const output = execSync("adb devices", { encoding: "utf-8" });
        spinner.stop();
        console.log(pc.cyan("\n  Connected devices:"));
        console.log(output);
      } catch {
        spinner.fail(pc.red("adb not found. Is Android SDK installed?"));
      }
    });

  android
    .command("install <apk>")
    .description("Install APK on device")
    .action((apk: string) => {
      const spinner = ora(`Installing ${apk}...`).start();
      try {
        execSync(`adb install ${apk}`, { encoding: "utf-8" });
        spinner.succeed(pc.green(`Installed ${apk} successfully.`));
      } catch {
        spinner.fail(pc.red(`Failed to install ${apk}.`));
      }
    });

  android
    .command("uninstall <package>")
    .description("Uninstall app from device")
    .action((pkg: string) => {
      const spinner = ora(`Uninstalling ${pkg}...`).start();
      try {
        execSync(`adb uninstall ${pkg}`, { encoding: "utf-8" });
        spinner.succeed(pc.green(`Uninstalled ${pkg} successfully.`));
      } catch {
        spinner.fail(pc.red(`Failed to uninstall ${pkg}.`));
      }
    });

  android
    .command("logcat")
    .description("View device logs")
    .action(() => {
      try {
        execSync("adb logcat", { stdio: "inherit" });
      } catch {
        console.log(pc.red("adb not found. Is Android SDK installed?"));
      }
    });

  android
    .command("reverse <port>")
    .description("Reverse port forwarding")
    .action((port: string) => {
      const spinner = ora(`Reversing port ${port}...`).start();
      try {
        execSync(`adb reverse tcp:${port} tcp:${port}`, { encoding: "utf-8" });
        spinner.succeed(pc.green(`Port ${port} reversed successfully.`));
      } catch {
        spinner.fail(pc.red(`Failed to reverse port ${port}.`));
      }
    });

  return android;
}
