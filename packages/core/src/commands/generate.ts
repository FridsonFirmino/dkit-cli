import { isCancel, select } from "@clack/prompts";
import pc from "picocolors";
import type { ProjectInfo } from "@dkit/shared";
import { detectProject } from "../detection/index.js";

export async function showGenerateMenu(project: ProjectInfo): Promise<void> {
  console.log("");
  console.log(pc.bold(pc.cyan("  Generate Code")));
  console.log(pc.dim("  ──────────────────────────────"));

  const options: { value: string; label: string }[] = [];

  if (project.type === "frontend" || project.type === "none") {
    options.push(
      { value: "component", label: "Component" },
      { value: "page", label: "Page (Next.js)" },
      { value: "hook", label: "Hook" },
      { value: "context", label: "Context" },
      { value: "store", label: "Store (Zustand/Redux/Jotai)" },
    );
  }

  if (project.type === "mobile" || project.type === "none") {
    options.push(
      { value: "screen", label: "Screen (React Native)" },
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

  switch (selection) {
    case "component":
      (await import("./generate-component.js")).createComponentCommand().parseAsync(["node", "dkit", "component"]);
      break;
    case "page":
      (await import("./generate-page.js")).createPageCommand().parseAsync(["node", "dkit", "page"]);
      break;
    case "hook":
      (await import("./generate-hook.js")).createHookCommand().parseAsync(["node", "dkit", "hook"]);
      break;
    case "context":
      (await import("./generate-context.js")).createContextCommand().parseAsync(["node", "dkit", "context"]);
      break;
    case "store":
      (await import("./generate-store.js")).createStoreCommand().parseAsync(["node", "dkit", "store"]);
      break;
    case "screen":
      (await import("./generate-screen.js")).createScreenCommand().parseAsync(["node", "dkit", "screen"]);
      break;
    default:
      console.log(pc.yellow(`  Unknown generator: ${selection}`));
  }
}

export async function runGenerateCLI(): Promise<void> {
  const project = detectProject();
  await showGenerateMenu(project);
}
