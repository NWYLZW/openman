import { defineMiddleware } from './index'

export default defineMiddleware('ws-chat', async (ctx, next) => {
  if (!ctx.url.startsWith('/ws/chat')) return

  ctx.websocket.on('message', msg => {
    console.log(msg)
  })
  ctx.websocket.on('close', () => {
    console.log('close')
  })
})

declare module '@openman/server' {
  export interface Middlewares {
    'ws-chat': {}
  }
}
