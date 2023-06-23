import { BuildDeps } from './doOnPattern'
import { compileFunctions } from './functions'

type Deps = BuildDeps<{
  filePath: string
  params: Record<string, string | undefined>
}>

export { compileFunctions as compile, Deps }
