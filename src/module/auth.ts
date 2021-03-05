import CryptoUtil from '../util/crypto-util'
import http from '../util/http'
import { resultError, resultOK } from './common'

/**
 * @author 真心
 * @date 2021/2/16 19:24
 * @email qgzhenxin@qq.com
 * @description Auth
 */

class Auth {
  static async authKey(type: string, cookies: any) {
    const uid = cookies.account_uid
    const combo_token = cookies.combo_token

    const params: any = {
      app_id: 4,
      channel_id: 1,
      open_id: uid,
      combo_token: combo_token,
      auth_appid: type,
      region: 'cn_gf01',
      ext: ''
    }
    params['sign'] = CryptoUtil.genMiHoYoSign(params)
    params['authkey_ver'] = 1
    params['sign_type'] = 2
    const data: any = await http.post(
      'https://hk4e-sdk.mihoyo.com/hk4e_cn/combo/granter/login/genAuthKey',
      params
    )
    if (data.retcode != 0) {
      return resultError({
        error: data.message,
        error_code: data.retcode
      })
    }
    const authkey = data.data.authkey
    return resultOK({ authkey: authkey })
  }

  static async login(account: string, password: string) {
    let data: any = await http.post(
      'https://hk4e-sdk.mihoyo.com/hk4e_cn/mdk/shield/api/login',
      {
        account: account,
        password: CryptoUtil.getMiHoYoRSAPassword(password),
        is_crypto: true
      }
    )
    if (data.retcode != 0) {
      return resultError({
        error: data.message,
        error_code: data.retcode
      })
    }
    const info = data.data.account
    const token = info.token
    const uid = info.uid
    const paramsData = {
      uid: uid,
      guest: false,
      token: token
    }
    let params: any = {
      app_id: 4,
      channel_id: 1,
      data: JSON.stringify(paramsData),
      device: ''
    }
    params['sign'] = CryptoUtil.genMiHoYoSign(params)
    data = await http.post(
      'https://hk4e-sdk.mihoyo.com/hk4e_cn/combo/granter/login/v2/login',
      params
    )
    return resultOK({
      account: info,
      combo: data.data,
      cookie: `account_uid=${info.uid}; combo_token=${data.data.combo_token};`
    })
  }
}

export default Auth
