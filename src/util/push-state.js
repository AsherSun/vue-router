/* @flow */

import { inBrowser } from './dom'
import { saveScrollPosition } from './scroll'

// 判断h5的history是否可用
export const supportsPushState = inBrowser && (function () {
  const ua = window.navigator.userAgent
  // 拿到userAgent 对安卓2.0、4.0进行判断
  if (
    (ua.indexOf('Android 2.') !== -1 || ua.indexOf('Android 4.0') !== -1) &&
    ua.indexOf('Mobile Safari') !== -1 &&
    ua.indexOf('Chrome') === -1 &&
    ua.indexOf('Windows Phone') === -1
  ) {
    return false
  }
  // 对浏览器是否支持 history API 进行判断
  return window.history && 'pushState' in window.history
})()

// use User Timing api (if present) for more accurate key precision
//  window.performance 是用来干什么的？请看：http://www.alloyteam.com/2015/09/explore-performance/#prettyPhoto
const Time = inBrowser && window.performance && window.performance.now
  ? window.performance
  : Date

// 拿到一个时间标记的 key
let _key: string = genKey()

function genKey (): string {
  return Time.now().toFixed(3)
}

// 获取key
export function getStateKey () {
  return _key
}

// 设置key
export function setStateKey (key: string) {
  _key = key
}


export function pushState (url?: string, replace?: boolean) {
  saveScrollPosition() // 保存当前页面的滚动条位置
  // try...catch the pushState call to get around Safari
  // DOM Exception 18 where it limits to 100 pushState calls
  const history = window.history
  try { // 兼容写法，为了处理某些浏览器下 history API .方法不一致
    if (replace) { // 如果是 replace 
      history.replaceState({ key: _key }, '', url) // 调用history的replaceState方法
    } else { // 否则 push
      _key = genKey()
      history.pushState({ key: _key }, '', url)
    }
  } catch (e) {//  捕捉错误, 调用另一种浏览器实现的 history的方法
    window.location[replace ? 'replace' : 'assign'](url)
  }
}

export function replaceState (url?: string) { // replace 方法定义
  pushState(url, true)
}
