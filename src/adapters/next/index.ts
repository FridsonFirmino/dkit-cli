import type { ProjectInfo } from '../../types'

export function getNextPaths(info: ProjectInfo): { components: string; hooks: string } {
  const base = info.hasSrc ? 'src' : ''
  const prefix = base ? `${base}/` : ''
  return {
    components: `${prefix}components`,
    hooks: `${prefix}hooks`,
  }
}

export function isNextAppRouter(info: ProjectInfo): boolean {
  return info.framework === 'next' && info.router === 'app'
}
