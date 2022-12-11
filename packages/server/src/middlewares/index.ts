import { Context } from 'koa'
import type websockify from 'koa-websocket'
import * as fs from 'fs'
import { Middlewares } from '@openman/server'
import { Narrow, U2I } from '../type'

declare module '@openman/server' {
  export interface Middlewares {}
}

export type MiddlewareNames = keyof Middlewares

export interface Middleware<T = {}> {
  (ctx: Context & T, next: () => Promise<any>): Promise<any>
  deps?: MiddlewareNames[]
}

const middlewareFiles = fs.readdirSync(__dirname)
  .filter(file => file.endsWith('.ts') && file !== 'index.ts')
  .map(file => file.slice(0, -3))

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
  middleware.deps = deps ?? []
  return middleware
}

export function isMiddleware(m: any): m is Middleware {
  return typeof m === 'function'
    && !!m.deps
}

export const useMiddlwares = (app: websockify.App, names: 'all' | MiddlewareNames[]) => {
  const middlewares = new Set(names === 'all' ? middlewareFiles : names)
  middlewares.forEach(name => {
    const middleware = require(`./${name}`).default
    if (isMiddleware(middleware)) {
      if (middleware.deps) {
        middleware.deps.forEach(dep => middlewares.add(dep))
      }
      if (name.startsWith('ws-')) {
        app.ws.use(middleware)
      } else {
        app.use(middleware)
      }
    }
  })
}
