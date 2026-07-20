const icon = {
  success: "✔",
  warn: "⚠",
  error: "✖",
  info: "ℹ",
};

function colorize(text: string, color: string): string {
  const colors: Record<string, string> = {
    green: "\x1b[32m",
    yellow: "\x1b[33m",
    red: "\x1b[31m",
    blue: "\x1b[34m",
    cyan: "\x1b[36m",
    reset: "\x1b[0m",
    bold: "\x1b[1m",
  };
  return `${colors[color] || ""}${text}${colors.reset}`;
}

function formatMessage(label: string, msg: string, color: string): string {
  return `${colorize(icon.success, color)} ${colorize(label, color)} ${msg}`;
}

const REPO_URL = "https://github.com/FridsonFirmino/dkit-cli";

export const logger = {
  success: (msg: string) => console.log(formatMessage("SUCCESS", msg, "green")),
  warn: (msg: string) => console.log(formatMessage("WARN", msg, "yellow")),
  error: (msg: string) => console.log(formatMessage("ERROR", msg, "red")),
  info: (msg: string) => console.log(formatMessage("INFO", msg, "blue")),
  title: (msg: string) => console.log(`\n${colorize(msg, "bold")}\n`),
  fileCreated: (path: string) =>
    console.log(
      `${colorize(icon.success, "green")} ${colorize("Arquivo criado", "green")} ${path}`,
    ),
  dirCreated: (path: string) =>
    console.log(
      `${colorize(icon.success, "green")} ${colorize("Diretório criado", "green")} ${path}`,
    ),
  fileExists: (path: string) =>
    console.log(
      `${colorize(icon.warn, "yellow")} ${colorize("Arquivo já existe", "yellow")} ${path}`,
    ),
  errorMsg: (msg: string) =>
    console.log(
      `${colorize(icon.error, "red")} ${colorize("Erro", "red")} ${msg}`,
    ),
  header: (msg: string) =>
    console.log(
      `\n${colorize(msg, "cyan")}\n${colorize("─".repeat(msg.length), "cyan")}`,
    ),
  repo: () =>
    console.log(
      `\n${colorize("Repositorio:", "cyan")} ${colorize(REPO_URL, "blue")}`,
    ),
};
