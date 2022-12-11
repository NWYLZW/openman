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

export const useMiddlwares = (app: websockify.App, names: 'all' | (MiddlewareNames | string)[]) => {
  const middlewares = new Set(names === 'all' ? middlewareFiles : names)
  const map = new Map<string, Middleware>()
  const depsMap = new Map<string, string[]>()
  middlewares.forEach(name => {
    const middleware = require(`./${name}`).default
    if (!isMiddleware(middleware)) return

    map.set(name, middleware)
    if (middleware.deps) {
      middleware.deps.forEach(dep => middlewares.add(dep))
      depsMap.set(name, middleware.deps)
    }
  })
  const tag = {
    ws: new Map<string, boolean>(),
    nows: new Map<string, boolean>()
  }
  function register(name: string) {
    const middleware = map.get(name)
    if (!middleware) return

    depsMap
      .get(name)
      ?.forEach(dep => register(dep))

    if (name.startsWith('ws-')) {
      if (tag.ws.get(name)) return

      console.log(`[MIDDLEWARE] Registering ${name}...`)
      tag.ws.set(name, true)
      app.ws.use(middleware)
    } else {
      if (tag.nows.get(name)) return

      console.log(`[MIDDLEWARE] Registering ${name}...`)
      tag.nows.set(name, true)
      app.use(middleware)
    }
  }
  middlewares.forEach(name => register(name))
}
