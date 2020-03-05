<template>
  <el-card style="width: 100%">
    <div slot="header">
      <span>调查问卷</span>
    </div>
    <div class="card-content">
      <survey-creator :survey="report.survey" :tools="tools" @surveyChange="save"></survey-creator>
    </div>
  </el-card>
</template>

<script>
  import { getQuestionnaireWithReport, saveWithReport } from '@/api/QuestionnaireService'
  import SurveyCreator from '@/components/survey/SurveyCreator'

  export default {
    name: 'QuestionnaireDetail',
    components: {
      SurveyCreator
    },
    data() {
      return {
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
      this.findQuestionnaireWithReport(this.questionnaireId)
    },
    methods: {
      findQuestionnaireWithReport(questionnaireId) {
        getQuestionnaireWithReport(questionnaireId).then((response) => {
          this.questionnaireReport = response.data
          this.report = response.data.report
        })
      },
      save(survey) {
        this.report.survey = survey
        this.questionnaireReport.report = this.report
        saveWithReport(this.questionnaireReport).then(res => {
          this.findQuestionnaireWithReport(res.data.id)
        })
      },
      selectReport() {
        console.info('selectReport')
      }
    }
  }
</script>

<style scoped>

</style>
