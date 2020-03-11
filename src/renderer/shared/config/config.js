import * as directives from '../../directives/directives'
import * as filters from '../../filters/filters'
import axios from 'axios'
import VueAxios from 'vue-axios'
import { hasAnyAuthority } from '../security/security'

export function initVueApp(vue) {
  directives.initDirectives()
  filters.initFilters()
  vue.use(VueAxios, axios)
  vue.prototype.$axios = axios
  vue.prototype.$hasAnyAuthority = hasAnyAuthority
}
