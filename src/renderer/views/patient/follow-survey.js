export class FollowSurvey {
  _survey;
  _data;
  _mode;
  follow;
  report;

  constructor(report, follow, mode) {
    this.report = report
    this.follow = follow
    this._mode = mode
  }

  complete(data, state) {
    if (!state) {
      state = 'SAVED'
    }
    if (this.follow) {
      this.follow.state = state
      this.follow.content = JSON.stringify(data)
    }
    return this.follow
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
    if (this.follow && this.follow.content) {
      this._data = JSON.parse(this.follow.content)
    }
    return this._data
  }

  set data(value) {
    this._data = value
  }

  get mode() {
    return this._mode ? this._mode : this.follow === null ? 'display' : ((this.follow.state === 'SUBMITTED' || this.follow.state === 'APPROVED') ? 'display' : 'edit')
  }

  set mode(value) {
    this._mode = value
  }
}
