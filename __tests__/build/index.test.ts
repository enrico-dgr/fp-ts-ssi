import * as E from 'fp-ts/Either'
import { pipe } from 'fp-ts/function'
import { readFileSync } from '@enrico-dgr/fp-ts-fs'
import path from 'path'
import { compileFunctions } from '../../src/functions'

describe('build', () => {
  const mocksPath = path.resolve(__dirname, '..', 'mocks')

  it('include', () => {
    const filePath = path.join(mocksPath, 'include', 'index.shtml')
    const resultFilePath = path.join(mocksPath, 'include', 'result.html')

    pipe(
      readFileSync(filePath),
      E.map((c) => (typeof c === 'string' ? c : c.toString('utf-8'))),
      E.map((content) =>
        compileFunctions({
          content,
          filePath,
          params: { ROOT: path.resolve(__dirname, '..', '..') },
        })
      ),
      E.chain((res) =>
        pipe(
          readFileSync(resultFilePath),
          E.map((c) => (typeof c === 'string' ? c : c.toString('utf-8'))),
          E.map((expectedRes) => ({
            res,
            expectedRes,
          }))
        )
      ),
      E.map(({ res, expectedRes }) => {
        expect(res).toBe(expectedRes)
      })
    )
  })
})
