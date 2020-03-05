<template>
  <div class="app-container">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>病例表单</span>
      </div>
      <survey-creator :info="creatorInfo" @surveyChange="save"></survey-creator>
    </el-card>
  </div>
</template>

<script>
  import SurveyCreator from '@/components/survey/SurveyCreator'

  export default {
    name: 'ProjectReport',
    components: {
      SurveyCreator
    },
    data() {
      return {
        creatorInfo: {},
        projectId: this.$route.params.projectId
      }
    },
    methods: {
      save(survey) {
        console.info(survey)
      }
    }
  }
</script>

<style scoped>
</style>
