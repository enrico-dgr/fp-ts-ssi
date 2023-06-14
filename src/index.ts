import * as E from 'fp-ts/Either'
import { readFilesSync } from '@enrico-dgr/fp-ts-fs'

export default (): E.Either<Error, string> => readFilesSync({ paths: [''] })
