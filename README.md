# DKIT CLI

**DKIT CLI** is a monorepo-based developer productivity toolkit for Frontend and Mobile projects. It provides project detection, health checks, cleanup utilities, dependency updates, and scaffolding commands for React/Next.js and React Native/Expo.

## Repository Overview

This repository is structured as a pnpm workspace with the following packages:

- `packages/core`: CLI infrastructure, project detection, health checks, cleanup, update commands, and cross-package utilities.
- `packages/shared`: Shared `TypeScript` types, schemas, naming helpers, and constants used across the monorepo.
- `packages/templates`: Handlebars template renderer, registered helpers, and scaffold template files.
- `packages/frontend`: Frontend generator commands for React/Next.js applications.
- `packages/mobile`: Mobile generator commands and environment tooling for Expo/React Native projects.

## Root Files

- `package.json`: monorepo root configuration.
  - Scripts:
    - `build`: runs `turbo run build`
    - `dev`: runs `turbo run dev`
    - `clean`: runs `turbo run clean`
    - `lint`: runs `turbo run lint`
    - `typecheck`: runs `turbo run typecheck`
    - `test`: runs `turbo run test`
    - `dkit`: runs the built CLI at `packages/core/dist/cli.js`
- `pnpm-workspace.yaml`: workspace packages include `packages/*`.
- `turbo.json`: task pipeline configuration for build, dev, clean, lint, typecheck, test.
- `tsconfig.json`: root TypeScript compiler options.

## Package Architecture

### `packages/core`

The core package is the main CLI engine.

#### Key files

- `src/cli.ts`
  - Defines `dkit` command using `commander`.
  - Adds subcommands: `detect`, `doctor`, `clean`, `update`, `health`.
  - Uses `detectProject` and `calculateHealthScore`.

- `src/index.ts`
  - Exports core utilities, detection, display, and command constructors.

- `src/commands/clean.ts`
  - Implements the `clean` command.
  - Determines directories to delete from current project root.
  - Supports `--all` to include `node_modules`.
  - Cleans standard build caches and folders.

- `src/commands/doctor.ts`
  - Implements `doctor` command.
  - Prints detected project info and health score.

- `src/commands/update.ts`
  - Implements `update` command.
  - Uses package manager detection to run `outdated` and optionally update dependencies.
  - Supports `--check` to only inspect outdated deps.
  - Handles npm, pnpm, bun, yarn.

- `src/detection/detector.ts`
  - `detectProject(rootPath)` inspects current directory.
  - Reads `package.json` safely.
  - Detects package manager by lockfile.
  - Detects framework from dependencies: `next`, `expo`, `react-native`, `react`.
  - Detects project type: `frontend`, `mobile`, `none`.
  - Detects tools and platform support by dependencies and config files:
    - Tailwind, Shadcn, ESLint, Prettier, Biome, Storybook, Husky, Commitlint, TanStack Query, Redux, Zustand, Jotai, Firebase, Supabase, Prisma, Sentry, PostHog, Docker, GitHub Actions.
  - Detects Git status, branch, remote, uncommitted changes.
  - Detects environment files.
  - Detects mobile environment specifics: Expo Router, React Navigation, Android SDK, adb, Java, CocoaPods, Xcode.
  - Detects project structure folders such as `src`, `app`, `pages`, `components`, `features`, `lib`, `hooks`, etc.
  - Detects TypeScript support via `typescript` dependency or `tsconfig.json`.

- `src/detection/health.ts`
  - Contains health checks used by `health` and `doctor`.
  - Checks include:
    - TypeScript
    - ESLint
    - Prettier
    - Husky
    - Git initialization
    - Tailwind (frontend only)
    - Storybook (frontend only)
    - Testing framework (always returns false)
    - TanStack Query
    - State management library
  - Builds a numeric score and recommendations list.

- `src/utils/display.ts`
  - Formats and prints detected project info.
  - Prints health score and checks with colored output.
  - Uses shared label mappings from `@dkit/shared`.

- `src/utils/fs.ts`
  - `ensureDir`, `writeFile`, `fileExists`, `readJson` helpers.

- `src/utils/process.ts`
  - `runCommand` wrapper.
  - `getInstallCommand` and `getRunCommand` for `npm`, `pnpm`, `bun`, `yarn`.

### `packages/shared`

Shared definitions for cross-package reuse.

#### Key files

- `src/types/index.ts`
  - Exposes all domain types, options, and interfaces.
  - Includes detection structures, generator option payloads, and project metadata types.

- `src/utils/schemas.ts`
  - Zod schemas matching the same option shapes for validation.
  - Includes schemas for generators and project configuration.

- `src/utils/naming.ts`
  - String utilities: `toPascalCase`, `toCamelCase`, `toKebabCase`, `toSnakeCase`, `capitalize`, `pluralize`.

- `src/constants/defaults.ts`
  - Default empty detection objects.
  - Display name maps for frameworks, package managers, and project types.

### `packages/templates`

Template rendering package.

#### Key files

- `src/index.ts`
  - Exports renderer and helpers.

- `src/helpers.ts`
  - Registers Handlebars helpers:
    - `toPascalCase`, `toCamelCase`, `toKebabCase`
    - `eq`, `neq`, `or`, `and`, `unless`

- `src/renderer.ts`
  - Loads templates from `packages/templates/templates`.
  - Caches compiled templates.
  - Exposes `renderTemplate(category, name, data)`.
  - Exposes `getTemplatePath`.

#### Templates present

- `component/`
  - `component.tsx.hbs`
  - `index.ts.hbs`
  - `story.tsx.hbs`
  - `test.tsx.hbs`
  - `types.ts.hbs`
- `page/`
  - `page.tsx.hbs`
  - `layout.tsx.hbs`
  - `loading.tsx.hbs`
  - `error.tsx.hbs`
  - `actions.ts.hbs`
- `context/`
  - `context.tsx.hbs`
- `hook/`
  - `hook.ts.hbs`
- `store/`
  - `redux.ts.hbs`
  - `zustand.ts.hbs`
- `crud/`
  - `api.ts.hbs`
  - `form.ts.hbs`
  - `hooks.ts.hbs`
  - `schema.ts.hbs`
  - `types.ts.hbs`

### `packages/frontend`

Frontend scaffolding commands.

#### Key files

- `src/index.ts`
  - Exports create command functions.

- `src/commands/index.ts`
  - Re-exports command builders.

- `src/commands/component.ts`
  - CLI command `component`.
  - Prompts for name and options.
  - Generates component folder and files using templates.
  - Creates `component.tsx`, `types.ts`, `index.ts`, and optionally test/story files.
  - Uses Tailwind, CSS Modules, or styled-components flags.

- `src/commands/page.ts`
  - CLI command `page`.
  - Detects Next.js App Router via `project.framework?.name ===
