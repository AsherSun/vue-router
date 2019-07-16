// 数据深拷贝方法 --- 断开引用
export function extend (a, b) {
  for (const key in b) {
    a[key] = b[key]
  }
  return a
}
