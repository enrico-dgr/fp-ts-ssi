import include from './include'

export type Deps = {
  content: string
  filePath: string
  params: Record<string, string>
}

type ActionDeps = { match: string }

export type Command = {
  regex: RegExp
  action: (fileDeps: Deps, actionDeps: ActionDeps) => void
}

const commands: Command[] = [include]

export const build = (deps: Deps) => {
  // Commands and variables
  const ssiPatterns = deps.content.match(/<!-- *#[^>]+-->/g)

  if (ssiPatterns) {
    ssiPatterns.forEach((match) =>
      commands.forEach(
        (command) =>
          command.regex.test(match) && command.action(deps, { match })
      )
    )
  }

  return deps.content
}
