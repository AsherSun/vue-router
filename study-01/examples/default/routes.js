/*global DEFAULTBASE */
import App from './components/App.vue'
import HelloWord from './components/HelloWord.vue'

export default {
  [DEFAULTBASE + '/']: App,
  [DEFAULTBASE + '/hello']: HelloWord
}

