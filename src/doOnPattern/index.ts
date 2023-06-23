type MinimalDeps = {
  content: string
}

export type BuildDeps<O extends {}> = O & MinimalDeps

type ActionDeps = { match: string }

export type Command<Deps extends MinimalDeps> = {
  /**
   * If the action needs another validation on the `match` before running.
   */
  regex?: RegExp
  action: (depsOnPattern: Deps, depsOnMatch: ActionDeps) => void
}

const buildOnCommand =
  <Deps extends MinimalDeps>(deps: Deps, match: string) =>
  (command: Command<Deps>) => {
    if (command.regex) {
      if (command.regex.test(match)) {
        command.action(deps, { match })
      }
    } else {
      command.action(deps, { match })
    }
  }

const buildOnMatch =
  <Deps extends MinimalDeps>(deps: Deps, commands: Command<Deps>[]) =>
  (match: string) => {
    const onCommand = buildOnCommand(deps, match)
    commands.forEach(onCommand)
  }

export const buildDoOnPattern =
  <Deps extends MinimalDeps>(pattern: RegExp, commands: Command<Deps>[]) =>
  (deps: Deps) => {
    // Commands and variables
    const ssiPatterns = deps.content.match(pattern)

    if (ssiPatterns) {
      const onMatch = buildOnMatch(deps, commands)
      ssiPatterns.forEach(onMatch)
    }

    return deps.content
  }
