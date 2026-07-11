import type { PackageManager } from "@dkit/shared";
import { execSync } from "node:child_process";

export function runCommand(
  command: string,
  options: { cwd?: string; stdio?: "pipe" | "inherit" } = {},
): string {
  try {
    return execSync(command, {
      cwd: options.cwd ?? process.cwd(),
      stdio: options.stdio ?? "pipe",
      encoding: "utf-8",
    }).trim();
  } catch (error) {
    throw new Error(`Command failed: ${command}`);
  }
}

export function getInstallCommand(
  pm: PackageManager,
  deps: string[],
  dev = false,
): string {
  const flag = dev ? " -D" : "";
  switch (pm) {
    case "npm":
      return `npm install${flag} ${deps.join(" ")}`;
    case "pnpm":
      return `pnpm add${dev ? " -D" : ""} ${deps.join(" ")}`;
    case "bun":
      return `bun add${dev ? " -d" : ""} ${deps.join(" ")}`;
    case "yarn":
      return `yarn add${dev ? " -D" : ""} ${deps.join(" ")}`;
  }
}

export function getRunCommand(pm: PackageManager, script: string): string {
  switch (pm) {
    case "npm":
      return `npm run ${script}`;
    case "pnpm":
      return `pnpm ${script}`;
    case "bun":
      return `bun run ${script}`;
    case "yarn":
      return `yarn ${script}`;
  }
}
