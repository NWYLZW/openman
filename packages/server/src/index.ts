import Application from 'koa'
import { gptMiddlware } from './gpt'

const {
  HOST = '127.0.0.1',
  PORT = 8080
} = process.env

const app = new Application()
  .use(gptMiddlware)
  .use(async (ctx, next) => {
    console.log(`${ctx.method}: ${ctx.url}`)
    try {
      ctx.body = await next()
      ctx.status = 200
    } catch (e) {
      ctx.status = 500
      return {
        msg: e.msg
      }
    }
  })

app.listen(Number(PORT), HOST, () => {
  console.log(`Application is listening on ${HOST}:${PORT}`)
})
