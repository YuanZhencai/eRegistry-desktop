<template>
  <el-card style="width: 100%">
    <div slot="header">
      <span>调查问卷</span>
    </div>
    <div class="card-content">
      <survey-creator :survey="report.survey" :tools="tools" @surveyChange="save"></survey-creator>
    </div>
    <select-report ref="select-report"></select-report>
  </el-card>
</template>

<script>
  import { getQuestionnaireWithReport, saveWithReport } from '@/api/QuestionnaireService'
  import SurveyCreator from '@/components/survey/SurveyCreator'
  import SelectReport from '../report/SelectReport'

export default {
    name: 'QuestionnaireDetail',
    components: {
      SelectReport,
      SurveyCreator
    },
    data() {
      return {
        projectId: this.$route.params.projectId,
        questionnaireId: this.$route.params.questionnaireId,
        questionnaireReport: null,
        report: {},
        tools: [
          {
            title: '选择问卷',
            action: () => this.selectReport()
          }
        ]
      }
    },
    created() {
      this.findQuestionnaireWithReport()
    },
    methods: {
      findQuestionnaireWithReport() {
        if (this.questionnaireId) {
          getQuestionnaireWithReport(this.questionnaireId).then((response) => {
            this.questionnaireReport = response.data
            this.report = response.data.report
          })
        } else {
          this.report = {
            survey: null,
            title: null
          }
          this.questionnaireReport = {
            questionnaire: {
              projectId: this.projectId
            },
            report: this.report
          }
        }
      },
      save(survey, title) {
        this.report.title = title
        this.report.survey = survey
        this.questionnaireReport.report = this.report
        saveWithReport(this.questionnaireReport).then(res => {
          this.findQuestionnaireWithReport(res.data.id)
        })
      },
      selectReport() {
        this.$refs['select-report'].show().then((report) => {
          this.report = report
        })
      }
    }
  }
</script>

<style scoped>

</style>
