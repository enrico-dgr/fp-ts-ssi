import { Deps } from '.'
import { Command } from '../doOnPattern'

const action: Command<Deps>['action'] = (depsOnPattern, depsOnMatch) => {
  let res = 'undefined'

  const variableMatches = depsOnMatch.match.match(/(?<=\$\{)[^\}]*(?=\})/)

  if (variableMatches) {
    const variable = variableMatches[0]

    if (depsOnPattern.params[variable]) {
      res = depsOnPattern.params[variable]
    }
  }

  depsOnPattern.content = depsOnPattern.content.replace(depsOnMatch.match, res)
}

const command: Command<Deps> = {
  action,
}

export default command
