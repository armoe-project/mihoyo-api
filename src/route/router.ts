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
import { resultError, resultOK } from '../module/common'
import userStatus from './user-status'
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
      const create_mmt = await http.get(
        'https://webapi.account.mihoyo.com/Api/create_mmt',
        {
          scene_type: 1,
          now: Date.now(),
          reason: 'user.mihoyo.com%23%2Flogin%2Fpassword',
          t: Date.now()
        }
      )
      if (create_mmt.code != 200) {
        ctx.status = 400
        ctx.body = resultError({
          error: create_mmt.data.msg,
          error_code: create_mmt.data.status
        })
        return
      }
      const geetest_gettype = await http.get(
        'https://api.geetest.com/gettype.php',
        {
          gt: create_mmt.data.mmt_data.gt
        }
      )
      ctx.status = 200
      ctx.body = resultOK({
        create_mmt: create_mmt.data.mmt_data,
        geetest_gettype: JSON.parse(geetest_gettype.replace(/\(/, '').replace(/\)/, ''))
      })
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
    path: '/user/status',
    route: userStatus
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
