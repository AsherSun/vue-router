// 导入组件
import View from './components/view'
import Link from './components/link'

export let _Vue

// 注册vue 插件
export function install (Vue) {
  // 注册过阻止后续执行
  if (install.installed && _Vue === Vue) return
  install.installed = true

  _Vue = Vue
  
  // 对变量是否为undefined的判断方法
  const isDef = v => v !== undefined
  
  // 注册实例
  // vm 为 vue实例
  const registerInstance = (vm, callVal) => {
    // 拿到 parentNode 
    let i = vm.$options._parentVnode
    // isDef(i = i.data) 语句其实可以看作 isDef(i.data), i = i.data;
    // isDef(i = i.registerRouteInstance) 同理
    // 那么这个 i 最后到底是什么呢？
    // i 变量最后还是 registerInstance 方法
    if (isDef(i) && isDef(i = i.data) && isDef(i = i.registerRouteInstance)) {
      // 方法调用，传参
      i(vm, callVal)
    }
  }
  
  // vue 对象混入功能
  Vue.mixin({
    // vue 钩子函数
    beforeCreate () {
      // 这里的 this 指向？
      // 用过vue mixin 功能的同学应该都清楚是指向vue实例
      if (isDef(this.$options.router)) { // 判断是否有 vue-router
        this._routerRoot = this
        this._router = this.$options.router
        this._router.init(this)
        // 调用 Vue的util.defineReactive 方法。
        // 该方法主要输出为：
        // 新建一个 dep 对象，与当前数据对应
        // 通过 Object.defineProperty() 重新定义对象属性，配置属性的 set、get，从而数据被获取、设置时可以执行 Vue 的代码
        Vue.util.defineReactive(this, '_route', this._router.history.current)
      } else { // 没有 vue-router 的处理
        // && 、 || 运算符的特性不理解请自行MDN文档或谷歌控制台测试
        this._routerRoot = (this.$parent && this.$parent._routerRoot) || this
      }
      // 调用实例注册方法
      registerInstance(this, this)
    },
    
    // 当前 vue 实例销毁钩子
    destroyed () {
      registerInstance(this)
    }
  })
  
  
  // 在当前的vue实例的 prototype 挂载 $router、$route 属性
  Object.defineProperty(Vue.prototype, '$router', {
    get () { return this._routerRoot._router }
  })

  Object.defineProperty(Vue.prototype, '$route', {
    get () { return this._routerRoot._route }
  })
  
  // 组件注册
  Vue.component('RouterView', View)
  Vue.component('RouterLink', Link)
  
  // 拿到 vue 的合并策略, 通过合并策略可以决定钩子的执行先后 
  const strats = Vue.config.optionMergeStrategies
  // use the same hook merging strategy for route hooks
  // 对路由的钩子函数使用与vue相同的合并策略
  strats.beforeRouteEnter = strats.beforeRouteLeave = strats.beforeRouteUpdate = strats.created
}
