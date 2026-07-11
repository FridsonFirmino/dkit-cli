import type { HealthScoreResult, ProjectInfo } from "@dkit/shared";
import {
  FRAMEWORK_DISPLAY_NAMES,
  PM_DISPLAY_NAMES,
  PROJECT_TYPE_LABELS,
} from "@dkit/shared";
import pc from "picocolors";

export function printProjectInfo(project: ProjectInfo): void {
  console.log("");
  console.log(pc.bold(pc.cyan("  Project Detection Results")));
  console.log(pc.dim("  ─────────────────────────────────────"));
  console.log("");

  if (project.type === "none") {
    console.log(pc.yellow("  No project detected in the current directory."));
    console.log(pc.dim("  Run `dkit create` to scaffold a new project."));
    console.log("");
    return;
  }

  console.log(
    pc.green(`  ✓ Project detected: ${pc.bold(project.name ?? "unknown")}`),
  );
  console.log("");

  const frameworkLabel = project.framework
    ? `${FRAMEWORK_DISPLAY_NAMES[project.framework.name]} ${project.framework.version ?? ""}`
    : "None";
  const tsLabel = project.hasTypeScript ? pc.green("✓") : pc.red("✗");

  console.log(`  Framework............. ${frameworkLabel}`);
  console.log(`  TypeScript............ ${tsLabel}`);
  console.log(
    `  Package Manager....... ${PM_DISPLAY_NAMES[project.packageManager]}`,
  );
  console.log(`  Project Type.......... ${PROJECT_TYPE_LABELS[project.type]}`);
  console.log("");

  console.log(pc.dim("  Tools:"));
  const toolEntries: [string, boolean][] = [
    ["Tailwind", project.tools.tailwind],
    ["Shadcn", project.tools.shadcn],
    ["ESLint", project.tools.eslint],
    ["Prettier", project.tools.prettier],
    ["Biome", project.tools.biome],
    ["Storybook", project.tools.storybook],
    ["Husky", project.tools.husky],
    ["Commitlint", project.tools.commitlint],
    ["TanStack Query", project.tools.tanstackQuery],
    ["Redux", project.tools.redux],
    ["Zustand", project.tools.zustand],
    ["Firebase", project.tools.firebase],
    ["Supabase", project.tools.supabase],
    ["Prisma", project.tools.prisma],
    ["Sentry", project.tools.sentry],
    ["Docker", project.tools.docker],
    ["GitHub Actions", project.tools.githubActions],
  ];

  for (const [name, installed] of toolEntries) {
    if (installed) {
      console.log(`  ${name.padEnd(22)} ${pc.green("✓")}`);
    }
  }

  const notInstalled = toolEntries.filter(([, v]) => !v);
  if (notInstalled.length > 0) {
    console.log("");
    console.log(pc.dim("  Not installed:"));
    for (const [name] of notInstalled) {
      console.log(`  ${name.padEnd(22)} ${pc.red("✗")}`);
    }
  }

  console.log("");
}

export function printHealthScore(result: HealthScoreResult): void {
  console.log("");
  console.log(pc.bold(pc.cyan("  Project Health Score")));
  console.log(pc.dim("  ─────────────────────────────────────"));
  console.log("");

  const percentage = Math.round((result.score / result.maxScore) * 100);
  let scoreColor: (str: string) => string = pc.green;
  if (percentage < 60) scoreColor = pc.red;
  else if (percentage < 80) scoreColor = pc.yellow;

  console.log(
    `  ${scoreColor(pc.bold(`${result.score}/${result.maxScore}`))} (${percentage}%)`,
  );
  console.log("");

  for (const check of result.checks) {
    const icon = check.passed
      ? pc.green("✓")
      : check.warning
        ? pc.yellow("⚠")
        : pc.red("✗");
    console.log(`  ${icon} ${check.name.padEnd(22)} ${pc.dim(check.message)}`);
  }

  if (result.recommendations.length > 0) {
    console.log("");
    console.log(pc.bold(pc.cyan("  Recommendations:")));
    result.recommendations.forEach((rec, i) => {
      console.log(`  ${pc.dim(`${i + 1}.`)} ${rec}`);
    });
  }

  console.log("");
}
