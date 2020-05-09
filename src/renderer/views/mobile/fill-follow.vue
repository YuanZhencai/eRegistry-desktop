<template>
    <div>填写随访</div>
</template>

<script>
  export default {
    name: 'FillFollow',
    data() {
      return {
        projectId: this.$route.query.projectId,
        patientId: this.$route.query.patientId,
        reportId: this.$route.query.reportId,
        planId: this.$route.query.planId,
        followId: this.$route.query.followId
      }
    },
    created() {
    }
  }
</script>

<style scoped>

</style>
