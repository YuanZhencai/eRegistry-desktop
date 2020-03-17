import request from '@/utils/request'

export function getCurrentProjectMemberTask(projectId) {
  return request({
    method: 'get',
    url: `/api/projects/${projectId}/task`
  })
}

export function savePatientTask(data) {
  return request({
    method: 'post',
    url: `/api/patient-tasks`,
    data
  })
}

export function getPatientTaskReport(taskId) {
  return request({
    method: 'get',
    url: `/api/patient-tasks/${taskId}/report`
  })
}
