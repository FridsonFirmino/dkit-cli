export const contextTemplates = {
  context: `import React, { createContext, useContext, useCallback } from 'react'
import type { ReactNode } from 'react'
import type { {{contextName}}ContextType } from './types'

const {{contextName}}Context = createContext<{{contextName}}ContextType | undefined>(undefined)

export function {{contextName}}Provider({ children }: { children: ReactNode }) {
  const [state, setState] = React.useState<{{contextName}}ContextType['state']>({})

  const update = useCallback((data: Partial<{{contextName}}ContextType['state']>) => {
    setState(prev => ({ ...prev, ...data }))
  }, [])

  return (
    <{{contextName}}Context.Provider value={{ state, update }}>
      {children}
    </{{contextName}}Context.Provider>
  )
}

export function use{{contextName}}(): {{contextName}}ContextType {
  const context = useContext({{contextName}}Context)
  if (!context) {
    throw new Error('use{{contextName}} must be used within a {{contextName}}Provider')
  }
  return context
}
`,
  provider: `import { {{contextName}}Provider } from './{{contextName}}Context'

export { {{contextName}}Provider }
export { use{{contextName}} } from './{{contextName}}Context'
`,
  hook: `import { use{{contextName}} } from './{{contextName}}Context'

export function use{{contextName}}Value() {
  const { state, update } = use{{contextName}}()
  return { state, update }
}
`,
  types: `export interface {{contextName}}ContextType {
  state: Record<string, unknown>
  update: (data: Partial<Record<string, unknown>>) => void
}
`,
  index: `export { {{contextName}}Provider } from './{{contextName}}Provider'
export { use{{contextName}} } from './{{contextName}}Context'
export type { {{contextName}}ContextType } from './types'
`,
}
