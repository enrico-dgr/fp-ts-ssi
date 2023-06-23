import include from './include'
import { Deps } from '..'
import { Command, buildDoOnPattern } from '../doOnPattern'

const commands: Command<Deps>[] = [include]

export const compileFunctions = buildDoOnPattern(/<!-- *#[^>]+-->/g, commands)

export { Deps }
