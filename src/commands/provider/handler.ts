import { join } from 'path'
import { logger } from '../../core/logger'
import { filesystem } from '../../core/filesystem'
import { templateEngine } from '../../core/templates'
import { capitalize } from '../../core/utils'
import { providerTemplates } from './templates'
import type { ProjectInfo } from '../../types'

export async function handleProvider(info: ProjectInfo, providerName: string): Promise<void> {
  logger.header(`dkit provider - Criar Provider: ${providerName}`)

  const pascalName = capitalize(providerName)
  const baseDir = info.hasSrc
    ? join(info.projectRoot, 'src', 'providers', pascalName)
    : join(info.projectRoot, 'providers', pascalName)

  filesystem.ensureDir(baseDir)

  const files: Array<{ name: string; template: string }> = [
    { name: `${pascalName}Provider.tsx`, template: providerTemplates.provider },
    { name: `index.ts`, template: providerTemplates.index },
  ]

  const vars = { providerName: pascalName, providerNameLower: pascalName.toLowerCase() }

  for (const file of files) {
    const content = templateEngine.render(file.template, vars)
    filesystem.write(join(baseDir, file.name), content)
  }

  logger.success(`Provider ${pascalName} criado em ${baseDir}`)
  logger.repo()
}
