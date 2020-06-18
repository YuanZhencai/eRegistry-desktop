<template>
    <div>
        <survey-view :info="survey" @dataChange="save"></survey-view>
    </div>
</template>

<script>
  import { getReport } from '../../api/ReportService'
  import { getFollow } from '../../api/FollowService'
  import { fillFollow } from '../../api/PatientService'
  import { FollowSurvey } from '../patient/follow-survey'

export default {
    name: 'PatientFollow',
    data() {
      return {
        projectId: this.$route.query.projectId,
        patientId: this.$route.query.patientId,
        reportId: this.$route.query.reportId,
        planId: this.$route.query.planId,
        followId: this.$route.query.followId,
        follow: {},
        report: {},
        survey: {}
      }
    },
    created() {
      this.findFollowSurvey()
    },
    methods: {
      findFollowSurvey() {
        const vm = this
        vm.$axios.all([vm.findReport(), vm.findFollow()])
          .then(vm.$axios.spread(function(report, follow) {
            vm.report = report.data
            vm.follow = follow.data
            vm.survey = new FollowSurvey(vm.report, vm.follow)
          }))
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
      findFollow() {
        if (this.followId) {
          return getFollow(this.followId)
        } else {
          return new Promise((resolve, reject) => {
            resolve({
              data: {
                projectId: this.projectId,
                patientId: this.patientId,
                planId: this.planId,
                state: 'SAVED'
              }
            })
          })
        }
      },
      save(data, state) {
        const complete = this.survey.complete(data, state)
        fillFollow(complete).then((res) => {
          this.followId = res.data.id
          this.findFollowSurvey()
        })
      }
    }
  }
</script>

<style scoped>

</style>
