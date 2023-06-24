import { pipe } from 'fp-ts/function'
import * as A from 'fp-ts/Array'
import * as E from 'fp-ts/Either'
import { BuildDeps } from './doOnPattern'
import { compileFunctions } from './functions'
import { FileInfo, readFilesSync } from '@enrico-dgr/fp-ts-fs'

type Deps = BuildDeps<{
  filePath: string
  params: Record<string, string | undefined>
}>

const compileHtmlFiles = (
  deps: Parameters<typeof readFilesSync>[0] & Pick<Deps, 'params'>
): E.Either<Error, FileInfo[]> =>
  pipe(
    readFilesSync(deps),
    E.map(
      A.map((f) =>
        pipe(
          compileFunctions({
            params: { ...deps.params },
            filePath: f.path,
            content: f.content,
          }),
          (c) => ({
            content: c,
            path: f.path,
          })
        )
      )
    )
  )

export { compileFunctions as compile, compileHtmlFiles, Deps }
