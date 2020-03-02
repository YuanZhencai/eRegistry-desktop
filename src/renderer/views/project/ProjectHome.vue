<template>
    <div class="app-container">project home{{projectId}}</div>
</template>

<script>
  export default {
    name: 'ProjectHome',
    data() {
      const projectId = this.$route.params.projectId
      return {
        projectId
      }
    },
    created() {
    }
  }
</script>

<style scoped>

</style>
