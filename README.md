# DKIT CLI

**Developer Productivity Toolkit**

DKIT CLI is a developer productivity tool for Frontend and Mobile development. It automates repetitive tasks, standardizes projects, and accelerates environment setup.

---

## 📖 Usage Documentation

### Installation

```bash
# Clone the repository
git clone https://github.com/fridsonfirmino/dkit-cli.git
cd dkit-cli

# Install dependencies
pnpm install

# Build all packages
pnpm build
```

### Quick Start

Run `dkit` without arguments to open the interactive menu:

```bash
node packages/core/dist/cli.js
```

Or use commands directly:

### Commands

| Command | Description |
|---------|-------------|
| `dkit` | Open interactive menu |
| `dkit create` | Scaffold a new project (React, Next.js, Expo) |
| `dkit detect` | Detect current project information |
| `dkit doctor` | Full project health analysis |
| `dkit health` | Show project health score |
| `dkit configure` | Install and configure tools |
| `dkit generate` | Code generation menu |
| `dkit clean` | Clean build artifacts |
| `dkit update` | Update dependencies |
| `dkit env` | Manage environment variables |

### Examples

```bash
# Project creation
dkit create
# Follow the interactive prompts to create React, Next.js, or Expo projects

# Project detection
dkit detect
# Shows framework, tools, package manager, git status

# Health check
dkit doctor
# Analyzes TypeScript, ESLint, Prettier, Husky, Git, Tailwind, Storybook,
# Testing framework, TanStack Query, and state management

# Configure tools
dkit configure
# Interactive menu to install and configure:
# - Tailwind CSS, ESLint, Prettier, Husky, TanStack Query
# - Zustand, Firebase, Supabase

# Or configure a specific tool directly:
dkit configure tailwind
dkit configure eslint
dkit configure husky

# Code generation
dkit generate
# Shows available generators based on project type

# Clean build artifacts
dkit clean          # Clean .next, dist, build, cache
dkit clean --all    # Also clean node_modules

# Update dependencies
dkit update            # Update all dependencies
dkit update --check    # Only check for outdated packages

# Environment management
dkit env create     # Create .env.local
dkit env validate   # Validate environment variables
dkit env switch     # Switch between development/production
```

### Interactive Menu

Running `dkit` without arguments opens an interactive menu that:

1. **Detects your project** automatically (framework, tools, git status)
2. **Shows health score** with recommendations
3. **Presents only relevant actions** based on project type

---

## 🔧 Development Documentation

### Prerequisites

- **Node.js** >= 18.0.0
- **pnpm** >= 8.0.0 (preferred package manager)
- Optionally: **Bun** >= 1.0.0

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
│   ├── core/         # CLI entry, project detection, health analysis
│   │   ├── src/
│   │   │   ├── cli.ts           # CLI entry point
│   │   │   ├── commands/        # Command implementations
│   │   │   ├── detection/       # Project detection engine
│   │   │   └── utils/           # Shared utilities
│   │   └── dist/                # Built output
│   │
│   ├── frontend/     # React/Next.js generators
│   │   └── src/
│   │       └── commands/        # Component, Page, Hook, Context, Store
│   │
│   ├── mobile/       # Expo/React Native generators
│   │   └── src/
│   │       └── commands/        # Screen, Component, Android, Emulator, Expo
│   │
│   ├── shared/       # Types, schemas, naming utilities, constants
│   │   └── src/
│   │       ├── types/           # TypeScript interfaces
│   │       ├── utils/           # Zod schemas, naming helpers
│   │       └── constants/       # Defaults and display names
│   │
│   └── templates/    # Handlebars templates
│       └── templates/
│           ├── component/       # React component templates
│           ├── page/            # Next.js page templates
│           ├── hook/            # Custom hook templates
│           ├── context/         # React context templates
│           ├── store/           # State management templates
│           ├── crud/            # CRUD generator templates
│           ├── layout/          # Layout templates
│           ├── screen/          # Mobile screen templates
│           └── service/         # API service templates
│
├── turbo.json         # Turborepo configuration
└── pnpm-workspace.yaml
```

### Development

```bash
# Install dependencies
pnpm install

# Build all packages
pnpm build

# Build in watch mode
pnpm dev

# Clean all builds
pnpm clean

# Run CLI locally
node packages/core/dist/cli.js <command>

# Or via pnpm script
pnpm dkit <command>
```

### Adding a New Command

1. Create the command file in the appropriate package:
   - `packages/core/src/commands/` for core commands
   - `packages/frontend/src/commands/` for frontend generators
   - `packages/mobile/src/commands/` for mobile generators

2. Export the command factory function:
   ```typescript
   export function createMyCommand(): Command {
     return new Command("my-command")
       .description("What my command does")
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

1. Create a `.hbs` file in the appropriate directory under `packages/templates/templates/`
2. Register any new helpers in `packages/templates/src/helpers.ts`
3. Use the template in your command:
   ```typescript
   import { renderTemplate } from "@dkit/templates";
   const content = renderTemplate("category", "template-name", { data });
   ```

---

## 🚀 Features

### Implemented (v1.0)

- [x] Project detection (framework, tools, git, environment)
- [x] Health score with recommendations
- [x] Interactive menu
- [x] Project scaffolding (React/Vite, Next.js, Expo)
- [x] Component generation (with tests, Storybook, CSS options)
- [x] Page generation (with layout, loading, error, actions)
- [x] Hook generation (fetch, pagination, theme, debounce, mediaQuery)
- [x] Context generation (theme, auth, user)
- [x] Store generation (Zustand, Redux Toolkit, Jotai)
- [x] Mobile screen generation
- [x] Mobile component generation
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
