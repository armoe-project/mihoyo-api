import NodeRSA from 'node-rsa'
import crypto from 'crypto'
import OtherUtil from "./other-util";

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

  static genMiHoYoDS() {
    const salt = 'h8w582wxwgqvahcdkpvdhbh2w9casgfl'

    const timestamp = OtherUtil.getTimeStamp(true)
    const randomStr = Math.random().toString(36).slice(-6)
    let param = 'salt=' + salt + '&t=' + timestamp + '&r=' + randomStr
    param = crypto.createHash('md5').update(param).digest('hex')
    return timestamp + ',' + randomStr + ',' + param
  }

  static getMiHoYoRSAPassword(password: string) {
    // 公钥
    const _pubKey = '-----BEGIN PUBLIC KEY-----\nMIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQDDvekdPMHN3AYhm/vktJT+YJr7\ncI5DcsNKqdsx5DZX0gDuWFuIjzdwButrIYPNmRJ1G8ybDIF7oDW2eEpm5sMbL9zs\n9ExXCdvqrn51qELbqj0XxtMTIpaCHFSI50PfPpTFV9Xt/hmyVwokoOXFlAEgCn+Q\nCgGs52bFoYMtyi+xEQIDAQAB\n-----END PUBLIC KEY-----'
    const nodeRSA = new NodeRSA(_pubKey)
    nodeRSA.setOptions({encryptionScheme: 'pkcs1'})
    return nodeRSA.encrypt(password, 'base64')
  }
}

export default CryptoUtil
