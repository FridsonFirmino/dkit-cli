import { text } from "@clack/prompts";
import { detectProject } from "../detection/index.js"
import { ensureDir, writeFile } from "../utils/fs.js";
import { toKebabCase, toPascalCase } from "@dkit/shared";
import { renderTemplate } from "@dkit/templates";
import { Command } from "commander";
import ora from "ora";
import pc from "picocolors";

export function createComponentCommand(): Command {
  return new Command("component")
    .description("Generate a new component")
    .argument("[name]", "Component name")
    .option(
      "--type <type>",
      "Component type (ui|shared|feature|layout|modal|drawer)",
      "ui",
    )
    .option("--no-tests", "Skip test file generation")
    .option("--no-storybook", "Skip Storybook story generation")
    .option("--tailwind", "Use Tailwind CSS", true)
    .option("--css-module", "Use CSS Modules")
    .option("--styled-components", "Use Styled Components")
    .action(async (name: string | undefined, opts: Record<string, unknown>) => {
      const project = detectProject();

      if (!name) {
        name = (await text({
          message: "Component name?",
          validate: (v) => (v.length > 0 ? undefined : "Name is required"),
        })) as string;
      }

      if (typeof name !== "string" || name.length === 0) {
        console.log(pc.red("Component name is required."));
        return;
      }

      const pascalName = toPascalCase(name);
      const kebabName = toKebabCase(name);
      const componentDir = `src/components/${kebabName}`;

      const spinner = ora(`Generating ${pascalName} component...`);

      try {
        ensureDir(componentDir);

        const componentTsx = renderTemplate("component", "component.tsx", {
          name: kebabName,
          pascalName,
          tailwind: opts.tailwind,
          styledComponents: opts.styledComponents,
          cssModule: opts.cssModule,
          shadcn: project.tools.shadcn,
        });

        const typesTs = renderTemplate("component", "types.ts", {
          pascalName,
          styledComponents: opts.styledComponents,
          cssModule: opts.cssModule,
        });

        const indexTs = renderTemplate("component", "index.ts", {
          name: kebabName,
          pascalName,
        });

        writeFile(`${componentDir}/${kebabName}.tsx`, componentTsx);
        writeFile(`${componentDir}/types.ts`, typesTs);
        writeFile(`${componentDir}/index.ts`, indexTs);

        if (opts.tests) {
          const testTsx = renderTemplate("component", "test.tsx", {
            name: kebabName,
            pascalName,
          });
          writeFile(`${componentDir}/${kebabName}.test.tsx`, testTsx);
        }

        if (opts.storybook) {
          const storyTsx = renderTemplate("component", "story.tsx", {
            name: kebabName,
            pascalName,
          });
          writeFile(`${componentDir}/${kebabName}.stories.tsx`, storyTsx);
        }

        spinner.succeed(
          pc.green(`Component ${pc.bold(pascalName)} created successfully!`),
        );
        console.log(pc.dim(`  Location: ${componentDir}/`));
      } catch (error) {
        spinner.fail(pc.red(`Failed to create component: ${error}`));
      }
    });
}
