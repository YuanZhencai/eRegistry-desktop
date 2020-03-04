<template>
  <div id="surveyCreatorContainer"></div>
</template>

<script>
  import * as SurveyCreator from 'survey-creator'
  import 'survey-creator/survey-creator.css'

  export default {
    name: 'survey-creator',
    props: {
      info: {
        type: Object,
        default: function() {
          return {
            survey: {
              locale: 'zh-cn',
              pages: []
            },
            tools: []
          }
        }
      }
    },
    data() {
      return {}
    },
    mounted() {
      this.render()
    },
    watch: {
      info: {
        deep: true,
        handler(newValue, oldValue) {
          this.render()
        }
      }
    },
    methods: {
      render() {
        const options = {
          showEmbededSurveyTab: true
        }
        this.surveyCreator = new SurveyCreator.SurveyCreator('surveyCreatorContainer', options)
        this.surveyCreator.text = JSON.stringify(this.info.survey || {})
        this.surveyCreator.saveSurveyFunc = this.saveMySurvey
      },
      saveMySurvey() {
        this.$emit('surveyChange', JSON.parse(this.surveyCreator.text))
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
