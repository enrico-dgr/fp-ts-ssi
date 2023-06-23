import {
  getRegexForParamValue,
  regexForFuncParams,
} from '../../src/utils/regex'

describe('Utils - regex', () => {
  let testName = ''

  testName = 'getRegexForParamValue'
  it(testName, () => {
    let res = 'res'
    let expectedRes = 'expectedRes'

    const matches = '<!--#set var="ROOT" value="/root/path"-->'.match(
      getRegexForParamValue('var')
    )

    if (matches) {
      res = matches[0]
      expectedRes = 'ROOT'
    }

    expect(res).toBe(expectedRes)
  })

  testName = 'regexForFuncParams'
  it(testName, () => {
    let res = 'res'
    let expectedRes = 'expectedRes'

    const matches = '<!--#set var="ROOT" value="/root/path"-->'.match(
      regexForFuncParams
    )

    if (matches) {
      res = matches[0]
      expectedRes = 'var="ROOT" value="/root/path"'
    }

    expect(res).toBe(expectedRes)
  })
})
