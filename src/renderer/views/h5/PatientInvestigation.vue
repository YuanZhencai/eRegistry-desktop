<template>
    <div>
        <survey-view :info="survey" @dataChange="save"></survey-view>
    </div>
</template>

<script>
  import { getInvestigation, saveInvestigation } from '../../api/InvestigationService'
  import SurveyView from '@/components/survey/SurveyView'
  import { getQuestionnaireReport } from '../../api/QuestionnaireService'
  import { InvestigationSurvey } from '../investigation/investigation-survey'
export default {
    name: 'PatientInvestigation',
    components: {
      SurveyView
    },
    data() {
      return {
        projectId: this.$route.params.projectId,
        questionnaireId: this.$route.params.questionnaireId,
        investigationId: this.$route.params.investigationId,
        report: {},
        investigation: {},
        survey: {},
        isSaving: false
      }
    },
    created() {
      this.findInvestigationSurvey()
    },
    methods: {
      findQuestionnaireReport() {
        return getQuestionnaireReport(this.questionnaireId)
      },
      findInvestigation() {
        if (this.investigationId) {
          return getInvestigation(this.investigationId)
        } else {
          return new Promise((resolve, reject) => {
            resolve({
              data: {
                questionnaireId: this.questionnaireId,
                content: null
              }
            })
          })
        }
      },
      findInvestigationSurvey() {
        const vm = this
        vm.$axios.all([vm.findQuestionnaireReport(), vm.findInvestigation()])
          .then(vm.$axios.spread(function(report, investigation) {
            vm.report = report.data
            vm.investigation = investigation.data
            vm.survey = new InvestigationSurvey(vm.report, vm.investigation)
          }))
      },
      save(data, state) {
        this.isSaving = true
        this.investigation = this.survey.complete(data, state)
        saveInvestigation(this.investigation).then((res) => {
          this.isSaving = false
          this.investigationId = res.data.id
          this.findInvestigationSurvey()
        }, () => {
          this.isSaving = false
        })
      }
    }
  }
</script>

<style scoped>

</style>
