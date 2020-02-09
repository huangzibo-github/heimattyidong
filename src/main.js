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
import './utils/datetime'
Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
