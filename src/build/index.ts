import include from "./include"

type Deps = {
  content: string
  filePath: string
  params: Object
}

type ActionDeps = Deps & { match: string }

export type Command = {
  regex: RegExp
  action: (deps: ActionDeps) => void
}

const commands: Command[] = [include]

export const build = (deps: Deps) => {
  const ssiCommands = deps.content.match(/<!-- *#[^-\->]+-->/g)

  if (ssiCommands) {
    ssiCommands.forEach((match) =>
      commands.forEach(
        (command) =>
          command.regex.test(match) && command.action({ ...deps, match })
      )
    )
  }

  return deps.content
}
