import { Command } from "commander";
import { calculateHealthScore } from "../detection/health.js";
import { detectProject } from "../detection/index.js";
import { printHealthScore, printProjectInfo } from "../utils/display.js";

export function createDoctorCommand(): Command {
  return new Command("doctor")
    .description("Analyze project health and detect issues")
    .action(() => {
      const project = detectProject();
      printProjectInfo(project);
      const health = calculateHealthScore(project);
      printHealthScore(health);
    });
}
