export const providerTemplates = {
  provider: `import { type ReactNode } from 'react'

interface {{providerName}}ProviderProps {
  children: ReactNode
}

export function {{providerName}}Provider({ children }: {{providerName}}ProviderProps) {
  return <>{children}</>
}
`,
  index: `export { {{providerName}}Provider } from './{{providerName}}Provider'
`,
}
