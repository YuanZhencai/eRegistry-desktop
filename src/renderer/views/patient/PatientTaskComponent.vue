<template>
    <div class="patient-task">
        <survey-view :info="survey" @dataChange="save"></survey-view>
    </div>
</template>
<script>
  import { getPatientTaskReport, savePatientTask } from '@/api/TaskService'
  import { PatientTaskSurvey } from './patient-task-survey'
  import { PatientTask, Patient, PatientCase } from './patient-model'
  import SurveyView from '../../components/survey/SurveyView'

  export default {
    name: 'PatientTaskComponent',
    components: { SurveyView },
    data() {
      const taskId = this.$route.params.taskId
      return {
        taskId,
        task: {},
        report: null,
        survey: null,
        isSaving: false
      }
    },
    created() {
      this.task = new PatientTask()
      this.task.taskId = this.taskId
      this.task.patient = new Patient()
      this.task.patient.birthday = null
      this.task.cases = new PatientCase()
      this.task.cases.state = 'SAVED'
      this.findTaskReport()
    },
    methods: {
      findTaskReport() {
        getPatientTaskReport(this.taskId).then(res => {
          this.report = res.data
          this.survey = new PatientTaskSurvey(this.report, this.task, 'share')
        })
      },
      save(data, state) {
        this.isSaving = true
        this.task = this.survey.complete(data, state)
        savePatientTask(this.task).then(res => {
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
