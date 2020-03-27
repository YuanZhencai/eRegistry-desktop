import moment from 'moment'

export function formatDate(val, pattern) {
  if (!val) {
    return null
  }
  return moment(val).format(pattern)
}
