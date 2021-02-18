/**
 * @author 真心
 * @date 2021/2/16 19:25
 * @email qgzhenxin@qq.com
 * @description Common
 */
import Koa from "koa";
import OtherUtil from "../util/other-util";

function getQuery(ctx: Koa.Context) {
  if (ctx.method === 'GET') {
    return ctx.query
  } else if (ctx.method === 'POST') {
    return ctx.request.body
  }
}

function resultOK(data: any): BaseResult {
  return _result(200, data)
}

function resultError(data: any): BaseResult {
  return _result(400, data)
}

function _result(code: number, data: any) {
  const status: any = {
    200: 'OK',
    400: 'Error'
  }
  return {
    code: code,
    msg: status[code],
    data: data
  }
}

function setCookie(ctx: Koa.Context, cookies: any): string {
  let cookie_str = ''
  for (const key in cookies) {
    const cookie = _setCookie(ctx, {key: key, value: cookies[key]})
    cookie_str = cookie_str + cookie + ' '
  }
  cookie_str = cookie_str.trim()
  return cookie_str
}

function _setCookie(ctx: Koa.Context, cookie: BaseObject) {
  const time = OtherUtil.getTimeStamp(false)
  const eff_time = 720 * 60 * 60 * 1000
  ctx.cookies.set(cookie.key, cookie.value, {
    maxAge: eff_time,
    expires: new Date(time + eff_time),
    httpOnly: false,
    overwrite: true
  })
  return `${cookie.key}=${cookie.value};`
}

interface BaseResult {
  code: number,
  msg: string,
  data: any
}

interface BaseObject {
  key: string,
  value: any,
  names?: string[]
}

export {resultError, resultOK, getQuery, setCookie}
export {BaseResult}
