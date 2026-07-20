import type { ProjectInfo } from '../../types'

export function getReactPaths(info: ProjectInfo): { components: string; hooks: string } {
  const base = info.hasSrc ? 'src' : ''
  const prefix = base ? `${base}/` : ''
  return {
    components: `${prefix}components`,
    hooks: `${prefix}hooks`,
  }
}
