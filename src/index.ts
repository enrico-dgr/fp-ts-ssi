import { BuildDeps } from './doOnPattern'

export type Deps = BuildDeps<{
  filePath: string
  params: Record<string, string>
}>
