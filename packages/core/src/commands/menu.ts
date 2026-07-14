import { isCancel, select } from "@clack/prompts";
import { Command } from "commander";
import pc from "picocolors";
import { calculateHealthScore } from "../detection/health.js";
import { detectProject } from "../detection/index.js";
import { printHealthScore, printProjectInfo } from "../utils/display.js";

export async function runMenu(): Promise<void> {
  const project = detectProject();

  console.clear();
  console.log(pc.bold(pc.cyan("\n  ╔══════════════════════════════════════╗")));
  console.log(pc.bold(pc.cyan("  ║     DKIT - Developer Productivity  ║")));
  console.log(pc.bold(pc.cyan("  ║            Toolkit v0.1.0          ║")));
  console.log(pc.bold(pc.cyan("  ╚══════════════════════════════════════╝")));
  console.log("");

  if (project.type !== "none") {
    printProjectInfo(project);
    const health = calculateHealthScore(project);
    printHealthScore(health);
  }

  const action = await select({
    message:
      project.type === "none"
        ? "No project detected. What do you want to do?"
        : "What do you want to do?",
    options: [
      ...(project.type === "none"
        ? [{ value: "create", label: "Create a new project" }]
        : [
            { value: "generate", label: "Generate code (component, page, hook, etc.)" },
            { value: "configure", label: "Configure tools for this project" },
          ]),
      { value: "doctor", label: "Run project health check" },
      { value: "clean", label: "Clean build artifacts" },
      { value: "update", label: "Update dependencies" },
      { value: "env", label: "Manage environment variables" },
      ...(project.mobile
        ? [{ value: "mobile", label: "Mobile commands (android, emulator, expo)" }]
        : []),
    ],
  });

  if (isCancel(action) || !action) {
    console.log(pc.yellow("\n  Goodbye!"));
    process.exit(0);
  }

  switch (action) {
    case "create": {
      const { createProject } = await import("./create.js");
      await createProject();
      break;
    }
    case "generate": {
      const { showGenerateMenu } = await import("./generate.js");
      await showGenerateMenu(project);
      break;
    }
    case "configure": {
      const { showConfigureMenu } = await import("./configure.js");
      await showConfigureMenu(project);
      break;
    }
    case "doctor": {
      const projectNow = detectProject();
      printProjectInfo(projectNow);
      const health = calculateHealthScore(projectNow);
      printHealthScore(health);
      break;
    }
    case "clean": {
      console.log(pc.dim("\n  Run `dkit clean` to clean build artifacts.\n"));
      break;
    }
    case "update": {
      console.log(pc.dim("\n  Run `dkit update` to update dependencies.\n"));
      break;
    }
    case "env": {
      const { showEnvMenu } = await import("./env.js");
      await showEnvMenu(project);
      break;
    }
    case "mobile": {
      console.log(pc.dim("\n  Use `dkit android`, `dkit emulator`, or `dkit expo` commands.\n"));
      break;
    }
  }
}

export function createMenuCommand(): Command {
  return new Command("menu")
    .description("Open interactive menu")
    .action(runMenu);
}
