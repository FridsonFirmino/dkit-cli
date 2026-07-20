import { logger } from '../../core/logger'
import type { ProjectInfo } from '../../types'

function formatFramework(f: ProjectInfo['framework']): string {
  const map: Record<string, string> = {
    next: 'Next.js',
    react: 'React',
    vite: 'Vite',
    expo: 'Expo',
    unknown: 'Não detectado',
  }
  return map[f] || f
}

export async function handleDoctor(info: ProjectInfo): Promise<void> {
  logger.header('dkit doctor - Diagnóstico do Projeto')

  logger.success(`Framework: ${formatFramework(info.framework)}`)
  logger.success(`Language: ${info.language === 'typescript' ? 'TypeScript' : 'JavaScript'}`)

  if (info.tools.tailwind) logger.success('Tailwind CSS')
  if (info.tools.shadcn) logger.success('Shadcn UI')
  if (info.tools.reactQuery) logger.success('React Query')
  if (info.tools.zustand) logger.success('Zustand')
  if (info.tools.redux) logger.success('Redux')
  if (info.tools.reactHookForm) logger.success('React Hook Form')
  if (info.tools.zod) logger.success('Zod')

  if (info.hasSrc) logger.success('src/')
  if (info.directories.app) logger.success('app/')
  if (info.directories.pages) logger.success('pages/')

  if (info.router === 'app') logger.success('App Router')
  if (info.router === 'pages') logger.success('Pages Router')

  for (const [alias, path] of Object.entries(info.aliases)) {
    logger.success(`Alias ${alias} → ${path}`)
  }

  if (info.config.tsconfig) logger.success('TypeScript Config')
  if (info.config.eslint) logger.success('ESLint')
  if (info.config.prettier) logger.success('Prettier')
}
