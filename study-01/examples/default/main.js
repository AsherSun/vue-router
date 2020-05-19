/*global DEFAULTBASE */
import Vue from 'vue'
import routes from './routes'
import NotFound from './components/404.vue'

new Vue({
  data: () => ({
    currentRoute: window.location.pathname,
    n: window.history.length
  }),
  render: function (h) {
    return h('div', {
      attrs: {
        id: 'app'
      }
    }, [
      h('h1', {}, 'A 链接跳转行为'),
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
                href: `${DEFAULTBASE}/`
              }
            }, 'Home')
          ]),
          h('li', {}, [
            h('a', {
              attrs: {
                href: `${DEFAULTBASE}/hello`
              }
            }, 'HelloWord')
          ]),
          h('li', {}, [
            h('a', {
              attrs: {
                href: `${DEFAULTBASE}/xxx`
              }
            }, 'not route info')
          ])
        ]),
        h(this.getCurrentView)
      ])
    ])
  },
  computed: {
    getCurrentView () {
      return routes[this.currentRoute] || NotFound
    }
  }
}).$mount('#app')
