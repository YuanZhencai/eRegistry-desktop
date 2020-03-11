<template>
  <el-card style="width: 100%">
    <div slot="header">
      <span>问卷表单</span>
    </div>
    <div class="card-content">
      <survey-creator :survey="report.survey" @surveyChange="save"></survey-creator>
    </div>
  </el-card>
</template>

<script>
  import SurveyCreator from '@/components/survey/SurveyCreator'
  import { getReport, updateReport } from '../../api/ReportService'

export default {
    name: 'ReportDetail',
    components: {
      SurveyCreator
    },
    data() {
      return {
        reportId: this.$route.params.reportId,
        report: {
          title: null,
          survey: null
        }
      }
    },
    created() {
      this.findReport()
    },
    methods: {
      findReport() {
        if (this.reportId) {
          getReport(this.reportId).then(res => {
            this.report = res.data
          })
        }
      },
      save(survey, title) {
        this.report.survey = survey
        this.report.title = title
        updateReport(this.report).then(res => {
          this.$router.push({
            path: `/report`
          })
        })
      }
    }
  }
</script>

<style scoped>

</style>
