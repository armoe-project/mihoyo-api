import Koa from "koa";
import Auth from "../module/auth";
import {setCookie} from "../module/common";

export default async (ctx: Koa.Context) => {
  let query: any = {}
  if (ctx.method === 'GET') {
    query = ctx.query
  } else if (ctx.method === 'POST') {
    query = ctx.request.body
  }

  const account = query.account
  const password = query.password
  if (!account && !password) {
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

  const result = await Auth.login(account, password)
  if(result.code == 200) {
    setCookie(ctx, {
      account_uid: result.data.account.uid,
      combo_token: result.data.combo.combo_token
    })
  }
  ctx.status = result.code
  ctx.body = result
}
