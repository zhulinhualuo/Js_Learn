import { trim } from 'lodash'
/**
 * 正则：手机号（精确）
 * 移动：134(0-8)、135、136、137、138、139、147、150、151、152、157、158、159、178、182、183、184、187、188、198
 * 联通：130、131、132、145、155、156、175、176、185、186、166
 * 电信：133、153、173、177、180、181、189、199
 * 全球星：1349
 * 虚拟运营商：170
 */
export const regex = {
  // 手机
  mobile: /^((13[0-9])|(14[5,7])|(15[0-3,5-9])|(17[0,3,5-8])|(18[0-9])|166|198|199|(147))[0-9]{8}$/,
  // 身份证号
  idCard: /^\d{6}(18|19|20)\d{2}(0[1-9]|1[012])(0[1-9]|[12]\d|3[01])\d{3}(\d|X|x)$|^\d{6}\d{2}(0[1-9]|1[012])(0[1-9]|[12]\d|3[01])\d{3}$/,
  cityCode: {
    11: '北京',
    12: '天津',
    13: '河北',
    14: '山西',
    15: '内蒙古',
    21: '辽宁',
    22: '吉林',
    23: '黑龙江 ',
    31: '上海',
    32: '江苏',
    33: '浙江',
    34: '安徽',
    35: '福建',
    36: '江西',
    37: '山东',
    41: '河南',
    42: '湖北 ',
    43: '湖南',
    44: '广东',
    45: '广西',
    46: '海南',
    50: '重庆',
    51: '四川',
    52: '贵州',
    53: '云南',
    54: '西藏 ',
    61: '陕西',
    62: '甘肃',
    63: '青海',
    64: '宁夏',
    65: '新疆',
    71: '台湾',
    81: '香港',
    82: '澳门',
    91: '国外 '
  }
}

export function strlen(str) {
  let i
  let len = 0
  for (i = 0; i < str.length; i++) {
    if (str.charCodeAt(i) > 255) {
      len += 2
    } else {
      len++
    }
  }
  return len
}
/** 手机号码是否有效 */
export function isMobile(num) {
  return regex.mobile.test(num)
}
/** 姓名是否有效 */
export function isName(data) {
  const reg1 = /^[a-zA-Z]{1}([a-zA-Z][ ]{0,}){0,1000}[a-zA-Z]{1}$/
  const reg2 = /^[\u4e00-\u9fa5]{1}([\u4e00-\u9fa5][·]{0,1}){0,1000}[\u4e00-\u9fa5]{1}$/
  const name = trim(data)
  if (reg1.test(name) || reg2.test(name)) {
    const len = strlen(name)
    if (len > 50 || len < 4) {
      return false
    }
    return true
  }
  return false
}

/** 身份证是否有效 */
export function isIdCard(data) {
  let result = true
  const cityCode = regex.cityCode
  const value = '' + arguments[0]
  /* 15位校验规则： (dddddd yymmdd xx g)    g奇数为男，偶数为女
    * 18位校验规则： (dddddd yyyymmdd xxx p) xxx奇数为男，偶数为女，p校验位

    校验位公式：C17 = C[ MOD( ∑(Ci*Wi), 11) ]
    i----表示号码字符从由至左包括校验码在内的位置序号
    Wi 7 9 10 5 8 4 2 1 6 3 7 9 10 5 8 4 2 1
    Ci 1 0 X 9 8 7 6 5 4 3 2
    */
  const rFormat = regex.idCard // 格式验证
  if (!rFormat.test(value) || !cityCode[value.substr(0, 2)]) {
    result = false
  } else if (value.length === 18) {
    // 18位身份证需要验证最后一位校验位
    const Wi = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2, 1] // 加权因子
    const Ci = '10X98765432' // 校验字符
    // 加权求和
    let sum = 0
    for (let i = 0; i < 17; i++) {
      sum += value.charAt(i) * Wi[i]
    }
    // 计算校验值
    const C17 = Ci.charAt(sum % 11)
    // 与校验位比对
    if (C17 !== value.charAt(17)) {
      result = false
    }
  }
  return result
}
