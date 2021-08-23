import axios from 'axios'

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
