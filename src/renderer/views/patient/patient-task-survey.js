import moment from 'moment'
import { PatientInfoPage } from './patient-model'

export class PatientTaskSurvey {
  _survey;
  _data;
  _mode;
  task;
  report;

  constructor(report, task, mode) {
    this.report = report
    this.task = task
    this._mode = mode
  }
  get mode() {
    return this._mode ? this._mode : this.task.cases === null ? 'display' : ((this.task.cases.state === 'SUBMITTED' || this.task.cases.state === 'APPROVED') ? 'display' : 'edit')
  }

  set mode(value) {
    this._mode = value
  }

  get survey() {
    this._survey = {
      locale: 'zh-cn',
      pages: []
    }
    if (this.report && this.report.survey) {
      this._survey = JSON.parse(this.report.survey)
    }
    this._survey.pages.unshift(new PatientInfoPage())
    return this._survey
  }

  set survey(value) {
    this._survey = value
  }

  get data() {
    if (this.task && this.task.patient) {
      this._data = {
        name: this.task.patient.name,
        sex: this.task.patient.sex,
        birthday: moment(this.task.patient.birthday).isValid() ? moment(this.task.patient.birthday).format('YYYY-MM-DD') : null,
        visitDate: moment(this.task.patient.visitDate).isValid() ? moment(this.task.patient.visitDate).format('YYYY-MM-DD') : null,
        address: {
          province: this.task.patient.province,
          city: this.task.patient.city,
          district: this.task.patient.area,
          street: this.task.patient.address
        },
        telephone: this.task.patient.telephone,
        reserveTelephone: this.task.patient.reserveTelephone
      }
      if (this.task.cases && this.task.cases.content) {
        Object.assign(this._data, JSON.parse(this.task.cases.content))
      }
    }
    return this._data
  }

  set data(value) {
    this._data = value
  }

  complete(data, state) {
    if (!state) {
      state = 'SAVED'
    }
    this.task.patient.name = data.name
    this.task.patient.sex = data.sex
    this.task.patient.birthday = moment(data.birthday).isValid() ? new Date(data.birthday).toISOString() : null
    this.task.patient.visitDate = moment(data.visitDate).isValid() ? new Date(data.visitDate).toISOString() : null
    const address = data.address
    if (address) {
      this.task.patient.province = address.province
      this.task.patient.city = address.city
      this.task.patient.area = address.district
      this.task.patient.address = address.street
    }
    this.task.patient.telephone = data.telephone
    this.task.patient.reserveTelephone = data.reserveTelephone
    delete data.name
    delete data.sex
    delete data.birthday
    delete data.visitDate
    delete data.address
    delete data.telephone
    delete data.reserveTelephone
    this.task.cases.content = JSON.stringify(data)
    this.task.cases.state = state
    return this.task
  }
}
