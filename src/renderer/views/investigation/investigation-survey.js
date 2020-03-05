export class InvestigationSurvey {
  _survey;
  _data;
  _mode;
  investigation;
  report;

  constructor(report, investigation, mode) {
    this.report = report
    this.investigation = investigation
    this._mode = mode
  }

  complete(data, state) {
    if (this.investigation) {
      this.investigation.content = JSON.stringify(data)
    }
    return this.investigation
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
    if (this.investigation && this.investigation.content) {
      this._data = JSON.parse(this.investigation.content)
    }
    return this._data
  }

  set data(value) {
    this._data = value
  }

  get mode() {
    return this._mode
  }

  set mode(value) {
    this._mode = value
  }
}
