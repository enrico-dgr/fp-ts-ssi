import path from 'path'
import { Deps, compileFunctions } from './index'
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
    if (virtualPath[0] === path.sep && deps.options?.baseDir) {
      absoluteVirtualPath = path.join(deps.options.baseDir, virtualPath)
    } else { 
      absoluteVirtualPath = virtualPath
    }

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
      E.map((rawContent) => {
        res = compileFunctions({
          params: depsOnPattern.params,
          content: rawContent,
          filePath: absoluteVirtualPath,
        })

        // Adjust spacings
        const indentation = depsOnPattern.content.match(new RegExp(`(?<=[\r\n])[\t ]*(?=${depsOnMatch.match})`));
        if (indentation) {
          res = res.replace(/(^[\r\n \t]+|[\r\n \t]+$)/g, '').replace(/([\r\n]+)/g, `$1${indentation[0]}`)
        }
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
