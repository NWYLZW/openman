import Application from 'koa'
import { useMiddlwares } from './middlewares'

const {
  HOST = '127.0.0.1',
  PORT = 8080
} = process.env

const app = new Application()

useMiddlwares(app, 'all')

app.listen(Number(PORT), HOST, () => {
  console.log(`Application is listening on ${HOST}:${PORT}`)
})
