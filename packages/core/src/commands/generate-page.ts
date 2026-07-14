import { text } from "@clack/prompts";
import { detectProject } from "../detection/index.js"
import { ensureDir, writeFile } from "../utils/fs.js";
import { toKebabCase, toPascalCase } from "@dkit/shared";
import { renderTemplate } from "@dkit/templates";
import { Command } from "commander";
import ora from "ora";
import pc from "picocolors";

export function createPageCommand(): Command {
  return new Command("page")
    .description("Generate a new page")
    .argument("[name]", "Page name")
    .option("--no-layout", "Skip layout file")
    .option("--no-loading", "Skip loading file")
    .option("--no-error", "Skip error file")
    .option("--actions", "Generate server actions file")
    .action(async (name: string | undefined, opts: Record<string, unknown>) => {
      const project = detectProject();

      if (!name) {
        name = (await text({
          message: "Page name?",
          validate: (v) => (v.length > 0 ? undefined : "Name is required"),
        })) as string;
      }

      if (typeof name !== "string" || name.length === 0) {
        console.log(pc.red("Page name is required."));
        return;
      }

      const pascalName = toPascalCase(name);
      const kebabName = toKebabCase(name);
      const isAppRouter = project.framework?.name === "nextjs";
      const pageDir = isAppRouter
        ? `src/app/${kebabName}`
        : `src/pages/${kebabName}`;

      const spinner = ora(`Generating ${pascalName} page...`);

      try {
        ensureDir(pageDir);

        const pageFile = isAppRouter ? "page.tsx" : `${kebabName}.tsx`;
        const pageTsx = renderTemplate("page", "page.tsx", { pascalName });
        writeFile(`${pageDir}/${pageFile}`, pageTsx);

        if (isAppRouter && opts.layout) {
          const layoutTsx = renderTemplate("page", "layout.tsx", { pascalName });
          writeFile(`${pageDir}/layout.tsx`, layoutTsx);
        }

        if (isAppRouter && opts.loading) {
          const loadingTsx = renderTemplate("page", "loading.tsx", { pascalName });
          writeFile(`${pageDir}/loading.tsx`, loadingTsx);
        }

        if (isAppRouter && opts.error) {
          const errorTsx = renderTemplate("page", "error.tsx", { pascalName });
          writeFile(`${pageDir}/error.tsx`, errorTsx);
        }

        if (opts.actions) {
          const camelName =
            toPascalCase(name).charAt(0).toLowerCase() +
            toPascalCase(name).slice(1);
          const actionsTs = renderTemplate("page", "actions.ts", {
            pascalName,
            camelName,
          });
          writeFile(`${pageDir}/actions.ts`, actionsTs);
        }

        spinner.succeed(
          pc.green(`Page ${pc.bold(pascalName)} created successfully!`),
        );
        console.log(pc.dim(`  Location: ${pageDir}/`));
      } catch (error) {
        spinner.fail(pc.red(`Failed to create page: ${error}`));
      }
    });
}
