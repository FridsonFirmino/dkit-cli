import { z } from "zod";

export const FrameworkSchema = z.enum(["react", "nextjs", "expo", "react-native"]);
export const PackageManagerSchema = z.enum(["npm", "pnpm", "bun", "yarn"]);
export const ProjectTypeSchema = z.enum(["frontend", "mobile", "none"]);

export const ComponentOptionsSchema = z.object({
  name: z.string().min(1),
  type: z.enum(["ui", "shared", "feature", "layout", "modal", "drawer"]),
  withTests: z.boolean().default(false),
  withStorybook: z.boolean().default(false),
  cssModule: z.boolean().default(false),
  tailwind: z.boolean().default(true),
  styledComponents: z.boolean().default(false),
});

export const PageOptionsSchema = z.object({
  name: z.string().min(1),
  withLayout: z.boolean().default(true),
  withLoading: z.boolean().default(true),
  withError: z.boolean().default(true),
  withActions: z.boolean().default(false),
});

export const HookOptionsSchema = z.object({
  name: z.string().min(1),
  type: z.enum(["fetch", "pagination", "theme", "debounce", "mediaQuery", "custom"]),
});

export const ContextOptionsSchema = z.object({
  name: z.string().min(1),
  type: z.enum(["theme", "auth", "user", "custom"]),
});

export const StoreOptionsSchema = z.object({
  name: z.string().min(1),
  type: z.enum(["redux", "zustand", "jotai"]),
});

export const CRUDFieldSchema = z.object({
  name: z.string().min(1),
  type: z.enum(["string", "number", "boolean", "date", "email", "image", "select"]),
  required: z.boolean().default(true),
  label: z.string().min(1),
  options: z.array(z.string()).optional(),
});

export const CRUDOptionsSchema = z.object({
  entity: z.string().min(1),
  fields: z.array(CRUDFieldSchema).min(1),
});

export const CreateProjectOptionsSchema = z.object({
  name: z.string().min(1),
  framework: FrameworkSchema,
  packageManager: PackageManagerSchema,
  typescript: z.boolean().default(true),
  tailwind: z.boolean().default(true),
  eslint: z.boolean().default(true),
  prettier: z.boolean().default(true),
  husky: z.boolean().default(false),
  biome: z.boolean().default(false),
  shadcn: z.boolean().default(false),
  storybook: z.boolean().default(false),
  tanstackQuery: z.boolean().default(false),
  redux: z.boolean().default(false),
  zustand: z.boolean().default(false),
  firebase: z.boolean().default(false),
  supabase: z.boolean().default(false),
  prisma: z.boolean().default(false),
  docker: z.boolean().default(false),
  githubActions: z.boolean().default(false),
});

export const ScreenOptionsSchema = z.object({
  name: z.string().min(1),
  type: z.enum(["stack", "tab", "modal", "drawer"]),
  withNavigation: z.boolean().default(true),
});
