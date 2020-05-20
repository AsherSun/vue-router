/*global HASHBASE */
import App from './components/App.vue'
import HelloWord from './components/HelloWord.vue'

export default {
  [HASHBASE + '/']: App,
  [HASHBASE + '/#']: App,
  [HASHBASE + '#']: App,
  [HASHBASE + '#hello']: HelloWord
}

