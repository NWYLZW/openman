export const 亲人关系 = {
  父女: '',
  父子: '',
  母女: '',
  母子: '',
  哥妹: '',
  姐妹: '',
  弟姐: '',
  妹姐: '',
} as const

export const 关系 = {
  朋友: '',
  主人: '',
  ...(Object.entries(亲人关系).reduce((acc, [k, v]) => ({
    ...acc,
    [`亲人${k}`]: v
  }), {} as Record<`亲人${keyof typeof 亲人关系}`, string>)),
} as const
