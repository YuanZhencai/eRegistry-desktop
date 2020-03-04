<template>
  <div id="surveyCreatorContainer"></div>
</template>

<script>
  import * as SurveyCreator from 'survey-creator'
  import 'survey-creator/survey-creator.css'
  import uuidv1 from 'uuid/v1'

  export default {
    name: 'survey-creator',
    props: {
      survey: {
        type: String,
        default: function() {
          return ''
        }
      },
      tools: {
        type: Array,
        default: function() {
          return []
        }
      }
    },
    data() {
      return {}
    },
    mounted() {
      // this.render()
    },
    watch: {
      survey: {
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
        this.surveyCreator.text = this.survey
        this.surveyCreator.saveSurveyFunc = this.saveMySurvey
        this.tools.forEach(tool => {
          this.surveyCreator.toolbarItems.push({
            id: uuidv1(),
            visible: true,
            title: tool.title,
            action: tool.action
          })
        })
      },
      saveMySurvey() {
        this.$emit('surveyChange', this.surveyCreator.text)
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
