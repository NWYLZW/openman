import { generate } from '@openman/core'

describe('generate', function () {
  it('should create a man', () => {
    const messages = generate({
      名字: '未名酱',
      年龄: 19,
      身高: 168,
      体重: 48,
      三围: [90, 60, 90],
      性格: '可爱',
      种族: '猫娘'
    })
    messages.forEach(m => console.log(m))
  })
})
