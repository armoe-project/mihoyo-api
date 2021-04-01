import Koa from 'koa'
import Auth from '../../../../module/auth'
import { setCookie } from '../../../../module/common'

export default async (ctx: Koa.Context) => {
  let query: any = {}
  if (ctx.method === 'GET') {
    query = ctx.query
  } else if (ctx.method === 'POST') {
    query = ctx.request.body
  }

  const { device } = query
  if (!device) {
    ctx.status = 400
    ctx.body = {
      code: ctx.status,
      msg: ctx.message,
      dada: {
        msg: '参数错误'
      }
    }
    return
  }

  const result = await Auth.qrcodeFatch(device)
  ctx.status = result.code
  ctx.body = result
}
