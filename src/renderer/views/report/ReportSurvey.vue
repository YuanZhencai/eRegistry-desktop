<template>
    <div class="report-survey" v-if="info">
        <survey-view :info="info" @dataChange="submit" @saveChange="save" @valueChange="valueChange"></survey-view>
    </div>
</template>

<script>
    import SurveyView from '../../components/survey/SurveyView'
    export default {
      name: 'ReportSurvey',
      components: { SurveyView },
      props: {
        survey: {
          type: Object
        }
      },
      data() {
        console.log(this.survey)
        return {
          _survey: this.survey,
          info: this.survey.build()
        }
      },
      methods: {
        complete(data, state) {
          if (this.patient) {
            this.patient.state = state
            this.patient.content = JSON.stringify(data)
          }
          return this.patient
        },
        submit(data) {
          this._survey.changed = false
          this.$emit('completeChange', this._survey.complete(data, 'SUBMITTED'))
        },
        save(data) {
          this._survey.changed = false
          this.$emit('completeChange', this._survey.complete(data, 'SAVED'))
        },
        valueChange(data) {
          this._survey.changed = true
          this._survey.complete(data, 'SAVED')
        }
      }
    }
  </script>

<style scoped>

</style>
