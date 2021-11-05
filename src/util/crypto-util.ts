import NodeRSA from 'node-rsa'
import crypto from 'crypto'
import OtherUtil from './other-util'
import GlobalVar from '../data/global-var'

class CryptoUtil {
  static genMiHoYoSign(params: any) {
    const paramsKey = Object.keys(params).sort()
    const p: any = {}
    for (const s of paramsKey) {
      p[s] = params[s]
    }
    const _appKey = 'd0d3a7342df2026a70f650b907800111'
    let data: string = ''
    for (const key in p) {
      data = data + key
      data = data + '='
      data = data + p[key]
      data = data + '&'
    }
    data = data.substring(0, data.length - 1)
    return this.sha256(data, _appKey)
  }

  static sha256(data: string, secret: string) {
    return crypto.createHmac('sha256', secret).update(data).digest('hex')
  }

  static genMiHoYoDS(params: any = {}, body: string) {
    const salt = GlobalVar.ds_salt
    const queryArr: string[] = []
    for (const test in params) {
      queryArr.push(`${test}=${params[test]}`)
    }
    queryArr.reverse()
    let query = ""
    queryArr.forEach(str => {
      query += `${str}&`
    })
    query = query.substring(0, query.length - 1)
    console.log(query);
    const timestamp = OtherUtil.getTimeStamp(true)
    const randomStr = Math.random().toString(36).slice(-6)
    let param = `salt=${salt}&t=${timestamp}&r=${randomStr}&b=${body}&q=${query}`
    param = crypto.createHash('md5').update(param).digest('hex')
    return timestamp + ',' + randomStr + ',' + param
  }

  static getMiHoYoRSAPassword(password: string) {
    // 公钥
    const _pubKey =
      '-----BEGIN PUBLIC KEY-----\nMIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQDDvekdPMHN3AYhm/vktJT+YJr7\ncI5DcsNKqdsx5DZX0gDuWFuIjzdwButrIYPNmRJ1G8ybDIF7oDW2eEpm5sMbL9zs\n9ExXCdvqrn51qELbqj0XxtMTIpaCHFSI50PfPpTFV9Xt/hmyVwokoOXFlAEgCn+Q\nCgGs52bFoYMtyi+xEQIDAQAB\n-----END PUBLIC KEY-----'
    const nodeRSA = new NodeRSA(_pubKey)
    nodeRSA.setOptions({ encryptionScheme: 'pkcs1' })
    return nodeRSA.encrypt(password, 'base64')
  }
}

export default CryptoUtil
