import axios from 'axios'

export function getCurrentProjectMemberTask(projectId) {
  return axios({
    method: 'get',
    url: `api/projects/${projectId}/task`
  })
}

export function savePatientTask(data) {
  return axios({
    method: 'post',
    url: `api/patient-tasks`,
    data
  })
}

export function getPatientTaskReport(taskId) {
  return axios({
    method: 'get',
    url: `api/patient-tasks/${taskId}/report`
  })
}
