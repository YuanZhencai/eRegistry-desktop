import request from '@/utils/request'

export function getProjectQuestionnaires(projectId) {
  return request({
    url: `/api/project/${projectId}/questionnaires`,
    method: 'get',
    transformResponse: [function(data) {
      try {
        data = JSON.parse(data)
      } catch (err) {
        data = {}
      }
      return data
    }]
  })
}

export function getQuestionnaireWithReport(id) {
  return request({
    url: `/api/questionnaires/report/${id}`,
    method: 'get',
    transformResponse: [function(data) {
      try {
        data = JSON.parse(data)
      } catch (err) {
        data = {}
      }
      return data
    }]
  })
}

export function saveWithReport(questionnaireDTO) {
  return request({
    url: `/api/questionnaires/report`,
    method: 'put',
    data: questionnaireDTO,
    transformResponse: [function(data) {
      try {
        data = JSON.parse(data)
      } catch (err) {
        data = {}
      }
      return data
    }]
  })
}

export function getSurveyInvestigation(id) {
  return request({
    url: `/api/questionnaire-investigations/${id}/report`,
    method: 'get',
    transformResponse: [function(data) {
      try {
        data = JSON.parse(data)
      } catch (err) {
        data = {}
      }
      return data
    }]
  })
}

export function deleteQuestionnaire(id) {
  return request({
    url: `/api/questionnaires/${id}`,
    method: 'delete'
  })
}
