import * as clack from '@clack/prompts'

export const prompts = {
  async select(message: string, options: { label: string; value: string }[]): Promise<string | symbol> {
    return clack.select({
      message,
      options: options as any,
    })
  },

  async text(message: string, placeholder?: string): Promise<string | symbol> {
    return clack.text({ message, placeholder })
  },

  async confirm(message: string): Promise<boolean | symbol> {
    return clack.confirm({ message })
  },

  async multiselect(message: string, options: { label: string; value: string }[]): Promise<string[] | symbol> {
    return clack.multiselect({
      message,
      options: options as any,
    })
  },

  isCancel(value: unknown): value is symbol {
    return clack.isCancel(value)
  },
}
