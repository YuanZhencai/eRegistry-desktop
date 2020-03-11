import {isString} from "util";import {isObject} from "util";
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
      this.render()
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
        const text = this.surveyCreator.text
        this.$emit('surveyChange', text, this.getTitle(text))
      },
      getTitle(text) {
        let title = null
        const survey = JSON.parse(text)
        if (survey.title) {
          if (typeof survey.title === 'string') {
            title = survey.title
          } else if (typeof survey.title === 'object') {
            if (survey.locale) {
              if (survey.title.hasOwnProperty(survey.locale)) {
                title = survey.title[survey.locale]
              } else {
                title = survey.title['default']
              }
            } else {
              title = survey.title['default']
            }
          }
        }
        return title || '未命名表单'
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
