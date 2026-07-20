import { existsSync } from 'fs'
import { join, resolve } from 'path'

export function safeJoin(...paths: string[]): string {
  return join(...paths)
}

export function findProjectRoot(startDir: string = process.cwd()): string {
  let current = resolve(startDir)

  while (true) {
    if (existsSync(join(current, 'package.json'))) {
      return current
    }
    const parent = resolve(current, '..')
    if (parent === current) {
      return process.cwd()
    }
    current = parent
  }
}

export function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1)
}

export function kebabToPascal(str: string): string {
  return str
    .split(/[-_]/)
    .map(capitalize)
    .join('')
}

export function validateName(name: string): boolean {
  return /^[a-zA-Z_$][a-zA-Z0-9_$-]*$/.test(name)
}

export function detectLanguage(root: string): 'typescript' | 'javascript' {
  if (existsSync(join(root, 'tsconfig.json'))) return 'typescript'
  return 'javascript'
}
