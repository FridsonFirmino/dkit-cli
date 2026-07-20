import { filesystem } from '../filesystem'

export interface TemplateVars {
  [key: string]: string | boolean | string[]
}

export const templateEngine = {
  render(template: string, vars: TemplateVars): string {
    return template.replace(/\{\{(\w+)\}\}/g, (_, key: string) => {
      const value = vars[key]
      return value !== undefined ? String(value) : `{{${key}}}`
    })
  },

  apply(name: string, vars: TemplateVars): string {
    const loaded = this.load(name)
    if (!loaded) {
      throw new Error(`Template not found: ${name}`)
    }
    return this.render(loaded, vars)
  },

  load(_name: string): string | null {
    return null
  },

  writeFromTemplate(
    outputPath: string,
    content: string,
    vars: TemplateVars,
    overwrite = false,
  ): boolean {
    const rendered = this.render(content, vars)
    return filesystem.write(outputPath, rendered, overwrite)
  },
}
