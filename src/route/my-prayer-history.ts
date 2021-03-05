import Koa from 'koa'
import Auth from '../module/auth'
import http from '../util/http'
import OtherUtil from '../util/other-util'

/**
 * @author 真心
 * @date 2021/2/15 16:10
 * @email qgzhenxin@qq.com
 * @description 祈愿；历史记录
 */
export default async (ctx: Koa.Context) => {
  let query: any = {}
  if (ctx.method === 'GET') {
    query = ctx.query
  } else if (ctx.method === 'POST') {
    query = ctx.request.body
  }
  let type = query.type
  let page = query.page
  let size = query.size

  if (!type) {
    type = 301
  }
  if (!page) {
    page = 1
  }
  if (!size) {
    size = 6
  }
  const types: any = {
    100: '新手祈愿',
    200: '常驻祈愿',
    301: '角色活动祈愿',
    302: '武器活动祈愿'
  }

  const auth_appid = 'webview_gacha'
  let data: any = await Auth.authKey(
    auth_appid,
    OtherUtil.cookieToJSON(ctx.cookies.request.headers.cookie)
  )

  if (data.code != 200) {
    ctx.status = 400
    ctx.body = {
      code: ctx.status,
      msg: ctx.message,
      data: data.data
    }
    return
  }
  const authkey = data.data.authkey
  const params = {
    authkey_ver: 1,
    sign_type: 2,
    auth_appid: auth_appid,
    gacha_id: 'd86c391b7f731f5df2acdbe92138cbf1930cfa',
    lang: 'zh-cn',
    region: 'cn_gf01',
    authkey: authkey,
    game_biz: 'hk4e_cn',
    gacha_type: type,
    page: page,
    size: size
  }

  data = await http.get(
    'https://hk4e-api.mihoyo.com/event/gacha_info/api/getGachaLog',
    params
  )
  if (data.retcode != 0) {
    ctx.status = 400
    ctx.body = {
      code: ctx.status,
      msg: ctx.message,
      data: {
        error: data.message,
        error_code: data.retcode
      }
    }
    return
  }
  ctx.status = 200
  ctx.body = {
    code: ctx.status,
    msg: ctx.message,
    data: {
      name: types[type],
      page: data.data.page,
      list: data.data.list
    }
  }
}
