import path from 'path'
import { Command, Deps } from './index'
import { pipe } from 'fp-ts/function'
import * as E from 'fp-ts/Either'
import { readFileSync } from '@enrico-dgr/fp-ts-fs'

const regex: Command['regex'] = /#include/

const buildAbsolutePath = (deps: Deps, virtualPath: string) => {
  

  if (/^\//.test(virtualPath)) {
  
  }
}

const action: Command['action'] = (fileDeps, actionDeps) => {
  const dirpath = path.dirname(fileDeps.filePath)
  let res = `<!-- Error while including file -->`

  const virtualPath = actionDeps.match.match(/(?<=virtual=['"])[^'"]*(?=['"])/)

  if (virtualPath) {
    // Add SSI variable handling with deps.params
    const absoluteVirtualPath = path.join(dirpath, virtualPath[0])
    const fileName = path.basename(absoluteVirtualPath)

    res = `<!-- Error while including file: ${fileName} -->`

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
