import path from 'path'
import { Command, Deps, build } from './index'
import { pipe } from 'fp-ts/function'
import * as E from 'fp-ts/Either'
import { readFileSync } from '@enrico-dgr/fp-ts-fs'

const regex: Command['regex'] = /#include/

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

const action: Command['action'] = (fileDeps, actionDeps) => {
  let res = `<!-- Error while including file -->`

  const virtualPathMatches = actionDeps.match.match(
    /(?<=virtual=['"])[^'"]*(?=['"])/
  )

  if (virtualPathMatches) {
    const virtualPath = build({
      ...fileDeps,
      content: virtualPathMatches[0],
    })
      .split('/')
      .join(path.sep)

    const absoluteVirtualPath = buildAbsolutePath(fileDeps, virtualPath)

    res = `<!-- Error while including file: ${absoluteVirtualPath} -->`

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

const command: Command = {
  regex,
  action,
}

export default command
