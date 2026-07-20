<div align="center">
  <pre>
╔══════════════════════════════════╗
║           ⚡  dkit  ⚡           ║
║   CLI de Automação para Frontend ║
╚══════════════════════════════════╝
  </pre>
  <p><strong>dkit</strong> — CLI moderna para automatizar tarefas repetitivas em projetos frontend existentes.</p>
</div>

---

## Uso

```bash
bun install
```

```bash
bun link
```

Agora `dkit` estará disponível globalmente.

```bash
dkit doctor
```

### Comandos

| Comando                  | Descrição                                           |
| ------------------------ | --------------------------------------------------- |
| `dkit doctor`            | Detecta e exibe informações do projeto              |
| `dkit architecture`      | Cria estrutura de diretórios baseada em arquitetura |
| `dkit context <name>`    | Cria context + provider + hook + types + index      |
| `dkit provider <name>`   | Cria um provider component                          |
| `dkit hook <name>`       | Cria um custom hook                                 |
| `dkit service <name>`    | Cria um service com CRUD                            |
| `dkit middleware <name>` | Cria um middleware (Next.js)                        |
| `dkit feature <name>`    | Cria estrutura completa de feature                  |

### Exemplos

```bash
dkit doctor
dkit context Auth
dkit hook usePagination
dkit feature users
dkit service user
dkit provider Theme
dkit middleware auth
dkit architecture
```

---

## Desenvolvimento

### Stack

- **Runtime:** Bun
- **Linguagem:** TypeScript (strict)
- **CLI Parser:** Commander
- **Prompts:** @clack/prompts

### Scripts

```bash
bun run dev          # executa a CLI em modo dev
bun run build        # compila para ./dist
bun run typecheck    # verifica tipos
bun run lint         # alias para typecheck
```

### Estrutura do projeto

```
src/
├── cli.ts                        # registra comandos no Commander
├── index.ts                      # entry point
├── commands/                     # cada comando em seu diretório
│   ├── doctor/handler.ts
│   ├── architecture/handler.ts
│   ├── context/{handler,templates}.ts
│   ├── provider/{handler,templates}.ts
│   ├── hook/{handler,templates}.ts
│   ├── service/{handler,templates}.ts
│   ├── middleware/{handler,templates}.ts
│   └── feature/handler.ts
├── core/                         # módulos fundamentais
│   ├── logger/                   # logger com cores e ícones
│   ├── filesystem/               # camada de sistema de arquivos
│   ├── templates/                # engine de templates {{var}}
│   ├── detector/                 # detecção automática do projeto
│   ├── prompts/                  # wrapper @clack/prompts
│   ├── branding/                 # splash e identidade visual
│   ├── utils/                    # utilitários
│   └── constants/                # constantes e configurações
├── adapters/                     # adapters por framework
│   ├── next/
│   ├── react/
│   ├── vite/
│   └── expo/
├── types/                        # tipos compartilhados
│   └── project-info.ts
└── templates/                    # templates de código (preparado para expansão)
```

### Arquitetura

Cada comando segue o mesmo padrão:

```
commands/<nome>/
├── handler.ts    # lógica do comando
└── templates.ts  # templates de código (opcional)
```

Os comandos **nunca acessam `fs` diretamente** — usam a camada `core/filesystem`.
Os comandos **nunca usam `console.log`** — usam `core/logger`.
Os templates de código ficam isolados em `templates.ts` dentro de cada comando.

### Adicionar um novo comando

1. Criar diretório em `src/commands/<nome>/`
2. Criar `handler.ts` com a função handler
3. Se gerar código, criar `templates.ts`
4. Registrar em `src/cli.ts` com `program.command(...)`
5. Garantir que o handler receba `ProjectInfo` do detector

### Sistema de detecção

O detector (`core/detector`) identifica automaticamente:

- **Framework:** Next.js, React, Vite, Expo
- **Linguagem:** TypeScript, JavaScript
- **Diretórios:** src/, app/, pages/, components/, features/
- **Ferramentas:** Tailwind, Shadcn, React Query, Zustand, Redux, React Hook Form, Zod
- **Config:** tsconfig, aliases, ESLint, Prettier

### Padrões

- TypeScript strict, sem `any`
- Funções pequenas e focadas
- Injeção de dependência via parâmetros
- Cada arquivo com no maximo ~300 linhas
- Erros tratados, sem `console.log` solto

### Contribuindo

1. Faça um fork do repositório
2. Crie uma branch: `git checkout -b feat/nova-funcionalidade`
3. Faça suas alterações
4. Execute `bun run typecheck` para verificar tipos
5. Commit e abra um Pull Request
