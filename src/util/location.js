/* @flow */

import type VueRouter from '../index'
import { parsePath, resolvePath } from './path'
import { resolveQuery } from './query'
import { fillParams } from './params'
import { warn } from './warn'
import { extend } from './misc'

export function normalizeLocation (
  raw: RawLocation,
  current: ?Route,
  append: ?boolean,
  router: ?VueRouter
): Location {
  // raw 如果是字符串则描述是一个地址则包装成为一个对象，否则使用 raw
  let next: Location = typeof raw === 'string' ? { path: raw } : raw
  // named target
  if (next._normalized) { // 是否处理过？处理过，返回目标
    return next
  } else if (next.name) { // 是否存在 name ? 存在返回目标
    return extend({}, raw)
  }

  // relative params
  if (!next.path && next.params && current) {
    next = extend({}, next)
    next._normalized = true
    // 拿到当前路由参数和下一个路由参数
    const params: any = extend(extend({}, current.params), next.params)
    if (current.name) { // 如果存在名称
      next.name = current.name
      next.params = params
    } else if (current.matched.length) { // 如果存在匹配
      const rawPath = current.matched[current.matched.length - 1].path
      next.path = fillParams(rawPath, params, `path ${current.path}`)
    } else if (process.env.NODE_ENV !== 'production') { // 如果不是生产环境
      warn(false, `relative params navigation requires a current route.`)
    }
    return next
  }
  
  // 拿到解析出来的路径
  const parsedPath = parsePath(next.path || '')
  // 拿到基本路径
  const basePath = (current && current.path) || '/'
  // 根据条件拿到 path
  const path = parsedPath.path
    ? resolvePath(parsedPath.path, basePath, append || next.append)
    : basePath
  // 拿到query 参数
  const query = resolveQuery(
    parsedPath.query,
    next.query,
    router && router.options.parseQuery
  )
  
  let hash = next.hash || parsedPath.hash
  if (hash && hash.charAt(0) !== '#') {
    hash = `#${hash}`
  }

  return {
    _normalized: true,
    path,
    query,
    hash
  }
}
