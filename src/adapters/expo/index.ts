import type { ProjectInfo } from '../../types'

export function getExpoPaths(info: ProjectInfo): { components: string; hooks: string } {
  return {
    components: 'components',
    hooks: 'hooks',
  }
}
