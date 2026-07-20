import { Command } from "commander";
import { handleArchitecture } from "./commands/architecture/handler";
import { handleContext } from "./commands/context/handler";
import { handleDoctor } from "./commands/doctor/handler";
import { handleFeature } from "./commands/feature/handler";
import { handleHook } from "./commands/hook/handler";
import { handleMiddleware } from "./commands/middleware/handler";
import { handleProvider } from "./commands/provider/handler";
import { handleService } from "./commands/service/handler";
import { detectProject } from "./core/detector";

const c = {
  reset: "\x1b[0m",
  bold: "\x1b[1m",
  dim: "\x1b[2m",
  cyan: "\x1b[36m",
  green: "\x1b[32m",
  yellow: "\x1b[33m",
  blue: "\x1b[34m",
  magenta: "\x1b[35m",
};

const program = new Command();

program
  .name("dkit")
  .description(
    `${c.cyan}${c.bold}dkit${c.reset}${c.dim} v1.0.0 - CLI de Automação para Frontend${c.reset}`,
  )
  .version("1.0.0")
  .addHelpText(
    "before",
    `\n \x1b[36m╔══════════════════════════════════╗\x1b[0m
 \x1b[36m║\x1b[0m             \x1b[1m\x1b[36m⚡  dkit\x1b[0m             \x1b[36m║\x1b[0m
 \x1b[36m║\x1b[0m   \x1b[2mCLI de Automação para Frontend\x1b[0m \x1b[36m║\x1b[0m
 \x1b[36m╚══════════════════════════════════╝\x1b[0m\n`,
  )
  .addHelpText(
    "after",
    `\n ${c.dim}Exemplos:${c.reset}
   $ ${c.cyan}dkit doctor${c.reset}
   $ ${c.cyan}dkit context Auth${c.reset}
   $ ${c.cyan}dkit hook usePagination${c.reset}
   $ ${c.cyan}dkit feature users${c.reset}\n`,
  );

program
  .command("doctor")
  .description("Detecta e exibe informações do projeto")
  .action(() => {
    const info = detectProject();
    handleDoctor(info);
  });

program
  .command("architecture")
  .description("Cria estrutura de diretórios baseada em uma arquitetura")
  .action(() => {
    const info = detectProject();
    handleArchitecture(info);
  });

program
  .command("feature")
  .description("Cria uma nova feature com estrutura completa")
  .argument("<name>", "nome da feature")
  .action((name: string) => {
    const info = detectProject();
    handleFeature(info, name);
  });

program
  .command("context")
  .description("Cria um context com provider, hook, types e index")
  .argument("<name>", "nome do context")
  .action((name: string) => {
    const info = detectProject();
    handleContext(info, name);
  });

program
  .command("provider")
  .description("Cria um provider component")
  .argument("<name>", "nome do provider")
  .action((name: string) => {
    const info = detectProject();
    handleProvider(info, name);
  });

program
  .command("hook")
  .description("Cria um custom hook")
  .argument("<name>", "nome do hook (ex: usePagination)")
  .action((name: string) => {
    const info = detectProject();
    handleHook(info, name);
  });

program
  .command("service")
  .description("Cria um service")
  .argument("<name>", "nome do service")
  .action((name: string) => {
    const info = detectProject();
    handleService(info, name);
  });

program
  .command("middleware")
  .description("Cria um middleware (Next.js)")
  .argument("<name>", "nome do middleware")
  .action((name: string) => {
    const info = detectProject();
    handleMiddleware(info, name);
  });

export { program };
