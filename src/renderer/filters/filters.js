import Vue from 'vue'
import { formatDate } from '../utils/date'
import { SERVER_API_URL } from '../constants'
import { extension } from '../utils'

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

  Vue.filter('extension', function(path) {
    return extension(path)
  })

  Vue.filter('bytes', function(value, decimals) {
    decimals = (typeof decimals !== 'undefined') ? decimals : 2
    value = value === null || isNaN(value) ? 0 : value

    if (value >= Math.pow(1024, 4)) {
      // TB
      return `${(value / Math.pow(1024, 4)).toFixed(decimals)} TB`
    } else if (value >= Math.pow(1024, 3)) {
      // GB
      return `${(value / Math.pow(1024, 3)).toFixed(decimals)} GB`
    } else if (value >= Math.pow(1024, 2)) {
      // MB
      return `${(value / Math.pow(1024, 2)).toFixed(decimals)} MB`
    } else if (value >= 1024) {
      // kb
      return `${(value / 1024).toFixed(decimals)} KB`
    }
    // byte
    return `${value} B`
  })

  Vue.filter('ellipsis', function(value) {
    let a = value
    if (typeof value === 'object') {
      if (Array.isArray(value)) {
        a = value.toString()
      } else {
        a = JSON.stringify(value)
      }
    }
    if (!a) {
      return ''
    } else if (a.length > 32) {
      return a.slice(0, 32) + '...'
    }
    return a
  })
}
