import { join } from 'path'
import { logger } from '../../core/logger'
import { filesystem } from '../../core/filesystem'
import { templateEngine } from '../../core/templates'
import { serviceTemplates } from './templates'
import type { ProjectInfo } from '../../types'

export async function handleService(info: ProjectInfo, serviceName: string): Promise<void> {
  logger.header(`dkit service - Criar Service: ${serviceName}`)

  const serviceDir = info.hasSrc
    ? join(info.projectRoot, 'src', 'services')
    : join(info.projectRoot, 'services')

  filesystem.ensureDir(serviceDir)

  const fileName = `${serviceName}.service.ts`
  const content = templateEngine.render(serviceTemplates.service, { serviceName })

  filesystem.write(join(serviceDir, fileName), content)
  logger.success(`Service ${serviceName} criado em ${join(serviceDir, fileName)}`)
  logger.repo()
}
