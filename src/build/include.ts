import path from 'path'
import { Command } from './index'
import { pipe } from 'fp-ts/function'
import * as E from 'fp-ts/Either'
import { readFileSync } from '@enrico-dgr/fp-ts-fs'

const regex: Command['regex'] = /#include/

const action: Command['action'] = ({ content, match, filePath }) => {
  const fileName = path.basename(filePath)
  const dirpath = path.dirname(filePath)
  let res = `<!-- Error while including file: ${fileName} -->`

  const virtualPath = match.match(/(?<=virtual=['"])[^'"]*(?=['"])/)

  if (virtualPath) {
    const absoluteVirtualPath = path.join(dirpath, virtualPath[0]);

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

  content.replace(match, res);
}

const command: Command = {
  regex,
  action,
}

export default command;