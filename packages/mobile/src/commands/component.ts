import { Command } from "commander";
import { text } from "@clack/prompts";
import pc from "picocolors";
import ora from "ora";
import { toPascalCase, toKebabCase } from "@dkit/shared";
import { ensureDir, writeFile } from "@dkit/core";

export function createMobileComponentCommand(): Command {
  return new Command("component")
    .description("Generate a new mobile component")
    .argument("[name]", "Component name")
    .action(async (name: string | undefined) => {
      if (!name) {
        name = await text({
          message: "Component name?",
          validate: (v) => (v.length > 0 ? undefined : "Name is required"),
        }) as string;
      }

      if (typeof name !== "string" || name.length === 0) {
        console.log(pc.red("Component name is required."));
        return;
      }

      const pascalName = toPascalCase(name);
      const kebabName = toKebabCase(name);
      const componentsDir = "src/components";
      const spinner = ora(`Generating ${pascalName} component...`);

      try {
        ensureDir(componentsDir);

        const componentContent = `import { View, Text, StyleSheet } from "react-native";

interface ${pascalName}Props {
  // Add props here
}

export function ${pascalName}({}: ${pascalName}Props) {
  return (
    <View style={styles.container}>
      <Text>${pascalName}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {},
});
`;

        writeFile(`${componentsDir}/${kebabName}.tsx`, componentContent);
        writeFile(`${componentsDir}/${kebabName}/index.ts`, `export { ${pascalName} } from "./${kebabName}";\n`);

        spinner.succeed(pc.green(`Component ${pc.bold(pascalName)} created successfully!`));
        console.log(pc.dim(`  Location: ${componentsDir}/${kebabName}.tsx`));
      } catch (error) {
        spinner.fail(pc.red(`Failed to create component: ${error}`));
      }
    });
}
