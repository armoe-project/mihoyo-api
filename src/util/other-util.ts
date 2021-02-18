class OtherUtil {
  static getTimeStamp(sec: boolean) {
    if (sec) {
      return Math.floor(Date.now() / 1000)
    } else {
      return Math.floor(Date.now())
    }
  }

  static cookieToJSON(cookies?: string) {
    if (!cookies) {
      return {}
    }
    const result: any = {}
    const c = cookies.split('; ')
    for (const s of c) {
      const data = s.split('=')
      result[data[0]] = data[1]
    }
    return result

  }

  static jsonToCookie(cookies?: any) {
    if (!cookies) {
      return ''
    }
    let result = ''
    for (const key in cookies) {
      result = result + `${key}=${cookies[key]}; `
    }
    result = result.trim()
    return result
  }
}

export default OtherUtil
