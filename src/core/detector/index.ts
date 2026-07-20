import { existsSync, readFileSync } from 'fs'
import { join } from 'path'
import { findProjectRoot } from '../utils'
import type { ProjectInfo } from '../../types'

function detectFramework(root: string, pkg: Record<string, unknown>): ProjectInfo['framework'] {
  const deps = { ...(pkg.dependencies as Record<string, string> || {}), ...(pkg.devDependencies as Record<string, string> || {}) }

  if (deps.next) return 'next'
  if (deps.expo || deps['expo-status-bar']) return 'expo'
  if (deps.vite || deps['@vitejs/plugin-react']) return 'vite'
  if (deps.react || deps['react-dom']) return 'react'

  if (existsSync(join(root, 'next.config.js')) || existsSync(join(root, 'next.config.mjs')) || existsSync(join(root, 'next.config.ts'))) return 'next'
  if (existsSync(join(root, 'vite.config.ts')) || existsSync(join(root, 'vite.config.js'))) return 'vite'
  if (existsSync(join(root, 'app.json'))) return 'expo'

  return 'unknown'
}

function detectPackages(pkg: Record<string, unknown>): string[] {
  const deps = { ...(pkg.dependencies as Record<string, string> || {}), ...(pkg.devDependencies as Record<string, string> || {}) }
  return Object.keys(deps)
}

function detectAliases(root: string): Record<string, string> {
  const aliases: Record<string, string> = {}

  const tsconfigPaths = ['tsconfig.json', 'tsconfig.app.json', 'jsconfig.json']
  for (const file of tsconfigPaths) {
    const fullPath = join(root, file)
    if (existsSync(fullPath)) {
      try {
        const content = readFileSync(fullPath, 'utf-8')
        const parsed = JSON.parse(content)
        const paths = parsed.compilerOptions?.paths
        if (paths) {
          for (const [key, value] of Object.entries(paths)) {
            const aliasKey = key.replace('/*', '')
            const aliasValue = (value as string[])[0]?.replace('/*', '') || ''
            aliases[aliasKey] = aliasValue
          }
        }
      } catch {
        // ignore parse errors
      }
    }
  }
  return aliases
}

function detectDirectories(root: string): ProjectInfo['directories'] {
  return {
    src: existsSync(join(root, 'src')),
    app: existsSync(join(root, 'app')),
    pages: existsSync(join(root, 'pages')),
    components: existsSync(join(root, 'components')) || existsSync(join(root, 'src/components')),
    features: existsSync(join(root, 'features')) || existsSync(join(root, 'src/features')),
  }
}

function detectRouter(root: string, framework: ProjectInfo['framework']): ProjectInfo['router'] {
  if (framework === 'next') {
    if (existsSync(join(root, 'app'))) return 'app'
    if (existsSync(join(root, 'pages'))) return 'pages'
  }
  return 'unknown'
}

function detectTools(root: string, packages: string[]): ProjectInfo['tools'] {
  return {
    tailwind: packages.some(p => p === 'tailwindcss' || p === '@tailwindcss/postcss'),
    shadcn: packages.some(p => p === 'shadcn' || p === '@shadcn/ui') || existsSync(join(root, 'components.json')),
    reactQuery: packages.some(p => p.startsWith('@tanstack/react-query')),
    zustand: packages.some(p => p === 'zustand'),
    redux: packages.some(p => p === 'redux' || p === '@reduxjs/toolkit'),
    reactHookForm: packages.some(p => p === 'react-hook-form'),
    zod: packages.some(p => p === 'zod'),
  }
}

function detectConfig(root: string): ProjectInfo['config'] {
  return {
    tsconfig: existsSync(join(root, 'tsconfig.json')),
    eslint: existsSync(join(root, '.eslintrc')) || existsSync(join(root, '.eslintrc.json')) || existsSync(join(root, '.eslintrc.js')) || existsSync(join(root, 'eslint.config.js')),
    prettier: existsSync(join(root, '.prettierrc')) || existsSync(join(root, '.prettierrc.json')) || existsSync(join(root, '.prettierrc.js')),
  }
}

export function detectProject(projectRoot?: string): ProjectInfo {
  const root = projectRoot || findProjectRoot()
  const pkgRaw = readFileSync(join(root, 'package.json'), 'utf-8')
  const pkg = JSON.parse(pkgRaw)
  const packages = detectPackages(pkg)
  const framework = detectFramework(root, pkg)
  const directories = detectDirectories(root)

  return {
    framework,
    language: existsSync(join(root, 'tsconfig.json')) ? 'typescript' : 'javascript',
    hasSrc: directories.src,
    router: detectRouter(root, framework),
    aliases: detectAliases(root),
    packages,
    directories,
    tools: detectTools(root, packages),
    config: detectConfig(root),
    projectRoot: root,
  }
}
