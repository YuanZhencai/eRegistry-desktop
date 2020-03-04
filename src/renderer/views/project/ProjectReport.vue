<template>
  <div class="app-container">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>病例表单</span>
      </div>
      <survey-creator :survey="report.survey" @surveyChange="save"></survey-creator>
    </el-card>
  </div>
</template>

<script>
  import SurveyCreator from '@/components/survey/SurveyCreator'
  import { findReport } from '@/api/ProjectResource'
  import { saveReport } from '@/api/ProjectResource'

export default {
    name: 'ProjectReport',
    components: {
      SurveyCreator
    },
    data() {
      return {
        creatorInfo: {},
        projectId: this.$route.params.projectId,
        report: {}
      }
    },
    created() {
      this.findProjectReport()
    },
    methods: {
      save(survey) {
        this.report.survey = survey
        saveReport(this.projectId, this.report).then((response) => {
          this.report = response.data
        })
      },
      findProjectReport() {
        findReport(this.projectId).then((response) => {
          this.report = response.data
        })
      }
    }
  }
</script>

<style scoped>
</style>
