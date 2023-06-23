import include from './include'
import setVariable from './setVariable'
import { Deps } from '..'
import { Action, buildDoOnPattern } from '../doOnPattern'
import echo from './echo'

const commands: Action<Deps>[] = [include, setVariable, echo]

export const compileFunctions = buildDoOnPattern(/<!-- *#[^>]+-->/g, commands)

export { Deps }
