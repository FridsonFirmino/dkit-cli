import { Command } from 'commander'
import { detectProject } from './core/detector'
import { handleDoctor } from './commands/doctor/handler'
import { handleArchitecture } from './commands/architecture/handler'
import { handleFeature } from './commands/feature/handler'
import { handleContext } from './commands/context/handler'
import { handleProvider } from './commands/provider/handler'
import { handleHook } from './commands/hook/handler'
import { handleService } from './commands/service/handler'
import { handleMiddleware } from './commands/middleware/handler'

const program = new Command()

program
  .name('dkit')
  .description('CLI moderna para automatizar tarefas em projetos frontend existentes')
  .version('1.0.0')

program
  .command('doctor')
  .description('Detecta e exibe informações do projeto')
  .action(() => {
    const info = detectProject()
    handleDoctor(info)
  })

program
  .command('architecture')
  .description('Cria estrutura de diretórios baseada em uma arquitetura')
  .action(() => {
    const info = detectProject()
    handleArchitecture(info)
  })

program
  .command('feature')
  .description('Cria uma nova feature com estrutura completa')
  .argument('<name>', 'nome da feature')
  .action((name: string) => {
    const info = detectProject()
    handleFeature(info, name)
  })

program
  .command('context')
  .description('Cria um context com provider, hook, types e index')
  .argument('<name>', 'nome do context')
  .action((name: string) => {
    const info = detectProject()
    handleContext(info, name)
  })

program
  .command('provider')
  .description('Cria um provider component')
  .argument('<name>', 'nome do provider')
  .action((name: string) => {
    const info = detectProject()
    handleProvider(info, name)
  })

program
  .command('hook')
  .description('Cria um custom hook')
  .argument('<name>', 'nome do hook (ex: usePagination)')
  .action((name: string) => {
    const info = detectProject()
    handleHook(info, name)
  })

program
  .command('service')
  .description('Cria um service')
  .argument('<name>', 'nome do service')
  .action((name: string) => {
    const info = detectProject()
    handleService(info, name)
  })

program
  .command('middleware')
  .description('Cria um middleware (Next.js)')
  .argument('<name>', 'nome do middleware')
  .action((name: string) => {
    const info = detectProject()
    handleMiddleware(info, name)
  })

export { program }
