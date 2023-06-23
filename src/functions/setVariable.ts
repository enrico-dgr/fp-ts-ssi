import { Deps } from './index'
import { Command } from '../doOnPattern'
import { getRegexForParamValue, regexForFuncParams } from '../utils/regex'

const regex: Command<Deps>['regex'] = /#set/

/**
 * On success, the function's line disappears, otherwise an error is shown.
 * @param depsOnPattern 
 * @param depsOnMatch 
 */
const action: Command<Deps>['action'] = (depsOnPattern, depsOnMatch) => {
  let res = `<!-- Error while setting variable -->`

  // get variable key
  const varKey = depsOnMatch.match.match(getRegexForParamValue('var'))

  // get variable value
  const varValue = depsOnMatch.match.match(getRegexForParamValue('value'))

  if (varKey && varValue) {
    // set in params obj
    depsOnPattern.params[varKey[0]] = varValue[0]

    res = ''
  } else {
    let functionParams = 'Unknown params'

    const matches = depsOnMatch.match.match(regexForFuncParams)

    if (matches) {
      functionParams = matches[0]
    }

    res = `<!-- Error while setting variable: ${functionParams} -->`
  }

  depsOnPattern.content = depsOnPattern.content.replace(depsOnMatch.match, res)
}

const command: Command<Deps> = {
  regex,
  action,
}

export default command
