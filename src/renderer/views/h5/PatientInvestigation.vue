<template>
    <div>
		<div v-if="events && events.length > 0">
			<div style="padding-left: 10px">异常指标</div>
			<el-table
					:data="events"
					:show-header="false"
					stripe
					style="width: 100%">
				<el-table-column>
					<template slot-scope="scope">
						<el-row>
							<el-col :span="24">
								<div class=" " style="font-size: 14px;font-weight: 500;">
									<div class=" " style="white-space: nowrap;text-overflow: ellipsis;overflow: hidden;">
										<span style="margin-right: 5px">{{scope.row.question}}</span><span :class="scope.row.type">{{scope.row.content}}</span>
									</div>
								</div>
							</el-col>
						</el-row>
						<el-row v-if="scope.row.handleType">
							<el-col :span="24">
								<span style="margin-right: 5px">处理意见: {{scope.row.handleType}}</span><span>{{scope.row.handleDesc}}</span>
							</el-col>
						</el-row>
					</template>
				</el-table-column>
			</el-table>
		</div>
		<survey-view :info="survey" @dataChange="save"></survey-view>
	</div>
</template>

<script>
  import { getInvestigation } from '../../api/InvestigationService'
  import SurveyView from '@/components/survey/SurveyView'
  import { InvestigationSurvey } from '../investigation/investigation-survey'
  import { getReport } from '../../api/ReportService'
  import { fillInvestigation } from '../../api/PatientService'
  import { getInvestigationAlertEvents } from '../../api/AlertService'
export default {
    name: 'PatientInvestigation',
    components: {
      SurveyView
    },
    data() {
      return {
        reportId: this.$route.query.reportId,
        projectId: this.$route.query.projectId,
        questionnaireId: this.$route.query.questionnaireId,
        investigationId: this.$route.query.investigationId,
        report: {},
        investigation: {},
        survey: {},
        isSaving: false,
        events: []
      }
    },
    created() {
      this.findInvestigationSurvey()
      this.findEvents()
    },
    methods: {
      findEvents() {
        if (this.investigationId) {
          getInvestigationAlertEvents(this.investigationId).then((res) => {
            this.events = res.data
          })
        }
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
        vm.$axios.all([vm.findReport(), vm.findInvestigation()])
          .then(vm.$axios.spread(function(report, investigation) {
            vm.report = report.data
            vm.investigation = investigation.data
            vm.survey = new InvestigationSurvey(vm.report, vm.investigation)
          }))
      },
      save(data, state) {
        this.isSaving = true
        this.investigation = this.survey.complete(data, state)
        fillInvestigation(this.investigation).then((res) => {
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
