/* @flow */

import Regexp from 'path-to-regexp'
import { cleanPath } from './util/path'
import { assert, warn } from './util/warn'

export function createRouteMap (
  routes: Array<RouteConfig>,
  oldPathList?: Array<string>,
  oldPathMap?: Dictionary<RouteRecord>,
  oldNameMap?: Dictionary<RouteRecord>
): {
  pathList: Array<string>,
  pathMap: Dictionary<RouteRecord>,
  nameMap: Dictionary<RouteRecord>
} {
  // the path list is used to control path matching priority
  // 路径列表用于控制路径匹配优先级
  const pathList: Array<string> = oldPathList || []
  // $flow-disable-line
  // 路径映射
  const pathMap: Dictionary<RouteRecord> = oldPathMap || Object.create(null)
  // $flow-disable-line
  // 名称映射
  const nameMap: Dictionary<RouteRecord> = oldNameMap || Object.create(null)

  routes.forEach(route => {
    // 添加路由记录
    addRouteRecord(pathList, pathMap, nameMap, route)
  })

  // ensure wildcard routes are always at the end
  // 确保通配符始终位于末尾
  // ？？？
  for (let i = 0, l = pathList.length; i < l; i++) {
    if (pathList[i] === '*') {
      pathList.push(pathList.splice(i, 1)[0])
      l--
      i--
    }
  }

  return {
    pathList,
    pathMap,
    nameMap
  }
}

function addRouteRecord (
  pathList: Array<string>, // []
  pathMap: Dictionary<RouteRecord>, // {}
  nameMap: Dictionary<RouteRecord>, // {}
  route: RouteConfig,
  parent?: RouteRecord,
  matchAs?: string
) {
  const { path, name } = route
  if (process.env.NODE_ENV !== 'production') {
    // undefined != null 语句输出 false;
    // 当path 为 null 或者 undefined 时，抛错
    assert(path != null, `"path" is required in a route configuration.`)
    // 当route.component 为 字符串时, 抛错
    assert(
      typeof route.component !== 'string',
      `route config "component" for path: ${String(
        path || name
      )} cannot be a ` + `string id. Use an actual component instead.`
    )
  }

  // 获取路径验证配置
  // pathToRegexpOptions.strict 为路由严格验证
  const pathToRegexpOptions: PathToRegexpOptions =
    route.pathToRegexpOptions || {}
  // 拿到清洗后的路径
  const normalizedPath = normalizePath(path, parent, pathToRegexpOptions.strict)

  // 路由验证配置下的 sensitive 字段处理
  if (typeof route.caseSensitive === 'boolean') {
    pathToRegexpOptions.sensitive = route.caseSensitive
  }

  const record: RouteRecord = {
    path: normalizedPath,
    // 该路径的正则编译
    regex: compileRouteRegex(normalizedPath, pathToRegexpOptions),
    // 如果开发者在该路由下有配置多个组件，那么直接赋值。否则使用路由下的 component 组件
    components: route.components || { default: route.component },
    instances: {},
    name,
    parent,
    matchAs,
    // 重定向相关信息
    redirect: route.redirect,
    // 路由守卫
    beforeEnter: route.beforeEnter,
    meta: route.meta || {},
    // == 操作符，js中非严格模式判断
    // undefined == null 的运算结果为 true
    // 下面 props赋值变为 if 操作
    /**
     * if (route.props == null) {
     *  return {}
     * } else if (route.components) {
     *  return route.props
     * } else {
     *  return { default: route.props }
     * }
    */
    props:
      route.props == null
        ? {}
        : route.components
          ? route.props
          : { default: route.props }
  }

  if (route.children) {
    // Warn if route is named, does not redirect and has a default child route.
    // 如果路由已命名、未重定向且具有默认子路由，则发出警告
    // If users navigate to this route by name, the default child will
    // not be rendered (GH Issue #629)
    // fix GH Issue #629: 如果用户按名称导航到此路由，则不会呈现默认子路由
    if (process.env.NODE_ENV !== 'production') {
      if (
        route.name &&
        !route.redirect &&
        route.children.some(child => /^\/?$/.test(child.path))
      ) {
        warn(
          false,
          `Named Route '${route.name}' has a default child route. ` +
            `When navigating to this named route (:to="{name: '${
              route.name
            }'"), ` +
            `the default child route will not be rendered. Remove the name from ` +
            `this route and use the name of the default child route for named ` +
            `links instead.`
        )
      }
    }
    route.children.forEach(child => {
      const childMatchAs = matchAs
        ? cleanPath(`${matchAs}/${child.path}`) // 路径多余 "/" 字符清除
        : undefined
      addRouteRecord(pathList, pathMap, nameMap, child, record, childMatchAs)
    })
  }
  // 如果路径存在
  if (!pathMap[record.path]) {
    // 路径列表存入
    pathList.push(record.path)
    // 路径字典
    pathMap[record.path] = record
  }

  // 如果路由具有别名
  if (route.alias !== undefined) {
    // 拿到别名数组
    const aliases = Array.isArray(route.alias) ? route.alias : [route.alias]
    // 第一次循环, i = 1 ?
    for (let i = 0; i < aliases.length; ++i) {
      const alias = aliases[i]
      // 如果别名与路径相等，抛错并跳过此次循环
      if (process.env.NODE_ENV !== 'production' && alias === path) {
        warn(
          false,
          `Found an alias with the same value as the path: "${path}". You have to remove that alias. It will be ignored in development.`
        )
        // skip in dev to make it work
        continue
      }

      // 别名路由信息
      const aliasRoute = {
        path: alias,
        children: route.children
      }
      addRouteRecord(
        pathList,
        pathMap,
        nameMap,
        aliasRoute,
        parent,
        record.path || '/' // matchAs
      )
    }
  }

  if (name) {
    if (!nameMap[name]) {
      nameMap[name] = record
    } else if (process.env.NODE_ENV !== 'production' && !matchAs) {
      warn(
        false,
        `Duplicate named routes definition: ` +
          `{ name: "${name}", path: "${record.path}" }`
      )
    }
  }
}

function compileRouteRegex (
  path: string,
  pathToRegexpOptions: PathToRegexpOptions
): RouteRegExp {
  const regex = Regexp(path, [], pathToRegexpOptions)
  if (process.env.NODE_ENV !== 'production') {
    // 重复路径参数判断？
    const keys: any = Object.create(null)
    regex.keys.forEach(key => {
      warn(
        !keys[key.name],
        `Duplicate param keys in route with path: "${path}"`
      )
      keys[key.name] = true
    })
  }
  // 返回编译过的路径
  return regex
}

function normalizePath (
  path: string,
  parent?: RouteRecord,
  strict?: boolean
): string {
  // 默认使用严格验证 - 因为开发者在使用的时候很少会配置这个选项
  if (!strict) path = path.replace(/\/$/, '')
  // 如果有 “/” 字符，返回路径
  if (path[0] === '/') return path
  // 如果没有父组件, 返回路径
  if (parent == null) return path
  // 最后返回清洗过路径
  return cleanPath(`${parent.path}/${path}`)
}
