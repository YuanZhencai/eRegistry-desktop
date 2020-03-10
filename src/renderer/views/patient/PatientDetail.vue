<template>
    <div>
        <el-row>
            <patient-info :patient="timeline.patient"></patient-info>
        </el-row>
        <el-row>
            <div class="float-right" v-if="timeline">
                <template>
                    <el-dropdown trigger="hover" v-if="!follow && patientCase && 'SUBMITTED' === patientCase.state">
                        <el-button type="primary" size="mini">
                            审核病例<i class="el-icon-arrow-down el-icon--right"></i>
                        </el-button>
                        <el-dropdown-menu slot="dropdown">
                            <el-dropdown-item>
                                通过
                            </el-dropdown-item>
                            <el-dropdown-item>
                                拒绝
                            </el-dropdown-item>
                        </el-dropdown-menu>
                    </el-dropdown>
                    <el-dropdown v-if="!patientCase && follow && 'SUBMITTED' === follow.state">
                        <el-button type="primary" size="mini">
                        审核随访<i class="el-icon-arrow-down el-icon--right"></i>
                        </el-button>
                        <el-dropdown-menu slot="dropdown">
                            <el-dropdown-item>
                                通过
                            </el-dropdown-item>
                            <el-dropdown-item>
                                拒绝
                            </el-dropdown-item>
                        </el-dropdown-menu>
                    </el-dropdown>
                    <el-dropdown v-if="audit && 'CHANGE_SUBMIT' === audit.state">
                        <el-button type="primary" size="mini">
                        审核变更申请<i class="el-icon-arrow-down el-icon--right"></i>
                        </el-button>
                        <el-dropdown-menu slot="dropdown">
                            <el-dropdown-item>
                                <a>同意</a>
                            </el-dropdown-item>
                            <el-dropdown-item>
                                <a>拒绝</a>
                            </el-dropdown-item>
                        </el-dropdown-menu>
                    </el-dropdown>
                </template>
                <template>
                    <el-button type="primary" size="mini" v-if="!follow && patientCase && 'SUBMITTED' === patientCase.state">
                        撤回审核
                    </el-button>
                    <el-button type="primary" size="mini" v-if="!patientCase && follow && 'SUBMITTED' === follow.state">
                        撤回审核
                    </el-button>
                    <el-button type="primary" size="mini" v-if="!follow && patientCase && 'APPROVED' === patientCase.state">
                        申请数据变更
                    </el-button>
                    <el-button type="primary" size="mini" v-if="!patientCase && follow && 'APPROVED' === follow.state">
                        申请数据变更
                    </el-button>
                </template>
            </div>
        </el-row>
        <el-row :gutter="15">
            <el-col :span="18">
                <survey-view :info="survey"></survey-view>
                <audit-component :audits="audits"></audit-component>
            </el-col>
            <el-col :span="6">
                <timeline v-if="timeline.steps" :timeline="timeline" :can-add-item="isRegister"
                    @stepChange="stepChange"></timeline>
            </el-col>
        </el-row>
    </div>
</template>

<script>
  import { getTimeline } from '@/api/PatientService'
  import { getReport } from '@/api/ReportService'
  import { getPatientCase, createPatientCase, updatePatientCase } from '@/api/PatientCaseService'
  import { getFollow, createFollow, updateFollow } from '@/api/FollowService'
  import { getAllAudits } from '@/api/AuditService'
  // import { Principal } from '../../api/Principal'
  import PatientInfo from './PatientInfo'
  import SurveyView from '../../components/survey/SurveyView'
  import Timeline from './timeline'
  import AuditComponent from './auditComponent'
  export default {
    name: 'PatientDetail',
    components: { AuditComponent, Timeline, SurveyView, PatientInfo },
    data() {
      const patientId = this.$route.params.patientId
      const projectId = this.$route.params.projectId
      return {
        patientId,
        projectId,
        isRegister: null,
        timeline: {},
        report: null,
        audits: [],
        follow: null, // 随访
        patientCase: null, // 病例
        survey: {},
        audit: {}
      }
    },
    created() {
      // this.isRegister = Principal.hasAnyAuthorityDirec([
      //   'PROJECT_ADMIN_' + this.projectId,
      //   'PROJECT_PATIENT_' + this.projectId
      // ])
      this.isRegister = true
      this.findTimeline()
    },
    methods: {
      mode() {
        return this.isRegister ? null : 'display'
      },
      findTimeline() {
        // 获取时间线
        getTimeline(this.patientId).then(res => {
          this.timeline = res.data
          this.timeline.current = 0
          if (this.timeline.steps && this.timeline.steps.length > 0) {
            this.findStepDetail(this.timeline.steps[0])
          }
        })
      },
      stepChange(val) {
        this.$set(this.timeline, 'current', val.current)
        this.findStepDetail(val.step)
      },
      findStepDetail(step) {
        this.findReport(step.reportId).then((report) => {
          this.report = report
          if (step.type === 'PATIENT') { // 首诊病例
            this.timeline.current = 0 // 设置当前active step
            this.findCase(step.caseId) // 获取病例
            this.follow = null
          } else { // 随访
            this.findFollow(step.followId, step.planId)
            this.patientCase = null
          }
        })
      },
      findReport(reportId) {
        return new Promise((resolve, reject) => {
          if (reportId) {
            getReport(reportId).then(res => {
              resolve(res.data)
            })
          } else {
            setTimeout(() => {
              resolve({ title: '', description: '', state: '', survey: '', type: '' })
            }, 0)
          }
        })
      },
      findCase(caseId) {
        if (caseId) {
          getPatientCase(caseId).then(res => {
            this.patientCase = res.data
            this.patientCase.projectId = this.projectId
            this.survey = {
              survey: this.report.survey,
              data: this.patientCase,
              mode: this.mode()
            }
          })
          this.findAudits('PATIENT_CASE', caseId)
        } else {
          this.patientCase = {}
          this.patientCase.projectId = this.projectId
          this.patientCase.patientId = this.patientId
          this.survey = {
            survey: this.report.survey,
            data: this.patientCase,
            mode: this.mode()
          }
        }
      },
      findFollow(followId, planId) {
        if (followId) {
          getFollow(followId).then(res => {
            this.follow = res.data
            this.follow.projectId = this.projectId
            this.survey = {
              survey: this.report.survey,
              data: this.follow,
              mode: this.mode()
            }
          })
          this.findAudits('FOLLOW', followId)
        } else {
          this.audits = []
          this.follow = {}
          this.follow = Object.assign({}, this.follow,
            { state: 'SAVED',
              patientId: this.patientId,
              projectId: this.projectId,
              planId: planId
            })
          this.survey = {
            survey: this.report.survey,
            data: this.follow,
            mode: this.mode()
          }
        }
      },
      findAudits(type, recordId) {
        getAllAudits({ type, recordId }).then((res) => {
          this.audits = res.data
          if (this.audits.length > 0) {
            this.audit = this.audits[0]
          }
        })
      },
      save() {
        if (this.patientCase) {
          this.saveCase()
        } else if (this.follow) {
          this.saveFollow()
        }
      },
      saveCase() {
        if (this.patientCase.id !== undefined) {
          updatePatientCase(this.patientCase)
        } else {
          createPatientCase(this.patientCase)
        }
      },
      saveFollow() {
        if (this.follow) {
          if (this.follow.id !== undefined) {
            updateFollow(this.follow)
          } else {
            createFollow(this.follow)
          }
        }
      },
      findRecordByAudit() {
        if (this.patientCase && !this.follow) {
          this.findCase(this.patientCase.id)
        }
        if (!this.patientCase && this.follow) {
          this.findFollow(this.follow.id)
        }
      }
    }
  }
</script>

<style scoped>

</style>
