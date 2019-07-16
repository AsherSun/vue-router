// 数据拷贝方法 
// ⚠️注意：extend 并不是数据深拷贝
export function extend (a, b) {
  for (const key in b) {
    a[key] = b[key]
  }
  return a
}
