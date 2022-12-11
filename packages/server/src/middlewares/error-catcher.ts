import { defineMiddleware } from './index'
import type {} from './logger'

export default defineMiddleware('error-catcher', async (ctx, next) => {
  try {
    ctx.body = await next()
    ctx.status = 200
  } catch (e) {
    ctx.logger.error(e)
    ctx.status = 500
    return {
      msg: e.msg
    }
  }
}, ['logger'])

declare module '@openman/server' {
  interface Middlewares {
    'error-catcher': {}
  }
}