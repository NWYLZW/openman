import { ChatGPTAPI } from 'chatgpt'

export async function example() {
  const api = new ChatGPTAPI({
    sessionToken: process.env.CHATGPT_SESSION_TOKEN,
  })
  const response = await api.sendMessage('Hello')
  console.log(response)
}
