import type { HealthCheck, HealthScoreResult, ProjectInfo } from "@dkit/shared";

function checkTypeScript(project: ProjectInfo): HealthCheck {
  return {
    name: "TypeScript",
    passed: project.hasTypeScript,
    message: project.hasTypeScript
      ? "TypeScript is configured"
      : "TypeScript is not configured",
  };
}

function checkESLint(project: ProjectInfo): HealthCheck {
  return {
    name: "ESLint",
    passed: project.tools.eslint,
    message: project.tools.eslint
      ? "ESLint is configured"
      : "ESLint is not configured",
  };
}

function checkPrettier(project: ProjectInfo): HealthCheck {
  return {
    name: "Prettier",
    passed: project.tools.prettier,
    message: project.tools.prettier
      ? "Prettier is configured"
      : "Prettier is not configured",
  };
}

function checkHusky(project: ProjectInfo): HealthCheck {
  return {
    name: "Husky",
    passed: project.tools.husky,
    warning: !project.tools.husky,
    message: project.tools.husky
      ? "Husky is configured"
      : "Husky is not configured",
  };
}

function checkGit(project: ProjectInfo): HealthCheck {
  return {
    name: "Git",
    passed: project.git.initialized,
    message: project.git.initialized
      ? "Git is initialized"
      : "Git is not initialized",
  };
}

function checkTailwind(project: ProjectInfo): HealthCheck {
  if (project.type !== "frontend") {
    return {
      name: "Tailwind",
      passed: true,
      message: "Not applicable for this project type",
    };
  }
  return {
    name: "Tailwind",
    passed: project.tools.tailwind,
    warning: !project.tools.tailwind,
    message: project.tools.tailwind
      ? "Tailwind CSS is configured"
      : "Tailwind CSS is not configured",
  };
}

function checkStorybook(project: ProjectInfo): HealthCheck {
  if (project.type !== "frontend") {
    return {
      name: "Storybook",
      passed: true,
      message: "Not applicable for this project type",
    };
  }
  return {
    name: "Storybook",
    passed: project.tools.storybook,
    warning: true,
    message: project.tools.storybook
      ? "Storybook is configured"
      : "Storybook is not configured",
  };
}

function checkTesting(_project: ProjectInfo): HealthCheck {
  return {
    name: "Testing",
    passed: false,
    warning: true,
    message: "No testing framework detected",
  };
}

function checkTanStackQuery(project: ProjectInfo): HealthCheck {
  return {
    name: "TanStack Query",
    passed: project.tools.tanstackQuery,
    warning: !project.tools.tanstackQuery,
    message: project.tools.tanstackQuery
      ? "TanStack Query is installed"
      : "TanStack Query is not installed",
  };
}

function checkStore(project: ProjectInfo): HealthCheck {
  const hasStore =
    project.tools.redux || project.tools.zustand || project.tools.jotai;
  return {
    name: "State Management",
    passed: hasStore,
    warning: !hasStore,
    message: hasStore
      ? `Using ${project.tools.redux ? "Redux" : project.tools.zustand ? "Zustand" : "Jotai"}`
      : "No state management library detected",
  };
}

const CHECKS = [
  checkTypeScript,
  checkESLint,
  checkPrettier,
  checkHusky,
  checkGit,
  checkTailwind,
  checkStorybook,
  checkTesting,
  checkTanStackQuery,
  checkStore,
];

export function calculateHealthScore(project: ProjectInfo): HealthScoreResult {
  const checks = CHECKS.map((checkFn) => checkFn(project));
  const passed = checks.filter((c) => c.passed).length;
  const maxScore = checks.length * 10;
  const score = Math.round((passed / checks.length) * maxScore);

  const recommendations: string[] = [];
  for (const check of checks) {
    if (!check.passed || check.warning) {
      recommendations.push(check.message);
    }
  }

  return { score, maxScore, checks, recommendations };
}
