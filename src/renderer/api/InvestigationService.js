import request from '@/utils/request'

export function getQuestionnaireReport(questionnaireId) {
  return request({
    url: `/api/questionnaire-investigations/${questionnaireId}/report`,
    method: 'get'
  })
}

export function saveInvestigation(investigation) {
  return request({
    url: `/api/questionnaire-investigations`,
    method: 'post',
    data: investigation
  })
}
