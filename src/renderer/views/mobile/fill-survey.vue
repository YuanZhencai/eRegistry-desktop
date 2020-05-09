<template>

    <div>填写表单</div>
</template>

<script>
  export default {
    name: 'FillSurvey',
    data() {
      return {
        projectId: this.$route.query.projectId,
        reportId: this.$route.query.reportId,
        planId: this.$route.query.planId,
        caseId: this.$route.query.caseId,
        followId: this.$route.query.followId
      }
    }
  }
</script>

<style scoped>

</style>
