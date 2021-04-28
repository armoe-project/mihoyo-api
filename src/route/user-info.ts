import Koa from 'koa'

import axios from 'axios'
import cryptoUtil from '../util/crypto-util'
import GlobalVar from '../data/global-var'

export default async (ctx: Koa.Context) => {
  let query: any = {}
  if (ctx.method === 'GET') {
    query = ctx.query
  } else if (ctx.method === 'POST') {
    query = ctx.request.body
  }

  const uid = query.uid
  let server = query.server
  if (!uid) {
    ctx.code = 400
    ctx.body = {
      code: ctx.status,
      msg: ctx.message,
      error: 'UID为空'
    }
    return
  }
  if (!server) {
    server = 'cn_gf01'
  }
  const ds = cryptoUtil.genMiHoYoDS()
  const cookie =
    'account_id=' +
    ctx.cookies.get('account_id') +
    '; cookie_token=' +
    ctx.cookies.get('cookie_token')
  const data = await axios.get(
    'https://api-takumi.mihoyo.com/game_record/genshin/api/index',
    {
      headers: {
        cookie: cookie,
        'x-rpc-app_version': GlobalVar.appVer,
        'x-rpc-client_type': GlobalVar.client_type,
        ds: ds
      },
      params: {
        server: server,
        role_id: uid
      }
    }
  )
  const info = data.data.data
  if (!info) {
    ctx.status = 400
    ctx.body = {
      code: ctx.status,
      msg: ctx.message,
      error: data.data.message,
      error_code: data.data.retcode
    }
  } else {
    ctx.status = 200
    ctx.body = {
      code: ctx.status,
      msg: ctx.message,
      data: info
    }
  }
}
