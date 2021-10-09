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

export function getInvestigationAlertEvents(investigationId) {
  return axios.get(`api/investigations/${investigationId}/alert-events`)
}

export function getTopAlertEvents(projectId) {
  return axios.get(`api/projects/${projectId}/top-events`)
}

export function getAlertEvent(eventId) {
  return axios.get(`api/alert-events/${eventId}`)
}

export function deleteAlertEvent(eventId) {
  return axios.delete(`api/alert-events/${eventId}`)
}

export function handleAlertEvent(event) {
  return axios.put(`api/alert-events/handle`, event)
}
