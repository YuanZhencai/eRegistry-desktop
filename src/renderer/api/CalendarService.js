import request from '@/utils/request'
export function getCalendar(data) {
  return request({
    url: 'api/follows/events/' + data.id + '?begin=' + data.begin + '&end=' + data.end + '&format=' + data.format + '&zoneId=' + data.zoneId,
    method: 'get'
  })
}
