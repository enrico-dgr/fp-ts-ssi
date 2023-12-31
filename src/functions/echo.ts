import { Deps } from './index'
import { Action } from '../doOnPattern'
import { getRegexForParamValue, regexForFuncParams } from '../utils/regex'
import { compileOperators } from '../operators'

const regex: Action<Deps>['regex'] = /#echo/i

/**
 * On success, the function's line disappears, otherwise an error is shown.
 * @param depsOnPattern 
 * @param depsOnMatch 
 */
const action: Action<Deps>['do'] = (depsOnPattern, depsOnMatch) => {
  let res = `<!-- Error while printing variable -->`

  // get variable key
  const varKey = depsOnMatch.match.match(getRegexForParamValue('var'))

  if (varKey) {
    // get in params obj
    
    res = compileOperators({
      ...depsOnPattern,
      content: `\${${varKey[0]}}`,
    })
  } else {
    let functionParams = 'Unknown params'

    const matches = depsOnMatch.match.match(regexForFuncParams)

    if (matches) {
      functionParams = matches[0]
    }

    res = `<!-- Error while printing variable: ${functionParams} -->`
  }

  depsOnPattern.content = depsOnPattern.content.replace(depsOnMatch.match, res)
}

const command: Action<Deps> = {
  regex,
  do: action,
}

export default command
