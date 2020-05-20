/*global HASHBASE */
/*eslint no-undef: "error"*/
import Vue from 'vue'
import routes from './routes'
import NotFound from './components/404.vue'

new Vue({
  data: () => ({
    currentRoute: window.location.pathname + window.location.hash,
    n: 0,
    history: window.history
  }),
  render: function (h) {
    return h('div', {
      attrs: {
        id: 'app'
      }
    }, [
      h('h1', {}, 'Hash'),
      h('pre', {
        attrs: {
          id: 'counter'
        }
      }, this.n),
      h('pre', {
        attrs: {
          id: 'hisotry'
        }
      }, this.currentRoute),
      h('section', {
        attrs: {
          id: 'layout'
        }
      }, [
        h('ul', {}, [
          h('li', {}, [
            h('a', {
              attrs: {
                href: `${HASHBASE}`
              },
              on: {
                click: (e) => this.clickToJump(e, ``)
              }
            }, 'Home')
          ]),
          h('li', {}, [
            h('a', {
              attrs: {
                href: `${HASHBASE}#hello`
              },
              on: {
                click: (e) => this.clickToJump(e, `#hello`)
              }
            }, 'HelloWord')
          ]),
          h('li', {}, [
            h('a', {
              attrs: {
                href: `${HASHBASE}#xxx`
              },
              on: {
                click: (e) => this.clickToJump(e, '#xxx')
              }
            }, 'not route info')
          ])
        ]),
        h(this.getCurrentView)
      ])
    ])
  },
  beforeCreate () {
    window.addEventListener('popstate', () => {
      // history.pushState 与 history.replaceState 不会触发 popstate事件
      // 所以vue-router中是怎么处理的？
      console.log('popstate', window.location)
    })
    // window.addEventListener('hashchange', () => {
    //   // console.log(e)
    //   console.log('window.location.hash', window.location.hash)
    // })
  },
  computed: {
    getCurrentView () {
      return routes[this.currentRoute] || NotFound
    }
  },
  methods: {
    clickToJump (e, href) {
      e.preventDefault()
      // this.history.pushState({ test: '我是test内容', key: Date.now().toFixed(3) }, '', HASHBASE + href)
      window.location.hash = href
      this.currentRoute = HASHBASE + href
    }
  }
}).$mount('#app')

