type MinimalDeps = {
  content: string
}

export type BuildDeps<O extends {}> = O & MinimalDeps

type ActionDeps = { match: string }

export type Action<Deps extends MinimalDeps> = {
  /**
   * If the action needs another validation on the `match` before running.
   */
  regex?: RegExp
  do: (depsOnPattern: Deps, depsOnMatch: ActionDeps) => void
}

const buildOnAction =
  <Deps extends MinimalDeps>(deps: Deps, match: string) =>
  (command: Action<Deps>) => {
    if (command.regex) {
      if (command.regex.test(match)) {
        command.do(deps, { match })
      }
    } else {
      command.do(deps, { match })
    }
  }

const buildOnMatch =
  <Deps extends MinimalDeps>(deps: Deps, commands: Action<Deps>[]) =>
  (match: string) => {
    const onCommand = buildOnAction(deps, match)
    commands.forEach(onCommand)
  }

export const buildDoOnPattern =
  <Deps extends MinimalDeps>(pattern: RegExp, commands: Action<Deps>[]) =>
  (deps: Deps) => {
    // Commands and variables
    const ssiPatterns = deps.content.match(pattern)

    if (ssiPatterns) {
      const onMatch = buildOnMatch(deps, commands)
      ssiPatterns.forEach(onMatch)
    }

    return deps.content
  }
