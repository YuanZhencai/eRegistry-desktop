import axios from 'axios'

export function getQuestionnaireAlertSetting(questionnaireId) {
  return axios.get(`api/questionnaires/${questionnaireId}/alert-setting`)
}

export function saveQuestionnaireAlertSetting(settings) {
  return axios.put(`api/questionnaires/alert-setting`, settings)
}

export function getProjectAlertEvents(projectId, params) {
  return axios.get(`api/projects/${projectId}/alert-events`, { params: params })
}

export function getAlertEvent(eventId) {
  return axios.get(`api/alert-events/${eventId}`)
}

export function handleAlertEvent(event) {
  return axios.put(`api/alert-events/handle`, event)
}
