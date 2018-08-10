

/**
 * 判定A字符串是否在B字符串中
 * @param { String } to
 * @param { String } form
 */
export function includeStr(to, form) {
  to = `${to ? to.trim() : ''}`
  form = `${form ? form.trim() : ''}`
  // 有@分隔时
  if (to.indexOf('@') !== -1) {
    to = to.split('@').filter(v => v)
    return to.includes(form)
  }
  return to === form
}

/**
 * 是否包含在数组
 * @param { Array } a
 * @param { Array } b
 */
export function isContained(a, b) {
  if (!(a instanceof Array) || !(b instanceof Array)) return false
  if (a.length < b.length) return false
  var aStr = a.toString()
  for (var i = 0, len = b.length; i < len; i++) {
    if (aStr.indexOf(b[i]) === -1) return false
  }
  return true
}

/**
 * 四舍五入小数位
 * @param { Number } x 数据
 * @param { Number } n 保留小数
 */
export function toFixed(x, n) {
  var f = parseFloat(x)
  if (isNaN(f)) {
    return 0
  }
  var t = n ? Math.pow(10, n) : 1
  f = Math.round(x * t) / t
  return f
}

function decode(input) {
  return decodeURIComponent(input.replace(/\+/g, ' '))
}

/**
 * 格式化URL参数
 * @param { Sring } query 链接后的queryString字符串
 */
export function q(query) {
  const parser = /([^=?&]+)=?([^&]*)/g
  const result = {}
  let part
  while ((part = parser.exec(query))) {
    const key = decode(part[1])
    const value = decode(part[2])
    if (key in result) continue
    result[key] = value
  }
  return result
}

/**
 * 将location.search格式化为对象
 */
export function parseQueryString() {
  return q(location.search)
}

/**
 * 获取cookie
 * @param { String } name 需要获取的cookie名
 */
export function getCookie(name) {
  const arr = document.cookie.match(new RegExp('(^| )' + name + '=([^;]*)(;|$)'))
  if (arr != null) return unescape(arr[2])
  return null
}

/**
 * 检测是否是原型属性
 * @param { Object } obj
 * @param { String } key
 */
const own = {}.hasOwnProperty
function hasOwn(obj, key) {
  return own.call(obj, key)
}

/**
 * 添加参数到URL后面
 * @param { String } url 链接
 * @param { Object } params 参数对象
 */
export function addParamsToUrl(url, params) {
  const a = document.createElement('a')
  url = url.replace('?&', '?') // 有时后管链接人手配错就有这种情况
  a.href = url
  const oldSearch = a.search
  const baseUrl = a.origin + a.pathname
  const oldSearchParams = q(oldSearch)
  const newSearchParams = { ...oldSearchParams }
  if (typeof params === 'string') params = q(params)
  for (const key in params) {
    if (hasOwn(params, key)) {
      const newVal = params[key]
      // 如果 newVal 是 null|undefined 则忽略
      if (newVal != null && (!hasOwn(oldSearchParams, key))) {
        newSearchParams[key] = newVal
      }
    }
  }
  const finalSearchParamsArr = []
  for (const key in newSearchParams) {
    if (hasOwn(newSearchParams, key)) {
      const val = newSearchParams[key]
      if (val != null) { // 防止新参数有 null|undefined
        const valStr = val + '' // toString
        if (valStr) {
          finalSearchParamsArr.push(`${key}=${valStr}`)
        }
      }
    }
  }
  const finalSearchParamsStr = finalSearchParamsArr.join('&')
  const finalSearch = finalSearchParamsStr ? ('?' + finalSearchParamsStr) : ''
  const finalHash = a.hash
  return baseUrl + finalSearch + finalHash
}

/**
 * 检测是否支持webp
 */
export function hasWebp() {
  return new Promise((resolve) => {
    let img = new Image()
    function getResult(e) {
      const result = !!(e && e.type === 'load' && img.width === 1)
      // 如果进入加载且图片宽度为1(通过图片宽度值判断图片是否可以显示)
      img.onload = img.onerror = null
      img = null // 利于 GC
      resolve(result)
    }
    img.onload = img.onerror = getResult
    img.src = 'data:image/webp;base64,UklGRiQAAABXRUJQVlA4IBgAAAAwAQCdASoBAAEAAwA0JaQAA3AA/vuUAAA=' // 一像素图片
  })
}

/**
 * 格式化金额
 * @param { Number } moneyNum 金额
 */
export function formatMoneyNumber(moneyNum) {
  if (typeof (moneyNum === 'number')) {
    moneyNum = moneyNum + ''
  }
  moneyNum = moneyNum.replace(/,/g, '')
  var result = isNaN((1 * moneyNum).toFixed(2)) ? '0.00' : (1 * moneyNum).toFixed(2)
  return (/\./.test(result) ? result.replace(/(\d{1,3})(?=(\d{3})+\.)/g, '$1,') : result.replace(/(\d{1,3})(?=(\d{3})+\b)/g, '$1,'))
}

/**
 * 格式化日期
 * @param { Date } date 日期
 * @param { String } format 格式化字符串：yyyy-MM-dd
 */
export function formatDate(date, format) {
  if (!date || date === '0') {
    return ''
  }
  if (!format) {
    format = 'yyyy-MM-dd hh:mm:ss'
  }
  if (typeof date === 'string') {
    let arr = []
    if (date.length === 6) {
      arr = [date.substr(0, 4), date.substr(4, 2)]
    } else if (date.length === 8) {
      arr = [date.substr(0, 4), date.substr(4, 2), date.substr(6, 2)]
    } else if (date.length === 14) {
      arr = [
        date.substr(0, 4),
        date.substr(4, 2),
        date.substr(6, 2),
        date.substr(8, 2),
        date.substr(10, 2),
        date.substr(12, 2)
      ]
    } else {
      arr = date.split(/[^0-9]+/)
    }

    format = format.replace(/([a-z])\1+/gi, function (all, $1) {
      let result = {
        y: ~~arr[0],
        M: ~~arr[1],
        d: ~~arr[2],
        h: ~~arr[3],
        m: ~~arr[4],
        s: ~~arr[5]
      }[$1]
      if (result !== undefined && result < 10) {
        result = '0' + result
      }
      return result || ''
    })
    return format
  }
  format = format.replace(/([a-z])\1+/gi, function (all) {
    const first = all.charAt(0)
    if ('y M d h m s'.indexOf(first) >= 0) {
      if (first === 'y') {
        return all.length > 2 ? date.getFullYear() : (date.getFullYear() + '').substr(2)
      }
      let result = {
        M: date.getMonth() + 1,
        d: date.getDate(),
        h: date.getHours(),
        m: date.getMinutes(),
        s: date.getSeconds()
      }[first]
      result !== undefined && result < 10 && (result = '0' + result)
      return result
    } else {
      return all
    }
  })
  return format
}

/**
 * 银行卡号掩码
 * @param { String } cardNO 需要掩码的卡号
 */
export function cardNOMask(cardNO) {
  if (!cardNO) {
    return ''
  } else {
    if (cardNO.length > 8) {
      const start = cardNO.substring(0, 4)
      const end = cardNO.substring(cardNO.length - 4)
      return start + ' ***** ' + end
    } else {
      return cardNO
    }
  }
}
