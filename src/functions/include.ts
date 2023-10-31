import path from 'path'
import { Deps } from './index'
import { pipe } from 'fp-ts/function'
import * as E from 'fp-ts/Either'
import { readFileSync } from '@enrico-dgr/fp-ts-fs'
import { compileOperators } from '../operators'
import { Action } from '../doOnPattern'
import { getRegexForParamValue } from '../utils/regex'

const regex: Action<Deps>['regex'] = /#include/

const buildAbsolutePath = (deps: Deps, virtualPath: string) => {
  let absoluteVirtualPath = ''

  if (path.isAbsolute(virtualPath)) {
    absoluteVirtualPath = virtualPath
  } else {
    const dirpath = path.dirname(deps.filePath)
    absoluteVirtualPath = path.join(dirpath, virtualPath)
  }

  return absoluteVirtualPath
}

const action: Action<Deps>['do'] = (depsOnPattern, depsOnMatch) => {
  let res = `<!-- Error while including file -->`

  const virtualPathMatches = depsOnMatch.match.match(
    getRegexForParamValue('virtual')
  )

  if (virtualPathMatches) {
    const virtualPath = compileOperators({
      ...depsOnPattern,
      content: virtualPathMatches[0],
    })
      .split('/')
      .join(path.sep)

    const absoluteVirtualPath = buildAbsolutePath(depsOnPattern, virtualPath)

    res = `<!-- Error while including file: ${virtualPath} -->`

    pipe(
      absoluteVirtualPath,
      readFileSync,
      E.map((c) => {
        if (typeof c !== 'string') {
          c = c.toString('utf-8')
        }

        return c
      }),
      E.map((c) => {
        res = c
      })
    )
  }

  depsOnPattern.content = depsOnPattern.content.replace(depsOnMatch.match, res)
}

const command: Action<Deps> = {
  regex,
  do: action,
}

export default command
