<template>
    <div>
        <survey-view :info="survey" @dataChange="save"></survey-view>
    </div>
</template>

<script>
  import { getPatientCase } from '../../api/PatientCaseService'
  import { getReport } from '../../api/ReportService'
  import { PatientSurvey } from '../patient/patient-survey'
  import SurveyView from '../../components/survey/SurveyView'
  import { fillCase } from '../../api/PatientService'

export default {
    name: 'PatientCase',
    components: { SurveyView },
    data() {
      return {
        patientId: this.$route.query.patientId,
        projectId: this.$route.query.projectId,
        reportId: this.$route.query.reportId,
        caseId: this.$route.query.caseId,
        patientCase: {},
        report: {},
        survey: {}
      }
    },
    created() {
      this.findPatientCaseSurvey()
    },
    methods: {
      findPatientCaseSurvey() {
        const vm = this
        vm.$axios.all([vm.findReport(), vm.findPatientCase()])
          .then(vm.$axios.spread(function(report, patientCase) {
            vm.report = report.data
            vm.patientCase = patientCase.data
            vm.survey = new PatientSurvey(vm.report, vm.patientCase)
          }))
      },
      findReport() {
        if (this.reportId) {
          return getReport(this.reportId)
        } else {
          return new Promise((resolve, reject) => {
            resolve({
              data: {}
            })
          })
        }
      },
      findPatientCase() {
        if (this.caseId) {
          return getPatientCase(this.caseId)
        } else {
          return new Promise((resolve, reject) => {
            resolve({
              data: {
                projectId: this.projectId,
                patientId: this.patientId,
                state: 'SAVED'
              }
            })
          })
        }
      },
      save(data, state) {
        const complete = this.survey.complete(data, state)
        fillCase(complete).then((res) => {
          this.caseId = res.data.id
          this.findPatientCaseSurvey()
        })
      }
    }
  }
</script>

<style scoped>

</style>
