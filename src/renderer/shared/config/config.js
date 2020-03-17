import * as directives from '../../directives/directives'
import * as filters from '../../filters/filters'
import axios from 'axios'
import VueAxios from 'vue-axios'
import { hasAnyAuthority } from '../security/security'
import VueI18n from 'vue-i18n'
import JhiFormatter from './formatter'
import { setupAxiosInterceptors } from './axios-interceptor'

export function initVueApp(vue) {
  directives.initDirectives()
  filters.initFilters()
  vue.use(VueAxios, axios)
  vue.prototype.$axios = axios
  vue.prototype.$hasAnyAuthority = hasAnyAuthority
  setupAxiosInterceptors(vue, () => console.log('Unauthorized!'))
}

const dateTimeFormats = {
  en: {
    short: {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric'
    },
    medium: {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      weekday: 'short',
      hour: 'numeric',
      minute: 'numeric'
    },
    long: {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      weekday: 'long',
      hour: 'numeric',
      minute: 'numeric'
    }
  },
  fr: {
    short: {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric'
    },
    medium: {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      weekday: 'short',
      hour: 'numeric',
      minute: 'numeric'
    },
    long: {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      weekday: 'long',
      hour: 'numeric',
      minute: 'numeric'
    }
  }
}

export function initI18N(vue) {
  vue.use(VueI18n)
  return new VueI18n({
    locale: 'zh-CN',
    dateTimeFormats,
    silentTranslationWarn: true,
    formatter: new JhiFormatter(),
    messages: {
      'zh-CN': require('./i18n/zh-cn.json')
    }
  })
}
