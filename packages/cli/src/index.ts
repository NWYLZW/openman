import { ChatGPTAPI } from 'chatgpt-commonjs'

export async function example() {
  const api = new ChatGPTAPI({
    sessionToken: process.env.CHATGPT_SESSION_TOKEN,
  })
  const response = await api.sendMessage('你好')
  console.log(response)
}
