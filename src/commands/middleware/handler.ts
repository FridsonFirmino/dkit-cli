import { join } from 'path'
import { logger } from '../../core/logger'
import { filesystem } from '../../core/filesystem'
import { templateEngine } from '../../core/templates'
import { middlewareTemplates } from './templates'
import type { ProjectInfo } from '../../types'

export async function handleMiddleware(info: ProjectInfo, middlewareName: string): Promise<void> {
  logger.header(`dkit middleware - Criar Middleware: ${middlewareName}`)

  const middlewareDir = info.hasSrc
    ? join(info.projectRoot, 'src', 'middleware')
    : join(info.projectRoot, 'middleware')

  filesystem.ensureDir(middlewareDir)

  const fileName = `middleware.ts`
  const content = templateEngine.render(middlewareTemplates.middleware, { middlewareName })

  filesystem.write(join(middlewareDir, fileName), content)
  logger.success(`Middleware ${middlewareName} criado em ${join(middlewareDir, fileName)}`)
  logger.repo()
}
