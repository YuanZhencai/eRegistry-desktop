import request from '@/utils/request'

export function createInvitation(data) {
  return request({
    method: 'post',
    url: `/api/invitations/member`,
    data
  })
}
