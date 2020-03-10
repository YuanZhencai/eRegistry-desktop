import Vue from 'vue'
import axios from 'axios'
import VueAxios from 'vue-axios'
import 'normalize.css/normalize.css'// A modern alternative to CSS reset
import 'bootstrap/dist/css/bootstrap.css'

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import locale from 'element-ui/lib/locale/lang/en' // lang i18n

import App from './App'
import router from './router'
import store from './store'

import '@/icons' // icon
import '@/permission' // permission control
import '@/utils/filter'
import '@/assets/font-awesome-4.7.0/css/font-awesome.css'

if (!process.env.IS_WEB) Vue.use(require('vue-electron'))

Vue.use(VueAxios, axios)
Vue.use(ElementUI, { locale })

Vue.config.productionTip = false

new Vue({
  components: { App },
  router,
  store,
  template: '<App/>'
}).$mount('#app')
