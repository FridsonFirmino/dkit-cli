import { join } from 'path'
import { logger } from '../../core/logger'
import { filesystem } from '../../core/filesystem'
import { FEATURE_STRUCTURE } from '../../core/constants'
import type { ProjectInfo } from '../../types'

export async function handleFeature(info: ProjectInfo, featureName: string): Promise<void> {
  logger.header(`dkit feature - Criar Feature: ${featureName}`)

  const featuresDir = info.hasSrc
    ? join(info.projectRoot, 'src', 'features', featureName)
    : join(info.projectRoot, 'features', featureName)

  const dirs = FEATURE_STRUCTURE.map(d => join(featuresDir, d))

  for (const dir of dirs) {
    filesystem.ensureDir(dir)
  }

  logger.success(`Feature ${featureName} criada em ${featuresDir}`)
  logger.repo()
}
