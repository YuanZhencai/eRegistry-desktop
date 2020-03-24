import Vue from 'vue'
import { formatDate } from '../utils/date'
import { SERVER_API_URL } from '../constants'

export function initFilters() {
  Vue.filter('formatDate', function(val, pattern) {
    return formatDate(val, pattern)
  })

  Vue.filter('uriEncode', function(url) {
    return encodeURIComponent(url)
  })

  Vue.filter('qrcode', function(url) {
    return `${SERVER_API_URL}/api/qrcode?uri=${encodeURIComponent(url)}`
  })
}
