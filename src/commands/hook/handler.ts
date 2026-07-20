import { join } from 'path'
import { logger } from '../../core/logger'
import { filesystem } from '../../core/filesystem'
import { templateEngine } from '../../core/templates'
import { hookTemplates } from './templates'
import type { ProjectInfo } from '../../types'

export async function handleHook(info: ProjectInfo, hookName: string): Promise<void> {
  logger.header(`dkit hook - Criar Hook: ${hookName}`)

  const hookDir = info.hasSrc
    ? join(info.projectRoot, 'src', 'hooks')
    : join(info.projectRoot, 'hooks')

  filesystem.ensureDir(hookDir)

  const fileName = `${hookName}.ts`
  const content = templateEngine.render(hookTemplates.hook, { hookName })

  filesystem.write(join(hookDir, fileName), content)
  logger.success(`Hook ${hookName} criado em ${join(hookDir, fileName)}`)
}
