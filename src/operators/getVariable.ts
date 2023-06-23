import { Deps } from '.'
import { Action } from '../doOnPattern'

const regex = /\$\{[^\}]*\}/;

const action: Action<Deps>['do'] = (depsOnPattern, depsOnMatch) => {
  let res = 'undefined'

  const variableMatches = depsOnMatch.match.match(/(?<=\$\{)[^\}]*(?=\})/)

  if (variableMatches) {
    const variable = variableMatches[0]

    if (depsOnPattern.params[variable]) {
      res = depsOnPattern.params[variable] ?? 'undefined'
    }
  }

  depsOnPattern.content = depsOnPattern.content.replace(depsOnMatch.match, res)
}

const command: Action<Deps> = {
  regex,
  do: action,
}

export default command
