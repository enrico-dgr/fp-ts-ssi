import { Command } from './index'

const regex: Command['regex'] = /\$\{[^\}]*\}/

const action: Command['action'] = (fileDeps, actionDeps) => {
  let res = 'undefined'

  const variableMatches = actionDeps.match.match(/(?<=\$\{)[^\}]*(?=\})/)

  if (variableMatches) {
    const variable = variableMatches[0]

    if (fileDeps.params[variable]) {
      res = fileDeps.params[variable]
    }
  }

  fileDeps.content = fileDeps.content.replace(actionDeps.match, res)
}

const command: Command = {
  regex,
  action,
}

export default command
