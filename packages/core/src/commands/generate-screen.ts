import { text } from "@clack/prompts";
import { ensureDir, writeFile } from "../utils/fs.js";
import { toKebabCase, toPascalCase } from "@dkit/shared";
import { Command } from "commander";
import ora from "ora";
import pc from "picocolors";

export function createScreenCommand(): Command {
  return new Command("screen")
    .description("Generate a new mobile screen")
    .argument("[name]", "Screen name")
    .option("--type <type>", "Screen type (stack|tab|modal|drawer)", "stack")
    .option("--no-navigation", "Skip navigation setup")
    .action(async (name: string | undefined, opts: Record<string, unknown>) => {
      if (!name) {
        name = (await text({
          message: "Screen name?",
          validate: (v) => (v.length > 0 ? undefined : "Name is required"),
        })) as string;
      }

      if (typeof name !== "string" || name.length === 0) {
        console.log(pc.red("Screen name is required."));
        return;
      }

      const pascalName = toPascalCase(name);
      const kebabName = toKebabCase(name);
      const screensDir = "src/screens";
      const spinner = ora(`Generating ${pascalName} screen...`);

      try {
        ensureDir(screensDir);

        const screenContent = `import { View, Text, StyleSheet } from "react-native";

interface ${pascalName}Props {
  // Add props here
}

export function ${pascalName}({}: ${pascalName}Props) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>${pascalName}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
  },
});
`;

        writeFile(`${screensDir}/${kebabName}.tsx`, screenContent);

        if (opts.navigation) {
          const navigationContent = `import { ${pascalName} } from "./${kebabName}";

export const ${pascalName}Screen = {
  name: "${pascalName}",
  component: ${pascalName},
  options: {
    title: "${pascalName}",
  },
};
`;
          writeFile(
            `${screensDir}/${kebabName}.navigation.tsx`,
            navigationContent,
          );
        }

        spinner.succeed(
          pc.green(`Screen ${pc.bold(pascalName)} created successfully!`),
        );
        console.log(pc.dim(`  Location: ${screensDir}/${kebabName}.tsx`));
      } catch (error) {
        spinner.fail(pc.red(`Failed to create screen: ${error}`));
      }
    });
}
