import axios from 'axios'
import { SERVER_API_URL } from '../constants'

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

export function getPatientAttachments(patientId, planId) {
  return axios.get(`api/patients/${patientId}/attachments`, { params: { planId: planId }})
}

export function formatAttachmentUrl(attachmentId) {
  return `${SERVER_API_URL}api/attachments/image/${attachmentId}.png`
}
