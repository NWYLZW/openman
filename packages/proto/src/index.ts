import promisify, { EventEmitterPromisify } from 'ee-promisify'

export namespace Server {
  export type Messages = {}
}

export namespace Client {
  export type Messages = {}
}

type EE = Pick<WebSocket, 'onclose' | 'onopen' | 'onerror' | 'onmessage'>

export class Api {
  private eepMap = new Map<string, EventEmitterPromisify<undefined, EE>>()
  constructor(
    private host: string,
    private port: number,
    private wsCls: typeof WebSocket = WebSocket
  ) {
  }
  initWs(path: string) {
    const ws = new this.wsCls(`ws://${this.host}:${this.port}${path}`) as EE
    const eep = promisify(ws)
    this.eepMap.set(path, eep)
    return eep
  }
}
