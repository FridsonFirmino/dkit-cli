import { text } from "@clack/prompts";
import { ensureDir, writeFile } from "@dkit/core";
import { toCamelCase, toKebabCase, toPascalCase } from "@dkit/shared";
import { renderTemplate } from "@dkit/templates";
import { Command } from "commander";
import ora from "ora";
import pc from "picocolors";

export function createStoreCommand(): Command {
  return new Command("store")
    .description("Generate a new state store")
    .argument("[name]", "Store name")
    .option("--type <type>", "Store type (redux|zustand|jotai)", "zustand")
    .action(async (name: string | undefined, opts: Record<string, unknown>) => {
      if (!name) {
        name = (await text({
          message: "Store name?",
          validate: (v) => (v.length > 0 ? undefined : "Name is required"),
        })) as string;
      }

      if (typeof name !== "string" || name.length === 0) {
        console.log(pc.red("Store name is required."));
        return;
      }

      const storeType = opts.type as string;
      const pascalName = toPascalCase(name);
      const camelName = toCamelCase(name);
      const kebabName = toKebabCase(name);
      const storesDir = "src/stores";

      const spinner = ora(`Generating ${pascalName} store...`);

      try {
        ensureDir(storesDir);

        const templateName = storeType === "redux" ? "redux" : "zustand";
        const storeContent = renderTemplate("store", templateName, {
          pascalName,
          camelName,
          kebabName,
          fields: [],
        });

        const storeFile = `src/stores/${kebabName}.store.ts`;
        writeFile(storeFile, storeContent);

        spinner.succeed(
          pc.green(`Store ${pc.bold(pascalName)} created successfully!`),
        );
        console.log(pc.dim(`  Location: ${storeFile}`));
      } catch (error) {
        spinner.fail(pc.red(`Failed to create store: ${error}`));
      }
    });
}
