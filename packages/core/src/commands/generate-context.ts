import { text } from "@clack/prompts";
import { ensureDir, writeFile } from "../utils/fs.js";
import { toPascalCase } from "@dkit/shared";
import { renderTemplate } from "@dkit/templates";
import { Command } from "commander";
import ora from "ora";
import pc from "picocolors";

export function createContextCommand(): Command {
  return new Command("context")
    .description("Generate a new context provider")
    .argument("[name]", "Context name")
    .option("--type <type>", "Context type (theme|auth|user|custom)", "custom")
    .action(async (name: string | undefined, opts: Record<string, unknown>) => {
      if (!name) {
        name = (await text({
          message: "Context name (without Context suffix)?",
          validate: (v) => (v.length > 0 ? undefined : "Name is required"),
        })) as string;
      }

      if (typeof name !== "string" || name.length === 0) {
        console.log(pc.red("Context name is required."));
        return;
      }

      const contextName = name.replace(/Context$/, "");
      const pascalName = toPascalCase(contextName);
      const contextsDir = "src/contexts";
      const contextFile = `src/contexts/${pascalName}Context.tsx`;

      const spinner = ora(`Generating ${pascalName}Context...`);

      try {
        ensureDir(contextsDir);

        const contextContent = renderTemplate("context", "context.tsx", {
          pascalName,
          type: opts.type,
        });

        writeFile(contextFile, contextContent);

        spinner.succeed(
          pc.green(
            `Context ${pc.bold(`${pascalName}Context`)} created successfully!`,
          ),
        );
        console.log(pc.dim(`  Location: ${contextFile}`));
      } catch (error) {
        spinner.fail(pc.red(`Failed to create context: ${error}`));
      }
    });
}
