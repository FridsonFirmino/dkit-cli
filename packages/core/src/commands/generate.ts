import { select, isCancel } from "@clack/prompts";
import { Command } from "commander";
import pc from "picocolors";
import type { ProjectInfo } from "@dkit/shared";

export const showGenerateMenu = async (project: ProjectInfo): Promise<void> => {
  console.log("");
  console.log(pc.bold(pc.cyan("  Generate Code")));
  console.log(pc.dim("  ──────────────────────────────"));

  const options: { value: string; label: string; hint: string }[] = [];

  if (project.type === "frontend" || project.type === "none") {
    options.push(
      { value: "component", label: "Component", hint: "dkit component" },
      { value: "page", label: "Page (Next.js)", hint: "dkit page" },
      { value: "hook", label: "Hook", hint: "dkit hook" },
      { value: "context", label: "Context", hint: "dkit context" },
      { value: "store", label: "Store (Zustand/Redux/Jotai)", hint: "dkit store" },
    );
  }

  if (project.type === "mobile" || project.type === "none") {
    options.push(
      { value: "screen", label: "Screen (React Native)", hint: "dkit screen" },
    );
  }

  if (options.length === 0) {
    console.log(pc.yellow("  No generators available for this project type."));
    return;
  }

  const selection = (await select({
    message: "What do you want to generate?",
    options,
  })) as string;

  if (isCancel(selection)) return;

  const cmd = options.find((o) => o.value === selection)?.hint ?? "";
  console.log(pc.dim(`\n  Run: ${pc.bold(cmd)}\n`));
};

export function createGenerateCommand(): Command {
  return new Command("generate")
    .description("Generate code (components, pages, hooks, contexts, stores)")
    .action(async () => {
      const { detectProject } = await import("../detection/index.js");
      await showGenerateMenu(detectProject());
    });
}
