/*global HISTORYBASE */
/*eslint no-undef: "error"*/
import Vue from 'vue'
// import routes from 'routes'
import routes from './routes'
import NotFound from './components/404.vue'

const app = new Vue({
  data: () => ({
    currentRoute: window.location.pathname,
    n: 0,
    history: window.history
  }),
  render: function (h) {
    return h('div', {
      attrs: {
        id: 'app'
      }
    }, [
      h('h1', {}, 'History'),
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
                href: `${HISTORYBASE}/`
              },
              on: {
                click: (e) => this.clickToJump(e, `/`)
              }
            }, 'Home')
          ]),
          h('li', {}, [
            h('a', {
              attrs: {
                href: `${HISTORYBASE}/hello`
              },
              on: {
                click: (e) => this.clickToJump(e, `/hello`)
              }
            }, 'HelloWord')
          ]),
          h('li', {}, [
            h('a', {
              attrs: {
                href: `${HISTORYBASE}/xxx`
              },
              on: {
                click: (e) => this.clickToJump(e, '/xxx')
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
      app.currentRoute = window.location.pathname
      console.log('app.currentRoute', app.currentRoute, window.location.pathname)
    })
  },
  computed: {
    getCurrentView () {
      return routes[this.currentRoute] || NotFound
    }
  },
  methods: {
    clickToJump (e, href) {
      e.preventDefault()
      this.history.pushState({ test: '我是test内容', key: Date.now().toFixed(3) }, '', HISTORYBASE + href)
      // 这是处理pushState 与 replaceState 不会触发 popstate 事件的一种方式
      this.currentRoute = HISTORYBASE + href
    }
  }
}).$mount('#app')

window.addEventListener('popstate', () => {
  app.currentRoute = window.location.pathname
  console.log('app.currentRoute', app.currentRoute, window.location.pathname)
})
