import request from '@/utils/request'
export function getCalendar(data) {
  return request(`api/follows/events/${data.id}`, {
    params: data,
    method: 'get'
  })
}
