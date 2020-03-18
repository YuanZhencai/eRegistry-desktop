import Vue from 'vue'
import { formatDate } from '../utils/date'

export function initFilters() {
  Vue.filter('formatDate', function(val, pattern) {
    return formatDate(val, pattern)
  })
}
