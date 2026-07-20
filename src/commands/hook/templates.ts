export const hookTemplates = {
  hook: `import { useState, useCallback } from 'react'

interface {{hookName}}State {
  value: unknown
  loading: boolean
  error: Error | null
}

export function {{hookName}}() {
  const [state, setState] = useState<{{hookName}}State>({
    value: null,
    loading: false,
    error: null,
  })

  const execute = useCallback(async () => {
    setState(prev => ({ ...prev, loading: true, error: null }))
    try {
      // TODO: implement hook logic
      setState(prev => ({ ...prev, loading: false }))
    } catch (error) {
      setState(prev => ({ ...prev, loading: false, error: error as Error }))
    }
  }, [])

  return { ...state, execute }
}
`,
}
