import { ChatCompletionRequestMessage, ChatCompletionRequestMessageRoleEnum, Configuration, OpenAIApi } from 'openai'

import { generate } from '@openman/core'
import * as process from 'process'

const openai = new OpenAIApi(new Configuration({ apiKey: process.env.OPENAI_API_KEY }))

const messages = [] as ChatCompletionRequestMessage[]

async function add(type: (typeof ChatCompletionRequestMessageRoleEnum)['System' | 'User'], content: string) {
  messages.push({ role: type, content })
  const completion = await openai.createChatCompletion({
    model: 'gpt-3.5-turbo',
    messages,
  })
  console.debug(type, content, completion.data, completion.data.choices[0])
  return completion.data
}

async function set(content: string) {
  return add('system', content)
}

async function send(message: string) {
  const d = await add('user', message)

  const m = d.choices[0].message
  if (!m)
    throw new Error('No message returned from OpenAI')

  messages.push(m)
  return m.content.trim()
}

describe('generate', function () {
  this.timeout(5000)
  it('should test.', async () => {
    await set('你是一只猫，你只能用喵字、符号、颜文字或者表情回答我。')
    console.log(
      await send('你好啊👋，摸摸头')
    )
  })
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
