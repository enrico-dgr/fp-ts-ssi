import * as E from 'fp-ts/Either'
import { pipe } from 'fp-ts/function'
import { readFileSync } from '@enrico-dgr/fp-ts-fs'
import path from 'path'
import { compileOperators } from '../../src/operators'

describe('operators', () => {
  let testName = ''
  const mocksPath = path.resolve(__dirname, '..', 'mocks', 'operators')

  testName = 'getVariable'
  it(testName, () => {
    let res = 'res'
    let expectedRes = 'expectedRes'

    const filePath = path.join(mocksPath, testName, 'index.shtml')
    const resultFilePath = path.join(mocksPath, testName, 'result.html')

    const params = {
      weekDay: 'Wednesday',
    }

    pipe(
      readFileSync(filePath),
      E.map((c) => (typeof c === 'string' ? c : c.toString('utf-8'))),
      E.map((content) =>
        compileOperators({
          content,
          params,
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
      E.map((outputs) => {
        res = outputs.res
        expectedRes = outputs.expectedRes
      }),
      E.mapLeft((e) => {
        res = e.message
      })
    )

    expect(res).toBe(expectedRes)
  })
})
