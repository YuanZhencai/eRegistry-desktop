import request from '@/utils/request'

export function getAllAudits(params) {
  return request({
    url: `/api/audits`,
    method: 'get',
    params
  })
}

export function createAudit(data) {
  return request({
    url: `/api/audits`,
    method: 'post',
    data
  })
}

export function updateAudit(data) {
  return request({
    url: `/api/audits`,
    method: 'put',
    data
  })
}

export function getAudit(id) {
  return request({
    url: `/api/audits/${id}`,
    method: 'get'
  })
}

export function deleteAudit(id) {
  return request({
    url: `/api/audits/${id}`,
    method: 'delete'
  })
}

export function changeAudit(data) {
  return request({
    url: `/api/audits/change`,
    method: 'post',
    data
  })
}

export function recordAudit(data) {
  return request({
    url: `/api/audits/record`,
    method: 'post',
    data
  })
}

export function withdrawalAudit(data) {
  return request({
    url: `/api/audits/withdrawal`,
    method: 'post',
    data
  })
}
