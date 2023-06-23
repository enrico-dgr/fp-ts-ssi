import { Deps as FullDeps } from '..'
import { Command, buildDoOnPattern } from '../doOnPattern'
import getVariable from './getVariable'

export type Deps = Pick<FullDeps, 'content' | 'params'>

const commands: Command<Deps>[] = [getVariable]

export const compileOperators = buildDoOnPattern(/\$\{[^\}]*\}/, commands)