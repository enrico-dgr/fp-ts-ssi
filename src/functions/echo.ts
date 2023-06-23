import { Deps } from './index'
import { Command } from '../doOnPattern'
import { getRegexForParamValue, regexForFuncParams } from '../utils/regex'
import { compileOperators } from '../operators'

const regex: Command<Deps>['regex'] = /#echo/

/**
 * On success, the function's line disappears, otherwise an error is shown.
 * @param depsOnPattern 
 * @param depsOnMatch 
 */
const action: Command<Deps>['action'] = (depsOnPattern, depsOnMatch) => {
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

const command: Command<Deps> = {
  regex,
  action,
}

export default command
