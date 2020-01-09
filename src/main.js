import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import './utils/register-vant'
import './styles/index.less'
import './utils/validation.js'
// import './styles/base.less'
import 'normalize.css'
import 'amfe-flexible'
import { NavBar, Field, Button, Toast, CountDown } from 'vant'
Vue.config.productionTip = false
Vue.use(NavBar)
Vue.use(Field)
Vue.use(Button)
Vue.use(Toast)
Vue.use(CountDown)

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
