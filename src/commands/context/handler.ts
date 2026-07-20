import { join } from 'path'
import { logger } from '../../core/logger'
import { filesystem } from '../../core/filesystem'
import { templateEngine } from '../../core/templates'
import { capitalize } from '../../core/utils'
import { contextTemplates } from './templates'
import type { ProjectInfo } from '../../types'

export async function handleContext(info: ProjectInfo, contextName: string): Promise<void> {
  logger.header(`dkit context - Criar Context: ${contextName}`)

  const pascalName = capitalize(contextName)
  const baseDir = info.hasSrc
    ? join(info.projectRoot, 'src', 'contexts', pascalName)
    : join(info.projectRoot, 'contexts', pascalName)

  filesystem.ensureDir(baseDir)

  const files: Array<{ name: string; template: string }> = [
    { name: `${pascalName}Context.tsx`, template: contextTemplates.context },
    { name: `${pascalName}Provider.tsx`, template: contextTemplates.provider },
    { name: `use${pascalName}.ts`, template: contextTemplates.hook },
    { name: `types.ts`, template: contextTemplates.types },
    { name: `index.ts`, template: contextTemplates.index },
  ]

  const vars = { contextName: pascalName, contextNameLower: pascalName.toLowerCase() }

  for (const file of files) {
    const content = templateEngine.render(file.template, vars)
    filesystem.write(join(baseDir, file.name), content)
  }

  logger.success(`Context ${pascalName} criado em ${baseDir}`)
  logger.repo()
}
