<template>
    <el-card style="width: 100%">
        <div slot="header">
            <span>随访表单</span>
        </div>
        <div class="card-content">
            <survey-creator :survey="report.survey" :tools="tools" @surveyChange="save"></survey-creator>
        </div>
        <select-report ref="select-report"></select-report>
    </el-card>
</template>

<script>
    import SurveyCreator from '../../components/survey/SurveyCreator'
    import { findWithReport, saveWithReport } from '../../api/PlanService'
    import SelectReport from '../report/SelectReport'

    export default {
      name: 'PlanReport',
      components: {
        SurveyCreator,
        SelectReport
      },
      data() {
        return {
          projectId: this.$route.params.projectId,
          planId: this.$route.params.planId,
          report: {
            survey: null
          },
          plan: {},
          tools: [
            {
              title: '选择问卷',
              action: () => this.selectReport()
            }
          ]
        }
      },
      mounted() {
        this.findPlanReport(this.planId)
      },
      methods: {
        findPlanReport(planId) {
          if (planId) {
            findWithReport(planId).then(res => {
              this.plan = res.data.plan
              this.report = res.data.report
              if (!this.report) {
                this.report = {
                  survey: null
                }
              }
            })
          }
        },
        selectReport() {
          this.$refs['select-report'].show().then((report) => {
            this.report = report
          })
        },
        save(survey, title) {
          this.report.title = title
          this.report.survey = survey
          saveWithReport(this.plan, this.report).then(res => {
            this.findPlanReport(res.data.plan.id)
          })
        }
      }
    }
</script>

<style scoped>

</style>