import Vue from 'vue'
import moment from 'moment'

export function initFilters() {
  Vue.filter('formatDate', function(val, pattern) {
    return moment(val).format(pattern)
  })
}
