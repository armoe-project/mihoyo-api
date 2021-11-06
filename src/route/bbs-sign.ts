import Koa from 'koa'
import axios from 'axios'
import CryptoUtil from '../util/crypto-util'
import GlobalVar from '../data/global-var'

export default async (ctx: Koa.Context) => {
  let query: any = {}
  if (ctx.method === 'GET') {
    query = ctx.query
  } else if (ctx.method === 'POST') {
    query = ctx.request.body
  }
  const id = query.id

  const cookie = `stuid=${ctx.cookies.get('stuid')}; stoken=${ctx.cookies.get(
    'stoken'
  )};`
  if (!id) {
    const list: any = []
    for (let i = 1; i <= 6; i++) {
      const result = await sign(cookie, i)
      list.push(result)
    }
    ctx.status = 200
    ctx.body = {
      code: ctx.status,
      msg: ctx.message,
      data: list
    }
    return
  }
  const result = await sign(cookie, id)
  ctx.status = result.code
  result.msg = ctx.message
  ctx.body = result
}

async function sign(cookie: string, id: string | number) {
  const data = await axios.post(
    'https://bbs-api.mihoyo.com/apihub/sapi/signIn',
    {
      gids: id
    },
    {
      headers: {
        ds: CryptoUtil.genMiHoYoDS270(),
        'x-rpc-client_type': 2,
        'x-rpc-app_version': '2.7.0',
        referer: 'https://app.mihoyo.com',
        cookie: cookie
      }
    }
  )
  const status = data.data.retcode
  if (status != 0) {
    return {
      code: 400,
      id: id,
      name: getNameById(id),
      msg: data.data.message,
      error_code: data.data.retcode
    }
  }
  return {
    code: 200,
    msg: '签到成功!',
    id: id,
    name: getNameById(id)
  }
}

function getNameById(id: string | number): string {
  switch (id) {
    case 6:
    case '6':
      return '崩坏：星穹铁道'
    case 5:
    case '5':
      return '大别野'
    case 4:
    case '4':
      return '未定事件簿'
    case 3:
    case '3':
      return '崩坏学园2'
    case 2:
    case '2':
      return '原神'
    case 1:
    case '1':
      return '崩坏3'
    default:
      return '未知'
  }
}
