<template>
    <el-card>
        <div slot="header">
            <span>调查问卷</span>
        </div>
        <div class="card-content">
            <div id="surveyCreatorContainer"></div>
        </div>
    </el-card>
</template>

<script>
  import * as SurveyCreator from 'survey-creator'
  import 'survey-creator/survey-creator.css'

  export default {
    name: 'QuestionnaireDetail',
    data() {
      return {}
    },
    mounted() {
      const options = {
        showTestSurveyTab: true,
        showJSONEditorTab: false,
        showEmbededSurveyTab: true
      }
      this.surveyCreator = new SurveyCreator.SurveyCreator(
        'surveyCreatorContainer',
        options
      )
      this.surveyCreator.saveSurveyFunc = function() {
        console.log(JSON.stringify(this.text))
      }
    }
  }
</script>

<style scoped>

</style>
