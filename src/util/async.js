/* @flow */

/*
* @params: queue 为导航守卫队列
**/
export function runQueue (queue: Array<?NavigationGuard>, fn: Function, cb: Function) {
  // step 方法为一个递归循环方法。
  // 递归结束条件：index >= queue.length
  const step = index => {
    if (index >= queue.length) {
      cb()
    } else {
      if (queue[index]) {
        fn(queue[index], () => {
          step(index + 1)
        })
      } else {
        step(index + 1)
      }
    }
  }
  step(0)
}
