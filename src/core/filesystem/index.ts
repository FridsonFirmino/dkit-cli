import { existsSync, mkdirSync, writeFileSync, readFileSync } from 'fs'
import { dirname } from 'path'
import { logger } from '../logger'

export const filesystem = {
  exists(path: string): boolean {
    return existsSync(path)
  },

  ensureDir(path: string): void {
    if (!existsSync(path)) {
      mkdirSync(path, { recursive: true })
      logger.dirCreated(path)
    }
  },

  write(path: string, content: string, overwrite = false): boolean {
    if (existsSync(path) && !overwrite) {
      logger.fileExists(path)
      return false
    }
    this.ensureDir(dirname(path))
    writeFileSync(path, content, 'utf-8')
    logger.fileCreated(path)
    return true
  },

  read(path: string): string | null {
    try {
      return readFileSync(path, 'utf-8')
    } catch {
      return null
    }
  },

  createDirStructure(base: string, dirs: string[]): void {
    for (const dir of dirs) {
      this.ensureDir(`${base}/${dir}`)
    }
  },
}
