import Vue from 'vue'

import 'normalize.css/normalize.css' // A modern alternative to CSS reset
import 'bootstrap/dist/css/bootstrap.css'

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import locale from 'element-ui/lib/locale/lang/zh-CN' // lang i18n
import App from './App'
import router from './router'
import store from './store'

import '@/icons' // icon
import '@/permission' // permission control
import * as config from './shared/config/config'
import '@/assets/font-awesome-4.7.0/css/font-awesome.css'
import { setupAxiosInterceptors } from './shared/config/axios-interceptor'

if (!process.env.IS_WEB) Vue.use(require('vue-electron'))

Vue.use(ElementUI, { locale })

Vue.config.productionTip = false

config.initVueApp(Vue)

const i18n = config.initI18N(Vue)

setupAxiosInterceptors(i18n, () => console.log('Unauthorized!'))

new Vue({
  components: { App },
  router,
  store,
  i18n,
  template: '<App/>'
}).$mount('#app')

