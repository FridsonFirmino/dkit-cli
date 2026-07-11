import Handlebars from "handlebars";
import { readFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { registerHelpers } from "./helpers.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const TEMPLATES_DIR = join(__dirname, "..", "templates");

registerHelpers();

const templateCache = new Map<string, HandlebarsTemplateDelegate>();

function loadTemplate(category: string, name: string): HandlebarsTemplateDelegate {
  const key = `${category}/${name}`;
  if (templateCache.has(key)) {
    return templateCache.get(key)!;
  }
  const templatePath = join(TEMPLATES_DIR, category, `${name}.hbs`);
  const source = readFileSync(templatePath, "utf-8");
  const compiled = Handlebars.compile(source);
  templateCache.set(key, compiled);
  return compiled;
}

export function renderTemplate(category: string, name: string, data: Record<string, unknown>): string {
  const template = loadTemplate(category, name);
  return template(data);
}

export function getTemplatePath(category: string, name: string): string {
  return join(TEMPLATES_DIR, category, `${name}.hbs`);
}

export { Handlebars };
