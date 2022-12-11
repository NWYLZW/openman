import { ChatGPTAPI } from 'chatgpt-commonjs'
import { Context } from 'koa'

declare module 'koa' {
  class DefaultContext {
    gpt: ChatGPTAPI
  }
}

const {
  CHATGPT_SESSION_TOKEN: sessionToken
} = process.env

const gpt = new ChatGPTAPI({ sessionToken })

export const gptMiddlware = async (ctx: Context, next: () => Promise<any>) => {
  ctx.gpt = gpt
  return next()
}
