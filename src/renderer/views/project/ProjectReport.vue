<template>
  <el-card class="box-card">
    <div slot="header" class="clearfix">
      <span>病例表单</span>
    </div>
    <survey-creator :survey="report.survey" :tools="tools" @surveyChange="save"></survey-creator>
    <select-report ref="select-report"></select-report>
  </el-card>
</template>

<script>
  import SurveyCreator from '@/components/survey/SurveyCreator'
  import { findReport } from '@/api/ProjectResource'
  import { saveReport } from '@/api/ProjectResource'
  import SelectReport from '../report/SelectReport'

export default {
    name: 'ProjectReport',
    components: {
      SurveyCreator,
      SelectReport
    },
    data() {
      return {
        creatorInfo: {},
        projectId: this.$route.params.projectId,
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
      this.findProjectReport()
    },
    methods: {
      save(survey, title) {
        this.report.survey = survey
        this.report.title = title
        saveReport(this.projectId, this.report).then((response) => {
          this.report = response.data
        })
      },
      findProjectReport() {
        findReport(this.projectId).then((response) => {
          this.report = response.data
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
