import axios from 'axios'

export function createMeeting(meeting) {
  return axios.post(`api/meetings`, meeting)
}

export function getProjectMeetings(req) {
  return axios.get(`api/meetings/me`, {
    params: req
  })
}

export function finishMeeting(roomId) {
  return axios.put(`api/meetings/${roomId}/finish`)
}
