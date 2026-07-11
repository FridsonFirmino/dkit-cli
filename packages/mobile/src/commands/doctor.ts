import { Command } from "commander";
import { execSync } from "node:child_process";
import pc from "picocolors";
import ora from "ora";

export function createMobileDoctorCommand(): Command {
  return new Command("doctor")
    .description("Check mobile development environment")
    .action(() => {
      console.log(pc.bold(pc.cyan("\n  Mobile Environment Check\n")));

      const checks: [string, string][] = [
        ["Node.js", "node --version"],
        ["Java", "java -version"],
        ["Android SDK", "echo $ANDROID_HOME"],
        ["adb", "adb version"],
        ["Gradle", "gradle --version"],
        ["Watchman", "watchman version"],
        ["Expo CLI", "npx expo --version"],
        ["CocoaPods", "pod --version"],
        ["Xcode", "xcodebuild -version"],
      ];

      for (const [name, cmd] of checks) {
        const spinner = ora(`  Checking ${name}...`).start();
        try {
          const output = execSync(cmd, { encoding: "utf-8", stdio: "pipe" }).trim();
          spinner.succeed(`  ${pc.green("✓")} ${name.padEnd(20)} ${pc.dim(output.split("\n")[0])}`);
        } catch {
          spinner.fail(`  ${pc.red("✗")} ${name.padEnd(20)} ${pc.dim("Not found")}`);
        }
      }

      console.log("");
    });
}
