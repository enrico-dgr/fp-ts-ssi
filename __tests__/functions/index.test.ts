import * as E from 'fp-ts/Either'
import { pipe } from 'fp-ts/function'
import { readFileSync } from '@enrico-dgr/fp-ts-fs'
import path from 'path'
import { compileFunctions } from '../../src/functions'
import { getConstants } from '../../src/utils/doOnPatternTests'

const NAME = 'functions';

describe(NAME, () => {
  const CONSTANTS = getConstants(NAME);

  const CONSTS_INCLUDE = CONSTANTS.getActionConstants('include');
  it(CONSTS_INCLUDE.name, () => {
    let res = 'res'
    let expectedRes = 'expectedRes'

    const params = { ROOT: path.resolve(__dirname, '..', '..') }
    const options = { baseDir: path.resolve(__dirname, '../mocks/functions/include') }

    pipe(
      readFileSync(CONSTS_INCLUDE.filePath),
      E.map((c) => (typeof c === 'string' ? c : c.toString('utf-8'))),
      E.map((content) =>
        compileFunctions({
          content,
          filePath: CONSTS_INCLUDE.filePath,
          options,
          params,
        })
      ),
      E.chain((res) =>
        pipe(
          readFileSync(CONSTS_INCLUDE.resultFilePath),
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

  const CONSTS_SET = CONSTANTS.getActionConstants('setVariable');
  it(CONSTS_SET.name, () => {
    let res = 'res'
    let expectedRes = 'expectedRes'

    const params = {
      headFileName: undefined,
      BODY_FILE_NAME: undefined,
    }

    pipe(
      readFileSync(CONSTS_SET.filePath),
      E.map((c) => (typeof c === 'string' ? c : c.toString('utf-8'))),
      E.map((content) =>
        compileFunctions({
          content,
          filePath: CONSTS_SET.filePath,
          params,
        })
      ),
      E.chain((res) =>
        pipe(
          readFileSync(CONSTS_SET.resultFilePath),
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
    expect(params['headFileName']).toBe('head.shtml')
    expect(params['BODY_FILE_NAME']).toBe('body.shtml')
  })

  const CONSTS_ECHO = CONSTANTS.getActionConstants('echo');
  it(CONSTS_ECHO.name, () => {
    let res = 'res'
    let expectedRes = 'expectedRes'

    const params = {
      title: 'Amazing Site',
      heading: 'Look at this Amazing Site!',
    }

    pipe(
      readFileSync(CONSTS_ECHO.filePath),
      E.map((c) => (typeof c === 'string' ? c : c.toString('utf-8'))),
      E.map((content) =>
        compileFunctions({
          content,
          filePath: CONSTS_ECHO.filePath,
          params,
        })
      ),
      E.chain((res) =>
        pipe(
          readFileSync(CONSTS_ECHO.resultFilePath),
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
