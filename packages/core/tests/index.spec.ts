import { generate } from '@openman/core'
import { 性格 } from '../src'

describe('generate', function () {
  it('should create a man', () => {
    const content = generate({
      名字: '白菲酱',
      年龄: '不可以说的秘密',
      身高: 178,
      体重: 48,
      三围: [90, 60, 90],
      性格: 性格.可爱,
    })
    console.log(content)
  })
})
