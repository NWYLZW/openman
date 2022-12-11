import { defineMiddleware } from './index'

function createLogger(name: string) {
  return new Proxy(console, {
    get(target, propKey) {
      const prop = target[propKey]
      if (typeof prop !== 'function') {
        return prop
      }
      return function(...args: any[]) {
        return prop(`[${name}]`, ...args)
      }
    }
  })
}

export default defineMiddleware('logger', async (ctx, next) => {
  const tag = `${ctx.method} - ${ctx.url}`
  ctx.logger = createLogger(tag)
  console.log(`--> ${new Date().toLocaleString()} ${tag}`)
  const r = await next()
  console.log(`<-- ${new Date().toLocaleString()} ${tag}: ${ctx.status}`)
  return r
})

declare module '@openman/server' {
  interface Middlewares {
    logger: {
      logger: Console
    }
  }
}