import axios from 'axios'
import { SERVER_API_URL } from '../constants'
import store from '../store'

export function getAttachmentSettings(params) {
  return axios.get(`api/attachment-settings`, { params: params })
}

export function saveAttachmentSetting(settings) {
  return axios.put(`api/attachment-settings`, settings)
}

export function getAttachmentSetting(settingId) {
  return axios.get(`api/attachment-settings/${settingId}`)
}

export function deleteAttachmentSetting(settingId) {
  return axios.delete(`api/attachment-settings/${settingId}`)
}

export function getPatientAttachments(patientId, caseId, followId) {
  return axios.get(`api/patients/${patientId}/attachments`,
    {
      params: {
        caseId: caseId,
        followId: followId
      }
    }
  )
}

export function formatAttachmentUrl(attachmentId) {
  const token = store.getters.token
  return `${SERVER_API_URL}api/attachments/${attachmentId}/content.png?access_token=${token}`
}
