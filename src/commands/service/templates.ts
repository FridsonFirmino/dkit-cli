export const serviceTemplates = {
  service: `import type { AxiosResponse } from 'axios'

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || '/api'

interface {{serviceName}}Data {
  id?: string
  [key: string]: unknown
}

export const {{serviceName}}Service = {
  async getAll(): Promise<{{serviceName}}Data[]> {
    const response = await fetch(\`\${BASE_URL}/{{serviceName}}s\`)
    return response.json()
  },

  async getById(id: string): Promise<{{serviceName}}Data> {
    const response = await fetch(\`\${BASE_URL}/{{serviceName}}s/\${id}\`)
    return response.json()
  },

  async create(data: {{serviceName}}Data): Promise<{{serviceName}}Data> {
    const response = await fetch(\`\${BASE_URL}/{{serviceName}}s\`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
    return response.json()
  },

  async update(id: string, data: Partial<{{serviceName}}Data>): Promise<{{serviceName}}Data> {
    const response = await fetch(\`\${BASE_URL}/{{serviceName}}s/\${id}\`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
    return response.json()
  },

  async delete(id: string): Promise<void> {
    await fetch(\`\${BASE_URL}/{{serviceName}}s/\${id}\`, { method: 'DELETE' })
  },
}
`,
}
