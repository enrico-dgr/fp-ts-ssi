import include from './include'
import setVariable from './setVariable'
import { Deps } from '..'
import { Command, buildDoOnPattern } from '../doOnPattern'
import echo from './echo'

const commands: Command<Deps>[] = [include, setVariable, echo]

export const compileFunctions = buildDoOnPattern(/<!-- *#[^>]+-->/g, commands)

export { Deps }
