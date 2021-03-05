import otherUtil from '../util/other-util'
import Koa from 'koa'
import http from '../util/http'
import { getQuery, resultError, resultOK, setCookie } from '../module/common'

export default async (ctx: Koa.Context) => {
  let query: any = getQuery(ctx)

  const phone = query.phone
  const code = query.code

  if (!phone && !code) {
    const result = resultError({
      error: '手机号或验证码为空'
    })
    ctx.status = result.code
    ctx.body = result
    return
  }

  const time = otherUtil.getTimeStamp(false)
  const data = await http.post(
    'https://webapi.account.mihoyo.com/Api/login_by_mobilecaptcha',
    {
      mobile: phone,
      mobile_captcha: code,
      t: time
    },
    null,
    1
  )
  if (data.data.status !== 1) {
    const result = resultError({
      error: data.data.msg,
      error_code: data.data.status
    })
    ctx.status = result.code
    ctx.body = result
    return
  }
  console.log(data)
  const account_id = data.data.account_info.account_id
  const ticket = data.data.account_info.weblogin_token
  const stoken_data = await http.get(
    `https://api-takumi.mihoyo.com/auth/api/getMultiTokenByLoginTicket?login_ticket=${ticket}&token_types=3&uid=${account_id}`
  )
  const cookie_stoken = stoken_data.data.list[0].token
  const ctoken_data = await http.get(
    `https://webapi.account.mihoyo.com/Api/cookie_accountinfo_by_loginticket?login_ticket=${ticket}&t=${time}`
  )
  const cookie_ctoken = ctoken_data.data.cookie_info.cookie_token
  const cookie_str = setCookie(ctx, {
    account_id: account_id,
    stuid: account_id,
    cookie_token: cookie_ctoken,
    stoken: cookie_stoken
  })
  const result = resultOK({
    info: data.data.account_info,
    cookie: cookie_str
  })
  ctx.status = result.code
  ctx.body = result
}
