import * as E from 'fp-ts/Either'
import { pipe } from 'fp-ts/function'
import { readFileSync } from '@enrico-dgr/fp-ts-fs'
import { compileOperators } from '../../src/operators'
import { getConstants } from '../../src/utils/doOnPatternTests'

const NAME = 'operators'

describe(NAME, () => {
  const CONSTANTS = getConstants(NAME)

  const CONSTS_VAR = CONSTANTS.getActionConstants('getVariable')
  it(CONSTS_VAR.name, () => {
    let res = 'res'
    let expectedRes = 'expectedRes'

    const params = {
      weekDay: 'Wednesday',
    }

    pipe(
      readFileSync(CONSTS_VAR.filePath),
      E.map((c) => (typeof c === 'string' ? c : c.toString('utf-8'))),
      E.map((content) =>
        compileOperators({
          content,
          params,
        })
      ),
      E.chain((res) =>
        pipe(
          readFileSync(CONSTS_VAR.resultFilePath),
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
