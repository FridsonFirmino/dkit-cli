export const FEATURE_STRUCTURE = [
  'components',
  'hooks',
  'services',
  'types',
  'constants',
  'validators',
  'schemas',
] as const

export const ARCHITECTURE_TYPES = [
  'feature-based',
  'layered',
  'atomic',
  'clean-architecture',
] as const

export type ArchitectureType = typeof ARCHITECTURE_TYPES[number]

export const ARCHITECTURE_STRUCTURES: Record<ArchitectureType, string[]> = {
  'feature-based': ['components', 'hooks', 'services', 'types', 'constants', 'validators', 'schemas'],
  'layered': ['presentation', 'application', 'domain', 'infrastructure'],
  'atomic': ['atoms', 'molecules', 'organisms', 'templates', 'pages'],
  'clean-architecture': ['entities', 'usecases', 'repositories', 'frameworks'],
}

export const FRAMEWORKS = ['next', 'react', 'vite', 'expo'] as const

export const IGNORE_DIRS = ['node_modules', '.git', 'dist', 'build', '.next', '.expo']
