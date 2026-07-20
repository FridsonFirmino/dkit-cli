export interface ProjectInfo {
  framework: 'next' | 'react' | 'vite' | 'expo' | 'unknown'
  language: 'typescript' | 'javascript'
  hasSrc: boolean
  router: 'app' | 'pages' | 'unknown'
  aliases: Record<string, string>
  packages: string[]
  directories: {
    src: boolean
    app: boolean
    pages: boolean
    components: boolean
    features: boolean
  }
  tools: {
    tailwind: boolean
    shadcn: boolean
    reactQuery: boolean
    zustand: boolean
    redux: boolean
    reactHookForm: boolean
    zod: boolean
  }
  config: {
    tsconfig: boolean
    eslint: boolean
    prettier: boolean
  }
  projectRoot: string
}
