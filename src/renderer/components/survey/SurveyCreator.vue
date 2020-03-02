<template>
  <div id="surveyCreatorContainer"></div>
</template>

<script>
import * as SurveyCreator from 'survey-creator'
import 'survey-creator/survey-creator.css'
export default {
  name: 'survey-creator',
  data() {
    return {}
  },
  mounted() {
    const options = { showEmbededSurveyTab: true }
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

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
