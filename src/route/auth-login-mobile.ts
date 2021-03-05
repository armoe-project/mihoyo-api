import Koa from 'koa'

import axios from 'axios'
import OtherUtil from '../util/other-util'

export default async (ctx: Koa.Context) => {
  let query: any = {}
  if (ctx.method === 'GET') {
    query = ctx.query
  } else if (ctx.method === 'POST') {
    query = ctx.request.body
  }

  const phone = query.phone
  if (!phone) {
    ctx.status = 400
    ctx.body = {
      code: ctx.status,
      msg: ctx.message,
      error: '手机号为空'
    }
    return
  }
  const time = OtherUtil.getTimeStamp(false)
  const data: any = await axios
    .post(
      'https://webapi.account.mihoyo.com/Api/create_mobile_captcha',
      'action_type=login&mobile=' + phone + '&t=' + time
    )
    .catch((res: any) => {
      console.log(res.response)
    })
  if (data.data.code !== 200) {
    ctx.status = 400
    ctx.body = {
      code: ctx.status,
      msg: ctx.message,
      error: data.data.data.msg
    }
  } else {
    ctx.status = 200
    ctx.body = {
      code: ctx.status,
      msg: ctx.message,
      data: data.data.data
    }
  }
}
