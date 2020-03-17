import moment from 'moment'

export function formatDate(val, pattern) {
  return moment(val).format(pattern)
}
