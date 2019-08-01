/* @flow */

// 返回路径
export function resolvePath (
  relative: string,
  base: string,
  append?: boolean
): string {
  // 拿到第一个字符串
  const firstChar = relative.charAt(0)
  if (firstChar === '/') { // 判断是否存在“根路径”, 存在则返回
    return relative
  }

  if (firstChar === '?' || firstChar === '#') { // hash 模式的路径拼接
    return base + relative
  }

  // 获取路径上的所有路由 path 可以理解为堆栈数据结构
  const stack = base.split('/')

  // remove trailing segment if:
  // - not appending
  // - appending to trailing slash (last segment is empty)
  if (!append || !stack[stack.length - 1]) { // 如果不是前进，并且栈内还有数据
    stack.pop() // 出栈，栈尾删除
  }

  // resolve relative path
  const segments = relative.replace(/^\//, '').split('/')
  for (let i = 0; i < segments.length; i++) {
    const segment = segments[i]
    if (segment === '..') {
      stack.pop() // 出栈，栈尾删除
    } else if (segment !== '.') {
      stack.push(segment) // 进栈，栈尾添加
    }
  }

  // ensure leading slash
  // 确保后面的 stack.join('/') 第一个字符为 '/'
  if (stack[0] !== '') { // 如果不是空字符串
    stack.unshift('') // 进栈，栈顶添加
  }

  return stack.join('/') // 将数组解析为一个字符串并且返回
}

// 路径解析
export function parsePath (path: string): {
  path: string;
  query: string;
  hash: string;
} {
  let hash = ''
  let query = ''

  const hashIndex = path.indexOf('#')
  if (hashIndex >= 0) {
    hash = path.slice(hashIndex)
    path = path.slice(0, hashIndex)
  }

  const queryIndex = path.indexOf('?')
  if (queryIndex >= 0) {
    query = path.slice(queryIndex + 1)
    path = path.slice(0, queryIndex)
  }

  return {
    path,
    query,
    hash
  }
}

// 清除路径
export function cleanPath (path: string): string {
  return path.replace(/\/\//g, '/')
}
