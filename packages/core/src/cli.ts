#!/usr/bin/env node

import { Command } from "commander";
import pc from "picocolors";
import {
  createCleanCommand,
  createDoctorCommand,
  createUpdateCommand,
} from "./commands/index.js";
import { calculateHealthScore } from "./detection/health.js";
import { detectProject } from "./detection/index.js";
import { printHealthScore, printProjectInfo } from "./utils/display.js";

async function main() {
  const program = new Command();

  program
    .name("dkit")
    .description(
      "Developer Productivity Toolkit\n" +
        "Automate repetitive tasks, standardize projects, and accelerate\n" +
        "environment setup for Frontend and Mobile development.\n" +
        `\n${pc.bold("Supported frameworks:")}\n` +
        "  React (Vite), Next.js, Expo, React Native CLI",
    )
    .version("0.1.0");

  program
    .command("detect")
    .description("Detect and display current project information")
    .action(() => {
      const project = detectProject();
      printProjectInfo(project);
    });

  program.addCommand(createDoctorCommand());
  program.addCommand(createCleanCommand());
  program.addCommand(createUpdateCommand());

  program
    .command("health")
    .description("Show project health score")
    .action(() => {
      const project = detectProject();
      const health = calculateHealthScore(project);
      printHealthScore(health);
    });

  program
    .command("generate")
    .description("Show code generation menu (components, pages, hooks, etc.)")
    .action(async () => {
      const { showGenerateMenu } = await import("./commands/generate.js");
      await showGenerateMenu(detectProject());
    });

  program
    .command("create")
    .description("Scaffold a new project (React, Next.js, Expo)")
    .action(async () => {
      const { createProject } = await import("./commands/create.js");
      await createProject();
    });

  program
    .command("configure")
    .description("Install and configure tools for the current project")
    .argument(
      "[tool]",
      "Tool to configure (tailwind, eslint, prettier, husky, tanstack-query, zustand, firebase, supabase)",
    )
    .action(async (tool: string | undefined) => {
      const { showConfigureMenu, CONFIGURERS } =
        await import("./commands/configure.js");
      const project = detectProject();
      if (tool && CONFIGURERS[tool]) {
        await CONFIGURERS[tool](project);
      } else if (tool) {
        console.log(pc.red(`Unknown tool: ${tool}`));
        console.log(
          pc.dim(`Available: ${Object.keys(CONFIGURERS).join(", ")}`),
        );
      } else {
        await showConfigureMenu(project);
      }
    });

  program
    .command("env")
    .description("Manage environment variables")
    .argument("[action]", "Action: create, validate, switch")
    .action(async (action: string | undefined) => {
      const { showEnvMenu, createEnv, validateEnv, switchEnv } =
        await import("./commands/env.js");
      const project = detectProject();
      if (!action) {
        await showEnvMenu(project);
        return;
      }
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
        default:
          console.log(pc.red(`Unknown action: ${action}`));
          console.log(pc.dim("Available: create, validate, switch"));
      }
    });

  program.on("--help", () => {
    console.log("");
    console.log(pc.bold("Examples:"));
    console.log("");
    console.log(
      `  ${pc.cyan("$ dkit")}                        Open interactive menu`,
    );
    console.log(
      `  ${pc.cyan("$ dkit detect")}                  Detect current project`,
    );
    console.log(
      `  ${pc.cyan("$ dkit doctor")}                  Full health check`,
    );
    console.log(
      `  ${pc.cyan("$ dkit create")}                  Create new project`,
    );
    console.log(
      `  ${pc.cyan("$ dkit configure")}               Configure tools`,
    );
    console.log(
      `  ${pc.cyan("$ dkit configure tailwind")}      Configure Tailwind CSS`,
    );
    console.log(
      `  ${pc.cyan("$ dkit clean")}                   Clean build artifacts`,
    );
    console.log(
      `  ${pc.cyan("$ dkit clean --all")}             Clean everything`,
    );
    console.log(
      `  ${pc.cyan("$ dkit update")}                  Update dependencies`,
    );
    console.log(
      `  ${pc.cyan("$ dkit generate")}                Show code generation menu`,
    );
    console.log(
      `  ${pc.cyan("$ dkit env create")}              Create .env.local`,
    );
    console.log(
      `  ${pc.cyan("$ dkit env validate")}            Validate .env files`,
    );
    console.log(
      `  ${pc.cyan("$ dkit env switch")}              Switch environment`,
    );
    console.log("");
    console.log(pc.dim("  Documentation: github.com/fridsonfirmino/dkit-cli"));
    console.log("");
  });

  if (process.argv.length <= 2) {
    const { runMenu } = await import("./commands/menu.js");
    await runMenu();
  } else {
    program.parse();
  }
}

main();
