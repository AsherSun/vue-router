/* @flow */

import { warn } from './warn'
import Regexp from 'path-to-regexp'

// $flow-disable-line
// 创建一个regexpCompileCache对象，其对象下面的key都为function
const regexpCompileCache: {
  [key: string]: Function
} = Object.create(null)

// 参数处理
export function fillParams (
  path: string, // 路径
  params: ?Object, // 可选参数
  routeMsg: string
): string {
  // 因为 params 是可选参数，所以需要坐下兼容处理
  params = params || {}
  try {
    // 该语句可以解构为这样：
    // const filler =  regexpCompileCache[path] ?  regexpCompileCache[path] : (regexpCompileCache[path] = Regexp.compile(path))
    // 存在则使用，不存在则创建
    const filler =
      regexpCompileCache[path] ||
      (regexpCompileCache[path] = Regexp.compile(path))

    // Fix #2505 resolving asterisk routes { name: 'not-found', params: { pathMatch: '/not-found' }}
    if (params.pathMatch) params[0] = params.pathMatch

    return filler(params, { pretty: true })
  } catch (e) {
    if (process.env.NODE_ENV !== 'production') {
      warn(false, `missing param for ${routeMsg}: ${e.message}`)
    }
    return ''
  } finally {
    // delete the 0 if it was added
    delete params[0]
  }
}
