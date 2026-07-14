# DKIT CLI

**Developer Productivity Toolkit**

DKIT CLI is a developer productivity tool for Frontend and Mobile development. It automates repetitive tasks, standardizes projects, and accelerates environment setup.

---

## 📖 Usage Documentation

### Quick Start

```bash
# Clone and build
git clone https://github.com/fridsonfirmino/dkit-cli.git
cd dkit-cli
pnpm install
pnpm build

# Run the CLI
pnpm dkit                # Interactive menu
pnpm dkit --help         # Full help with examples
pnpm dkit detect         # Detect current project
```

### Commands

| Command | Description |
|---------|-------------|
| `dkit` | Open interactive menu (auto-detects project) |
| `dkit create` | Scaffold a new project (React, Next.js, Expo) |
| `dkit detect` | Detect current project information |
| `dkit doctor` | Full project health analysis with recommendations |
| `dkit health` | Show project health score |
| `dkit configure [tool]` | Install and configure tools |
| `dkit generate` | Code generation menu |
| `dkit component [name]` | Generate a React component |
| `dkit page [name]` | Generate a Next.js page |
| `dkit hook [name]` | Generate a custom hook |
| `dkit context [name]` | Generate a context provider |
| `dkit store [name]` | Generate a state store |
| `dkit clean [options]` | Clean build artifacts |
| `dkit update [options]` | Update dependencies |
| `dkit env [action]` | Manage environment variables |

### Examples

#### Project Creation
```bash
dkit create
# Follow the prompts to create React (Vite), Next.js, or Expo projects
# Optionally initializes git with first commit
```

#### Project Detection
```bash
dkit detect
# Shows detected framework, tools, package manager, git status
# Automatically identifies React, Next.js, Expo, or React Native
```

#### Health Check
```bash
dkit doctor     # Full analysis with recommendations
dkit health     # Quick health score
```

#### Code Generation
```bash
# Components (with tests, Storybook, CSS Modules, Tailwind, Styled Components)
dkit component Button
dkit component Card --type feature --no-tests
dkit component Header --type layout --storybook --css-module

# Pages (Next.js App Router)
dkit page dashboard
dkit page settings --no-loading --no-error --actions

# Hooks
dkit hook useFetch --type fetch
dkit hook useDebounce --type debounce

# Context Providers
dkit context Theme --type theme
dkit context Auth --type auth

# State Stores
dkit store cart --type zustand
dkit store user --type redux
```

#### Tool Configuration
```bash
# Interactive menu
dkit configure

# Direct installation
dkit configure tailwind
dkit configure eslint
dkit configure prettier
dkit configure husky
dkit configure tanstack-query
dkit configure zustand
dkit configure firebase
dkit configure supabase
```

#### Maintenance
```bash
dkit clean              # Clean .next, dist, build, cache
dkit clean --all        # Clean everything including node_modules
dkit update             # Update all dependencies
dkit update --check     # Only check for outdated packages
```

#### Environment Variables
```bash
dkit env create         # Create .env.local
dkit env validate       # Validate environment variables
dkit env switch         # Switch between environments
```

### Interactive Menu

Running `dkit` without arguments opens an interactive menu that:

1. **Detects** your project automatically (framework, tools, git status)
2. **Analyzes** health and shows recommendations
3. **Presents** only relevant actions based on project type
4. **Executes** the selected action directly

### Direct Command Format

All generators accept a name argument. If omitted, an interactive prompt asks for it:

```bash
dkit component         # Prompts for name
dkit component Button  # Uses "Button" directly
```

---

## 🔧 Development Documentation

### Prerequisites

- **Node.js** >= 18.0.0
- **pnpm** >= 8.0.0 (preferred package manager)
- **Bun** >= 1.0.0 (optional, compatible)

### Tech Stack

| Layer | Technology |
|-------|-----------|
| Language | TypeScript |
| Runtime | Node.js (compatible with Bun) |
| CLI Framework | Commander.js |
| Prompts | Clack |
| Spinner | Ora |
| Colors | Picocolors |
| Templates | Handlebars |
| Build | tsup |
| Monorepo | Turborepo + pnpm workspaces |

### Project Structure

```
dkit-cli/
├── packages/
│   ├── core/              # CLI entry, commands, detection engine
│   │   ├── src/
│   │   │   ├── cli.ts              # CLI entry point (all commands)
│   │   │   ├── commands/
│   │   │   │   ├── create.ts       # Project scaffolding
│   │   │   │   ├── configure.ts    # Tool configuration
│   │   │   │   ├── generate-*.ts   # Code generators
│   │   │   │   ├── menu.ts         # Interactive menu
│   │   │   │   ├── env.ts          # Environment management
│   │   │   │   ├── clean.ts        # Cache cleaning
│   │   │   │   ├── update.ts       # Dependency updates
│   │   │   │   └── doctor.ts       # Health analysis
│   │   │   ├── detection/          # Project detection engine
│   │   │   └── utils/              # Shared utilities
│   │   └── dist/                   # Built output
│   │
│   ├── frontend/          # (Legacy) Frontend-specific commands
│   │   └── src/commands/  # Previously housed generators
│   │
│   ├── mobile/            # Mobile-specific commands
│   │   └── src/commands/  # Android, emulator, Expo management
│   │
│   ├── shared/            # Types, schemas, naming utilities
│   │   └── src/
│   │       ├── types/           # TypeScript interfaces
│   │       ├── utils/           # Zod schemas, naming helpers
│   │       └── constants/       # Defaults, display names
│   │
│   └── templates/         # Handlebars code generation templates
│       └── templates/
│           ├── component/       # React component templates
│           ├── page/            # Next.js page templates
│           ├── hook/            # Custom hook templates
│           ├── context/         # Context provider templates
│           ├── store/           # State management templates
│           ├── crud/            # CRUD generator templates
│           ├── layout/          # Layout templates
│           ├── screen/          # Mobile screen templates
│           └── service/         # API service templates
│
├── turbo.json              # Turborepo pipeline config
└── pnpm-workspace.yaml     # Workspace configuration
```

### Development Workflow

```bash
# Install dependencies
pnpm install

# Build all packages
pnpm build

# Build in watch mode (auto-rebuild on changes)
pnpm dev

# Run CLI during development
pnpm dkit <command>

# Clean all build artifacts
pnpm clean
```

### Adding a New Command

1. Create the command file in `packages/core/src/commands/`

2. Export the command factory function:
   ```typescript
   import { Command } from "commander";

   export function createMyCommand(): Command {
     return new Command("my-command")
       .description("What it does")
       .action(() => {
         // Implementation
       });
   }
   ```

3. Register it in `packages/core/src/cli.ts`:
   ```typescript
   import { createMyCommand } from "./commands/my-command.js";
   program.addCommand(createMyCommand());
   ```

### Adding New Templates

1. Create a `.hbs` file in `packages/templates/templates/<category>/`

2. Template naming convention:
   - File `component.tsx.hbs` → called with `renderTemplate("component", "component.tsx", data)`
   - File `hook.ts.hbs` → called with `renderTemplate("hook", "hook.ts", data)`

3. Use the template in a command:
   ```typescript
   import { renderTemplate } from "@dkit/templates";
   const content = renderTemplate("category", "file-name.hbs", { data });
   ```

---

## 🚀 Features

### Implemented (v1.0)

- [x] Project detection (framework, tools, git, environment)
- [x] Health score with recommendations
- [x] Interactive menu with auto-detection
- [x] Project scaffolding (React/Vite, Next.js, Expo)
- [x] Component generation (with tests, Storybook, CSS options)
- [x] Page generation (with layout, loading, error, actions)
- [x] Hook generation (fetch, pagination, theme, debounce, mediaQuery)
- [x] Context generation (theme, auth, user)
- [x] Store generation (Zustand, Redux Toolkit)
- [x] Mobile screen generation
- [x] Android device management (adb)
- [x] Emulator management
- [x] Expo commands (prebuild, build, submit)
- [x] Tool configuration (Tailwind, ESLint, Prettier, Husky, TanStack Query, Zustand, Firebase, Supabase)
- [x] Build cache cleaning
- [x] Dependency updates
- [x] Environment variable management
- [x] CRUD templates (types, schema, API, hooks, form)
- [x] API service templates
- [x] Layout templates

### Roadmap

**v1.1**
- [ ] Reusable presets (save and reuse project stacks)
- [ ] Custom component templates
- [ ] Improved project detection

**v1.2**
- [ ] AI integration for component generation and error explanation
- [ ] Migration assistant (React, Next.js, Expo versions)

**v2.0**
- [ ] Git module (branches, commits, pull requests, changelog)
- [ ] Backend support (NestJS, Express, Hono)

**v3.0**
- [ ] DevOps (Docker, GitHub Actions, Vercel, Railway, Render)
- [ ] Database (Prisma, Drizzle, Supabase)

**v4.0**
- [ ] Official plugin system
- [ ] Community template marketplace

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'feat: add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

MIT
