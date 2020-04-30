import * as directives from '../../directives/directives'
import * as filters from '../../filters/filters'
import axios from 'axios'
import VueAxios from 'vue-axios'
import { hasAnyAuthority } from '../security/security'
import VueI18n from 'vue-i18n'
import CustomFormatter from './formatter'

export function initVueApp(vue) {
  vue.use(VueAxios, axios)
  vue.prototype.$axios = axios
  vue.prototype.$hasAnyAuthority = hasAnyAuthority
  directives.initDirectives()
  filters.initFilters()
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
    formatter: new CustomFormatter(),
    messages: {
      'zh-CN': require('./i18n/zh-cn.json')
    }
  })
}
