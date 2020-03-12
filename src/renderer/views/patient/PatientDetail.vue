<template>
    <div>
        <el-row>
            <patient-info :patient="timeline.patient"></patient-info>
        </el-row>
        <el-row style="margin-bottom: 10px">
            <div class="float-right" v-if="timeline">
                <template v-if="$hasAnyAuthority(['PROJECT_ADMIN_' + projectId, 'PROJECT_AUDIT_' + projectId])">
                    <el-dropdown trigger="hover" v-if="!follow && patientCase && 'SUBMITTED' === patientCase.state">
                        <el-button type="primary" size="mini">
                            审核病例<i class="el-icon-arrow-down el-icon--right"></i>
                        </el-button>
                        <el-dropdown-menu slot="dropdown">
                            <el-dropdown-item @click.native="recordAudit('PATIENT_CASE', 'APPROVE')">
                                通过
                            </el-dropdown-item>
                            <el-dropdown-item @click.native="recordAudit('PATIENT_CASE', 'REFUSE')">
                                拒绝
                            </el-dropdown-item>
                        </el-dropdown-menu>
                    </el-dropdown>
                    <el-dropdown v-if="!patientCase && follow && 'SUBMITTED' === follow.state">
                        <el-button type="primary" size="mini">
                        审核随访<i class="el-icon-arrow-down el-icon--right"></i>
                        </el-button>
                        <el-dropdown-menu slot="dropdown">
                            <el-dropdown-item @click.native="recordAudit('FOLLOW', 'APPROVE')">
                                通过
                            </el-dropdown-item>
                            <el-dropdown-item @click.native="recordAudit('FOLLOW', 'REFUSE')">
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
                <template v-if="$hasAnyAuthority(['PROJECT_ADMIN_' + projectId, 'PROJECT_PATIENT_' + projectId])">
                    <el-button type="primary" size="mini"
                               v-if="!follow && patientCase && 'SUBMITTED' === patientCase.state" @click="withdrawalAudit">
                        撤回审核
                    </el-button>
                    <el-button type="primary" size="mini"
                               v-if="!patientCase && follow && 'SUBMITTED' === follow.state" @click="withdrawalAudit">
                        撤回审核
                    </el-button>
                    <el-button type="primary" size="mini" class="patient-case"
                               v-if="!follow && patientCase && 'APPROVED' === patientCase.state"
                               @click="changeData('PATIEMT_CASE')">
                        申请数据变更
                    </el-button>
                    <el-button type="primary" size="mini" class="follow"
                               v-if="!patientCase && follow && 'APPROVED' === follow.state"
                               @click="changeData('FOLLOW')">
                        申请数据变更
                    </el-button>
                </template>
            </div>
        </el-row>
        <el-row :gutter="15">
            <el-col :span="18">
                <survey-view :info="survey" @dataChange="save"></survey-view>
                <audit-component :audits="audits"></audit-component>
            </el-col>
            <el-col :span="6">
                <timeline v-if="timeline.steps" :timeline="timeline" :can-add-item="isRegister"
                    @stepChange="stepChange"></timeline>
            </el-col>
        </el-row>
        <record-audit-dialog :dialog-visible="recordAuditDialogVisible" :audit="audit" @closeDialog="closeDialog"></record-audit-dialog>
        <change-data-dialog :dialog-visible="changeDataDialogVisible" :audit="audit" @closeDialog="closeDialog"></change-data-dialog>
        <withdrawal-audit-dialog :dialog-visible="withdrawalAuditDialogVisible" @closeDialog="closeDialog"></withdrawal-audit-dialog>
    </div>
</template>

<script>
  import { getTimeline } from '@/api/PatientService'
  import { getReport } from '@/api/ReportService'
  import { getPatientCase, createPatientCase, updatePatientCase } from '@/api/PatientCaseService'
  import { getFollow, createFollow, updateFollow } from '@/api/FollowService'
  import { getAllAudits } from '@/api/AuditService'
  import PatientInfo from './PatientInfo'
  import SurveyView from '../../components/survey/SurveyView'
  import Timeline from './timeline'
  import AuditComponent from './auditComponent'
  import { PatientSurvey } from './patient-survey'
import { FollowSurvey } from './follow-survey'
  import ChangeDataDialog from './ChangeDataDialog'
  import RecordAuditDialog from './RecordAuditDialog'
  import WithdrawalAuditDialog from './WithdrawalAuditDialog'
export default {
    name: 'PatientDetail',
    components: { WithdrawalAuditDialog, RecordAuditDialog, ChangeDataDialog, AuditComponent, Timeline, SurveyView, PatientInfo },
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
        audit: {},
        changeDataDialogVisible: false, // 数据变更
        withdrawalAuditDialogVisible: false, // 撤回审核
        recordAuditDialogVisible: false // 审核病例/随访
      }
    },
    created() {
      this.isRegister = this.$hasAnyAuthority([
        'PROJECT_ADMIN_' + this.projectId,
        'PROJECT_PATIENT_' + this.projectId
      ])
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
      stepChange(step) {
        this.findStepDetail(step)
      },
      findStepDetail(step) {
        this.findReport(step.reportId).then((report) => {
          this.report = report
          if (step.type === 'PATIENT') { // 首诊病例
            this.timeline.current = 0 // 设置当前active step
            this.findCase(step.caseId) // 获取病例
            this.follow = null
          } else { // 随访计划
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
            this.survey = new PatientSurvey(this.report, this.patientCase, this.mode())
          })
          this.findAudits('PATIENT_CASE', caseId)
        } else {
          this.patientCase = {}
          this.patientCase.projectId = this.projectId
          this.patientCase.patientId = this.patientId
          this.survey = new PatientSurvey(this.report, this.patientCase, this.mode())
        }
      },
      findFollow(followId, planId) {
        if (followId) {
          getFollow(followId).then(res => {
            this.follow = res.data
            this.follow.projectId = this.projectId
            this.survey = new FollowSurvey(this.report, this.follow, this.mode())
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
          this.survey = new FollowSurvey(this.report, this.follow, this.mode())
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
      save(data, state) {
        if (this.patientCase) {
          this.saveCase(data, state)
        } else if (this.follow) {
          this.saveFollow(data, state)
        }
      },
      saveCase(data, state) {
        this.patientCase = this.survey.complete(data, state)
        if (this.patientCase.id !== undefined) {
          updatePatientCase(this.patientCase).then(() => this.toPatient())
        } else {
          createPatientCase(this.patientCase).then(() => this.toPatient())
        }
      },
      saveFollow(data, state) {
        if (this.follow) {
          this.follow = this.survey.complete(data, state)
          if (this.follow.id !== undefined) {
            updateFollow(this.follow).then(() => this.toPatient())
          } else {
            createFollow(this.follow).then(() => this.toPatient())
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
      },
      toPatient() {
        this.$router.push({
          path: `/project/${this.projectId}/patient`
        })
      },
      recordAudit(type, state) {
        this.audit = {
          projectId: this.projectId,
          recordId: type === 'PATIENT_CASE' ? this.patientCase.id : this.follow.id,
          type,
          state
        }
        this.recordAuditDialogVisible = true
      },
      changeData(type) {
        this.audit = {
          projectId: this.projectId,
          recordId: type === 'PATIENT_CASE' ? this.patientCase.id : this.follow.id,
          type,
          state: 'CHANGE_SUBMIT'
        }
        this.changeDataDialogVisible = true
      },
      withdrawalAudit() {
        this.withdrawalAuditDialogVisible = true
      },
      closeDialog(val) {
        switch (val.page) {
          case 'recordAudit':
            this.recordAuditDialogVisible = false
            break
          case 'changeData':
            this.changeDataDialogVisible = false
            break
          case 'withdrawalAudit':
            this.withdrawalAuditDialogVisible = false
        }
      }
    }
  }
</script>

<style scoped>

</style>
