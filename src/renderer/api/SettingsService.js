import request from '@/utils/request'
export function getsettings() {
  return request({
    url: `/api/account`,
    method: 'get'
  })
}
export function postsave(data) {
  return request({
    url: `/api/account`,
    method: 'post',
    data
  })
}
export function upload(data) {
  return request({
    url: `/api/images/upload`,
    method: 'post',
    data
  })
}
export function changePassword(data) {
  return request({
    url: `/api/account/change-password`,
    method: 'post',
    headers: { 'Content-Type': 'text/plain' },
    data
  })
}
