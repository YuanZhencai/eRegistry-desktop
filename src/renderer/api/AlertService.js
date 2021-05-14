import axios from 'axios'

export function getQuestionnaireAlertSetting(questionnaireId) {
  return axios.get(`api/questionnaires/${questionnaireId}/alert-setting`)
}

export function saveQuestionnaireAlertSetting(settings) {
  return axios.put(`api/questionnaires/alert-setting`, settings)
}

export function getProjectAlertEvents(projectId, params) {
  return axios.get(`api/projects/${projectId}/alert-events`, params)
}
