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

  const { ticket, device } = query
  if (!ticket && !device) {
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
  const result = await Auth.qrcodeQuery(ticket, device)
  if (result.code == 200) {
    if (result.data.data != null) {
      setCookie(ctx, {
        account_uid: result.data.data.uid,
        combo_token: result.data.data.combo.combo_token
      })
    }
  }
  ctx.status = result.code
  ctx.body = result
}
