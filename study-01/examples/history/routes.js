/*global HISTORYBASE */
import App from './components/App.vue'
import HelloWord from './components/HelloWord.vue'

export default {
  [HISTORYBASE + '/']: App,
  [HISTORYBASE + '/hello']: HelloWord
}

