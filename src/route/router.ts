import Router from 'koa-router'

import AuthLogin from './auth/auth-login'
import AuthLoginMobile from './auth/login/auth-login-mobile'
import AuthLoginVerify from './auth/login/auth-login-verify'
import UserInfo from './user-info'
import BbsSign from './bbs-sign'
import Koa from 'koa'
import GlobalVar from '../data/global-var'
import OtherUtil from '../util/other-util'
import AuthKey from './auth/auth-key'
import http from '../util/http'
import CryptoUtil from '../util/crypto-util'
import qrcodeFetch from './auth/login/qrcode/qrcode-fetch'
import qrcodeQuery from './auth/login/qrcode/qrcode-query'
import MyWishHistory from './my-wish-history'
const router: Router = new Router()

const routes = [
  {
    path: '/',
    route: async (ctx: Koa.Context) => {
      ctx.status = 200
      ctx.body = {
        code: ctx.status,
        msg: ctx.message,
        runtime: OtherUtil.getTimeStamp(false) - GlobalVar.runtime
      }
    }
  },
  {
    path: '/test',
    route: async (ctx: Koa.Context) => {
      const data = await http.get(
        'https://api-takumi.mihoyo.com/game_record/genshin/api/activities?server=cn_gf01&role_id=100838389',
        null,
        {
          cookie: ctx.cookies.request.headers.cookie,
          'x-rpc-app_version': GlobalVar.appVer,
          'x-rpc-client_type': 5,
          ds: CryptoUtil.genMiHoYoDS()
        }
      )
      ctx.status = 200
      ctx.body = data
    }
  },
  {
    path: '/auth/login',
    route: AuthLogin
  },
  {
    path: '/auth/login/mobile',
    route: AuthLoginMobile
  },
  {
    path: '/auth/login/verify',
    route: AuthLoginVerify
  },
  {
    path: '/auth/login/qrcode/fetch',
    route: qrcodeFetch
  },
  {
    path: '/auth/login/qrcode/query',
    route: qrcodeQuery
  },
  {
    path: '/auth/key',
    route: AuthKey
  },
  {
    path: '/user/info',
    route: UserInfo
  },
  {
    path: '/bbs/sign',
    route: BbsSign
  },
  {
    path: '/my/prayer/history',
    route: MyWishHistory
  },
  {
    path: '/my/wish/history',
    route: MyWishHistory
  }
]

routes.forEach((obj) => {
  router.get(obj.path, obj.route)
  router.post(obj.path, obj.route)
})

export default router.routes()
