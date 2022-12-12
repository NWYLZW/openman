import Application from 'koa'
import websockify from 'koa-websocket'
import { useMiddlwares } from '../src/middlewares'

const app = websockify(new Application())

const conf = {
  host: '127.0.0.1',
  port: 13111,
}

before(async () => {
  await new Promise<void>(re => app.listen(conf.port, conf.host, re))
})

describe('Middlewares:ws', function () {
  useMiddlwares(app, ['ws-chat'])
  it('should work', async () => {
    console.log('123')
  })
})
