import axios from 'axios'
export function getCalendar(data) {
  return axios(`api/follows/events/${data.id}`, {
    params: data,
    method: 'get'
  })
}
