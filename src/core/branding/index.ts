const c = {
  reset: "\x1b[0m",
  bold: "\x1b[1m",
  dim: "\x1b[2m",
  cyan: "\x1b[36m",
  green: "\x1b[32m",
  yellow: "\x1b[33m",
  blue: "\x1b[34m",
  magenta: "\x1b[35m",
  red: "\x1b[31m",
};

const colors = [c.cyan, c.green, c.yellow, c.blue, c.magenta];
const logo = [
  "╔══════════════════════════════════╗",
  "║           ⚡  dkit  ⚡           ║",
  "║   CLI de Automação para Frontend ║",
  "╚══════════════════════════════════╝",
];

function colorizeLogo(): string {
  return logo
    .map((line, i) => `${colors[i % colors.length] || c.cyan}${line}${c.reset}`)
    .join("\n");
}

export function showSplash(): void {
  console.log();
  console.log(colorizeLogo());
  console.log();
  console.log(`${c.bold}${c.cyan}dkit${c.reset} ${c.dim}v1.0.0${c.reset}`);
  console.log(
    `${c.dim}Automatize tarefas repetitivas em projetos frontend existentes${c.reset}`,
  );
  console.log();
  console.log(`${c.bold}Uso:${c.reset}`);
  console.log(
    `  ${c.cyan}dkit <comando>${c.reset} ${c.dim}[argumentos]${c.reset}`,
  );
  console.log();
  console.log(`${c.bold}Comandos:${c.reset}`);
  console.log(
    `  ${c.green}doctor${c.reset}        ${c.dim}Detecta e exibe informações do projeto${c.reset}`,
  );
  console.log(
    `  ${c.green}architecture${c.reset}   ${c.dim}Cria estrutura de diretórios baseada em arquitetura${c.reset}`,
  );
  console.log(
    `  ${c.green}context${c.reset}        ${c.dim}Cria context + provider + hook + types${c.reset}`,
  );
  console.log(
    `  ${c.green}provider${c.reset}       ${c.dim}Cria um provider component${c.reset}`,
  );
  console.log(
    `  ${c.green}hook${c.reset}           ${c.dim}Cria um custom hook${c.reset}`,
  );
  console.log(
    `  ${c.green}service${c.reset}        ${c.dim}Cria um service com CRUD${c.reset}`,
  );
  console.log(
    `  ${c.green}middleware${c.reset}     ${c.dim}Cria um middleware (Next.js)${c.reset}`,
  );
  console.log(
    `  ${c.green}feature${c.reset}        ${c.dim}Cria estrutura completa de feature${c.reset}`,
  );
  console.log();
  console.log(`${c.bold}Exemplos:${c.reset}`);
  console.log(`  ${c.dim}$ dkit doctor${c.reset}`);
  console.log(`  ${c.dim}$ dkit context Auth${c.reset}`);
  console.log(`  ${c.dim}$ dkit hook usePagination${c.reset}`);
  console.log(`  ${c.dim}$ dkit feature users${c.reset}`);
  console.log();
  console.log(`${c.cyan}Repositorio:${c.reset} ${c.blue}https://github.com/FridsonFirmino/dkit-cli${c.reset}`);
  console.log();
}
