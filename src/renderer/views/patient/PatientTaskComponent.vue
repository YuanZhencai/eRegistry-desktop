<template>
    <div class="patient-task" v-if="survey">
        <report-survey :survey="survey" @completeChange="save"></report-survey>
    </div>
</template>
<script>
  import { getPatientTaskReport, savePatientTask } from '@/api/TaskService'
  import { PatientTaskSurvey } from './patient-task-survey'
  import { PatientTask, Patient, PatientCase } from './patient-model'
  import ReportSurvey from '../report/ReportSurvey'
  export default {
    name: 'PatientTaskComponent',
    components: { ReportSurvey },
    data() {
      const taskId = this.$route.params.taskId
      return {
        taskId,
        cacheKey: 'task_' + taskId,
        task: {},
        report: null,
        survey: null,
        isSaving: false
      }
    },
    created() {
      this.task = JSON.parse(localStorage.getItem(this.cacheKey))
      if (!this.task) {
        this.task = new PatientTask()
        this.task.taskId = this.taskId
        this.task.patient = new Patient()
        this.task.patient.birthday = null
        this.task.cases = new PatientCase()
        this.task.cases.state = 'SAVED'
      }
      localStorage.setItem(this.cacheKey, JSON.stringify(this.task))
      this.findTaskReport()
    },
    methods: {
      findTaskReport() {
        const that = this
        getPatientTaskReport(this.taskId).then(res => {
          that.report = res.data
          that.survey = new PatientTaskSurvey(that.report, that.task, 'share')
        })
      },
      save() {
        this.isSaving = true
        this.task.cases.state = 'SAVED'
        savePatientTask(this.task).then(res => {
          localStorage.removeItem(this.cacheKey)
          this.$emit('patientCaseListModification', 'OK')
          this.isSaving = false
        }, () => {
          this.isSaving = false
        })
      }
    }
  }
</script>

<style scoped>

</style>
