import axios from 'axios'

export function getProjectQuestionnaires(projectId, params) {
  return axios({
    url: `api/project/${projectId}/questionnaires`,
    method: 'get',
    params: params
  })
}

export function getQuestionnaireWithReport(id) {
  return axios({
    url: `api/questionnaires/report/${id}`,
    method: 'get'
  })
}

export function getQuestionnaireReport(questionnaireId) {
  return axios({
    url: `api/questionnaire-investigations/${questionnaireId}/report`,
    method: 'get'
  })
}

export function saveWithReport(questionnaireDTO) {
  return axios({
    url: `api/questionnaires/report`,
    method: 'put',
    data: questionnaireDTO
  })
}

export function deleteQuestionnaire(id) {
  return axios({
    url: `api/questionnaires/${id}`,
    method: 'delete'
  })
}

export function getQuestionnaireSum(id) {
  return axios.get(`api/questionnaires/${id}/sum`)
}
