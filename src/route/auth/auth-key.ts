import Koa from 'koa'
import { getQuery } from '../../module/common'
import Auth from '../../module/auth'
import OtherUtil from '../../util/other-util'

/**
 * @author 真心
 * @date 2021/2/15 16:17
 * @email qgzhenxin@qq.com
 * @description AuthKey
 */
export default async (ctx: Koa.Context) => {
  let query: any = getQuery(ctx)

  const type = query.type

  if (!type) {
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

  const result = await Auth.authKey(
    type,
    OtherUtil.cookieToJSON(ctx.cookies.request.headers.cookie)
  )
  ctx.status = result.code
  ctx.body = result
}
