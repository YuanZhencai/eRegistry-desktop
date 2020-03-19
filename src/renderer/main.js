import Vue from 'vue'
import { Calendar, Badge } from 'ant-design-vue'
import 'ant-design-vue/dist/antd.css'
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

import 'moment/locale/zh-cn'
import moment from 'moment'
moment.locale('zh-cn')

if (!process.env.IS_WEB) Vue.use(require('vue-electron'))

Vue.use(ElementUI, { locale: locale, size: 'mini' })
Vue.use(Calendar)
Vue.use(Badge)
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
