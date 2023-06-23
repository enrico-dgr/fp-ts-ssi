import { Deps as FullDeps } from '..'
import { Action, buildDoOnPattern } from '../doOnPattern'
import getVariable from './getVariable'

export type Deps = Pick<FullDeps, 'content' | 'params'>

const commands: Action<Deps>[] = [getVariable]

export const compileOperators = buildDoOnPattern(/\$\{[^\}]*\}/g, commands)