export type U2I<U> = (U extends any ? (k: U) => void : never) extends ((k: infer I) => void) ? I : never

export type Awaitable<T> = T | PromiseLike<T>

export type Cast<A, B> = A extends B ? A : B

export type Primitive = string | number | boolean | bigint | symbol | undefined | null

export type Narrow<T> = Cast<T, [] | (T extends Primitive ? T : never) | ({
  [K in keyof T]: K extends typeof Symbol.species
    ? T[K]
    : Narrow<T[K]>
})>
