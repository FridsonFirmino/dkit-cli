import Handlebars from "handlebars";

export function registerHelpers(): void {
  Handlebars.registerHelper("toPascalCase", (str: string) => {
    return str
      .replace(/[-_\s]+(.)?/g, (_, c: string | undefined) => (c ? c.toUpperCase() : ""))
      .replace(/^(.)/, (_, c: string) => c.toUpperCase());
  });

  Handlebars.registerHelper("toCamelCase", (str: string) => {
    const pascal = str
      .replace(/[-_\s]+(.)?/g, (_, c: string | undefined) => (c ? c.toUpperCase() : ""))
      .replace(/^(.)/, (_, c: string) => c.toUpperCase());
    return pascal.charAt(0).toLowerCase() + pascal.slice(1);
  });

  Handlebars.registerHelper("toKebabCase", (str: string) => {
    return str
      .replace(/([a-z])([A-Z])/g, "$1-$2")
      .replace(/[\s_]+/g, "-")
      .toLowerCase();
  });

  Handlebars.registerHelper("eq", (a: unknown, b: unknown) => a === b);

  Handlebars.registerHelper("neq", (a: unknown, b: unknown) => a !== b);

  Handlebars.registerHelper("or", function (this: unknown, ...args: unknown[]) {
    const options = args.pop() as Handlebars.HelperOptions;
    return args.some(Boolean) ? options.fn(this) : options.inverse(this);
  });

  Handlebars.registerHelper("and", function (this: unknown, ...args: unknown[]) {
    const options = args.pop() as Handlebars.HelperOptions;
    return args.every(Boolean) ? options.fn(this) : options.inverse(this);
  });

  Handlebars.registerHelper("unless", function (this: unknown, conditional: boolean, options: Handlebars.HelperOptions) {
    if (!conditional) {
      return options.fn(this);
    }
    return options.inverse(this);
  });
}
