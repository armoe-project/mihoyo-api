import cryptoUtil from '../util/crypto-util'
import axios from 'axios'
import Koa from 'koa'
import Http from '../util/http'
import CryptoUtil from '../util/crypto-util'
import GlobalVar from '../data/global-var'

export default async (ctx: Koa.Context) => {
    let query: any = {}
    if (ctx.method === 'GET') {
        query = ctx.query
    } else if (ctx.method === 'POST') {
        query = ctx.request.body
    }
    const account_id = ctx.cookies.get('account_id')
    const cookie_token = ctx.cookies.get('cookie_token')
    const cookie =
        `account_id=${account_id}; cookie_token=${cookie_token}`

    if (!account_id || !cookie_token) {
        ctx.status = 400
        ctx.body = {
            code: ctx.status,
            msg: ctx.message,
            error: '未登录'
        }
        return
    }

    const userInfo = await Http.get("https://api-takumi.mihoyo.com/binding/api/getUserGameRolesByCookie", {}, {
        cookie: cookie
    })
    if (userInfo.retcode != 0) {
        ctx.status = 400
        ctx.body = {
            code: ctx.status,
            msg: ctx.message,
            error: userInfo.message,
            error_code: userInfo.retcode
        }
        return
    }
    const roles = userInfo.data.list
    let name = ''
    let uid = ''
    for (const role of roles) {
        if (role.game_biz == 'hk4e_cn' || role.region == 'cn_gf01') {
            name = role.nickname
            uid = role.game_uid
            break
        }
    }

    const params = {
        server: 'cn_gf01',
        role_id: uid
    }

    const data = await Http.get("https://api-takumi-record.mihoyo.com/game_record/app/genshin/api/dailyNote", params, {
        cookie: cookie,
        'x-rpc-app_version': GlobalVar.appVer,
        'x-rpc-client_type': GlobalVar.client_type,
        ds: CryptoUtil.genMiHoYoDS(params, '')
    })
    if (data.retcode != 0) {
        ctx.status = 400
        ctx.body = {
            code: ctx.status,
            msg: ctx.message,
            error: data.message,
            error_code: data.retcode
        }
        return
    } else {
        const result = data.data
        ctx.body = {
            code: 200,
            data: data.data
        }
    }

}
