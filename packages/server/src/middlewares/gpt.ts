import { ChatGPTAPI } from 'chatgpt-commonjs'
import { defineMiddleware } from './index'

const {
  CHATGPT_SESSION_TOKEN: sessionToken
} = process.env

const gpt = new ChatGPTAPI({ sessionToken })

export default defineMiddleware('gpt', (ctx, next) => {
  ctx.gptApi = gpt
  return next()
})

declare module '@openman/server' {
  interface Middlewares {
    gpt: {
      gptApi: ChatGPTAPI
    }
  }
}
