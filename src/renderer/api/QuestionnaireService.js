import request from '@/utils/request'

export function getProjectQuestionnaires(projectId, params) {
  return request({
    url: `/api/project/${projectId}/questionnaires`,
    method: 'get',
    params: params
  })
}

export function getQuestionnaireWithReport(id) {
  return request({
    url: `/api/questionnaires/report/${id}`,
    method: 'get'
  })
}

export function saveWithReport(questionnaireDTO) {
  return request({
    url: `/api/questionnaires/report`,
    method: 'put',
    data: questionnaireDTO
  })
}

export function getSurveyInvestigation(id) {
  return request({
    url: `/api/questionnaire-investigations/${id}/report`,
    method: 'get'
  })
}

export function deleteQuestionnaire(id) {
  return request({
    url: `/api/questionnaires/${id}`,
    method: 'delete'
  })
}
