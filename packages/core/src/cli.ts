#!/usr/bin/env node

import { Command } from "commander";
import { createCleanCommand } from "./commands/clean.js";
import { createDoctorCommand } from "./commands/doctor.js";
import { createUpdateCommand } from "./commands/update.js";
import { calculateHealthScore } from "./detection/health.js";
import { detectProject } from "./detection/index.js";
import { printHealthScore, printProjectInfo } from "./utils/display.js";

const program = new Command();

program
  .name("dkit")
  .description("DKIT CLI - Developer Productivity Toolkit by. Fridson Firmino")
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

program.parse();
