export class PatientSurvey {
  _survey;
  _data;
  _mode;
  patient;
  report;

  constructor(report, patientCase, mode) {
    this.report = report
    this.patient = patientCase
    this._mode = mode
  }

  complete(data, state) {
    if (this.patient) {
      this.patient.state = state
      this.patient.content = JSON.stringify(data)
    }
    return this.patient
  }

  get survey() {
    if (this.report && this.report.survey) {
      this._survey = JSON.parse(this.report.survey)
    }
    return this._survey
  }

  set survey(value) {
    this._survey = value
  }

  get data() {
    if (this.patient && this.patient.content) {
      this._data = JSON.parse(this.patient.content)
    }
    return this._data
  }

  set data(value) {
    this._data = value
  }

  get mode() {
    return this._mode ? this._mode : this.patient === null ? 'display' : ((this.patient.state === 'SUBMITTED' || this.patient.state === 'APPROVED') ? 'display' : 'edit')
  }

  set mode(value) {
    this._mode = value
  }
}
