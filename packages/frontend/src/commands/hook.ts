import { text } from "@clack/prompts";
import { ensureDir, writeFile } from "@dkit/core";
import { toPascalCase } from "@dkit/shared";
import { renderTemplate } from "@dkit/templates";
import { Command } from "commander";
import ora from "ora";
import pc from "picocolors";

export function createHookCommand(): Command {
  return new Command("hook")
    .description("Generate a new hook")
    .argument("[name]", "Hook name")
    .option(
      "--type <type>",
      "Hook type (fetch|pagination|theme|debounce|mediaQuery|custom)",
      "custom",
    )
    .action(async (name: string | undefined, opts: Record<string, unknown>) => {
      if (!name) {
        name = (await text({
          message: "Hook name (without use prefix)?",
          validate: (v) => (v.length > 0 ? undefined : "Name is required"),
        })) as string;
      }

      if (typeof name !== "string" || name.length === 0) {
        console.log(pc.red("Hook name is required."));
        return;
      }

      const hookName = name.startsWith("use") ? name.slice(3) : name;
      const pascalName = toPascalCase(hookName);
      const hooksDir = "src/hooks";
      const hookFile = `src/hooks/use${pascalName}.ts`;

      const spinner = ora(`Generating use${pascalName} hook...`);

      try {
        ensureDir(hooksDir);

        const hookContent = renderTemplate("hook", "hook", {
          pascalName,
          type: opts.type,
        });

        writeFile(hookFile, hookContent);

        spinner.succeed(
          pc.green(`Hook ${pc.bold(`use${pascalName}`)} created successfully!`),
        );
        console.log(pc.dim(`  Location: ${hookFile}`));
      } catch (error) {
        spinner.fail(pc.red(`Failed to create hook: ${error}`));
      }
    });
}
