import path from 'path'
import { Deps } from './index'
import { pipe } from 'fp-ts/function'
import * as E from 'fp-ts/Either'
import { readFileSync } from '@enrico-dgr/fp-ts-fs'
import { compileOperators } from '../operators'
import { Command } from '../doOnPattern'

const regex: Command<Deps>['regex'] = /#include/

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

const action: Command<Deps>['action'] = (fileDeps, actionDeps) => {
  let res = `<!-- Error while including file -->`

  const virtualPathMatches = actionDeps.match.match(
    /(?<=virtual=['"])[^'"]*(?=['"])/
  )

  if (virtualPathMatches) {
    const virtualPath = compileOperators({
      ...fileDeps,
      content: virtualPathMatches[0],
    })
      .split('/')
      .join(path.sep)

    const absoluteVirtualPath = buildAbsolutePath(fileDeps, virtualPath)

    res = `<!-- Error while including file: ${path.basename(
      absoluteVirtualPath
    )} -->`

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

  fileDeps.content = fileDeps.content.replace(actionDeps.match, res)
}

const command: Command<Deps> = {
  regex,
  action,
}

export default command
