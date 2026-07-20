import { join } from 'path'
import { logger } from '../../core/logger'
import { filesystem } from '../../core/filesystem'
import { prompts } from '../../core/prompts'
import { ARCHITECTURE_TYPES, ARCHITECTURE_STRUCTURES, type ArchitectureType } from '../../core/constants'
import type { ProjectInfo } from '../../types'

export async function handleArchitecture(info: ProjectInfo): Promise<void> {
  logger.header('dkit architecture - Criar Arquitetura')

  const options = ARCHITECTURE_TYPES.map(a => ({
    label: a.charAt(0).toUpperCase() + a.slice(1).replace(/-/g, ' '),
    value: a,
  }))

  const architecture = await prompts.select(
    'Escolha uma arquitetura',
    options,
  )

  if (prompts.isCancel(architecture)) {
    logger.warn('Operação cancelada')
    return
  }

  const selected = architecture as ArchitectureType
  const dirs = ARCHITECTURE_STRUCTURES[selected]
  const baseDir = info.hasSrc ? join(info.projectRoot, 'src') : info.projectRoot

  logger.info(`Criando arquitetura ${selected} em ${baseDir}`)

  for (const dir of dirs) {
    filesystem.ensureDir(join(baseDir, dir))
  }

  logger.success(`Arquitetura ${selected} criada com sucesso`)
  logger.repo()
}
