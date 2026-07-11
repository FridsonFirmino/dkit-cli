export { createCleanCommand } from "./commands/clean.js";
export { createDoctorCommand } from "./commands/doctor.js";
export { createUpdateCommand } from "./commands/update.js";
export { calculateHealthScore, detectProject } from "./detection/index.js";
export { printHealthScore, printProjectInfo } from "./utils/display.js";
export { ensureDir, fileExists, writeFile } from "./utils/fs.js";
export {
  getInstallCommand,
  getRunCommand,
  runCommand,
} from "./utils/process.js";
