import axios from 'axios'
import FormData from 'form-data'

/**
 * @author 真心
 * @date 2021/2/2 21:03
 * @email qgzhenxin@qq.com
 * @description Axios 封装
 */

class Http {
  /**
   * 发送Get请求
   * @param url 链接
   * @param params 参数
   * @param headers 请求头
   * @return 数据
   */
  static async get(url: string, params: any = {}, headers?: any) {
    try {
      const data: any = await axios.get(url, {
        params: params,
        headers: headers
      })
      return data.data
    } catch (e) {
      return e.response.data
    }
  }

  /**
   * 发送POST请求
   * @param url 链接
   * @param body 参数
   * @param headers 请求头
   * @param type POST类型 0: Json 1: Form 默认: 0
   * @return 数据
   */
  static async post(
    url: string,
    body: any = {},
    headers?: any,
    type: number = 0
  ) {
    let config
    let form
    if (type === 0) {
      form = body
      config = {
        headers: headers
      }
    } else {
      form = this.jsonToFrom(body)
      config = {
        headers: form.getHeaders(headers)
      }
    }

    try {
      const data: any = await axios.post(url, form, config)
      return data.data
    } catch (e) {
      return e.response.data
    }
  }

  /**
   * Json转From
   * @param json JSON对象
   * @return FormData
   */
  private static jsonToFrom(json: any): FormData {
    const formData: FormData = new FormData()
    Object.keys(json).forEach((key) => {
      formData.append(key, `${json[key]}`)
    })
    return formData
  }
}

export default Http
