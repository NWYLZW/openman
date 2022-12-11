import Application, { Context } from 'koa'
import * as fs from 'fs'
import { Middlewares } from '@openman/server'
import { Narrow, U2I } from '../type'

import type {} from './error-catcher'
import type {} from './gpt'
import type {} from './logger'

declare module '@openman/server' {
  export interface Middlewares {}
}

export type MiddlewareNames = keyof Middlewares

export interface Middleware<T = {}> {
  (ctx: Context & T, next: () => Promise<any>): Promise<any>
  deps?: MiddlewareNames[]
}

export function defineMiddleware<
  N extends MiddlewareNames,
  DEPS extends MiddlewareNames[],
  M extends Middleware<U2I<
    N | DEPS[number] extends infer K extends MiddlewareNames
      ? Middlewares[K]
      : never
  >>
>(
  name: Narrow<N>,
  middleware: M,
  deps?: Narrow<DEPS>
) {
  middleware.deps = deps
  return middleware
}

export const useMiddlwares = (app: Application, names: 'all' | MiddlewareNames[]) => {
  const files = fs.readdirSync(__dirname)
    .filter(file => file.endsWith('.ts') && file !== 'index.ts')
    .map(file => file.slice(0, -3))
  const middlewares = files.reduce((acc, file) => {
    acc[file] = require(`./${file}`).default
    return acc
  }, {} as Record<string, Middleware>)
  const middlewareNames = names === 'all' ? Object.keys(middlewares) : [...new Set(names)]
  const middlewareList = middlewareNames
    .filter(name => !!middlewares[name])
    .map(name => middlewares[name])
  const middlewareDeps = middlewareList
    .filter(middleware => middleware.deps)
    .map(middleware => middleware.deps)
    .reduce((acc, deps) => {
      deps.forEach(dep => acc.add(dep))
      return acc
    }, new Set<MiddlewareNames>())
  const middlewareDepsList = [...middlewareDeps]
    .filter(name => !!middlewares[name])
    .map(name => middlewares[name])
  const middlewareAllList = [...new Set<Middleware>([...middlewareDepsList, ...middlewareList])]
  middlewareAllList.forEach(middleware => app.use(middleware))
}
