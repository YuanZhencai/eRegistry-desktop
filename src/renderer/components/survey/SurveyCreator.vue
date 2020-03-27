<template>
    <div id="surveyCreatorContainer"></div>
</template>

<script>
import uuidv1 from 'uuid/v1'
import * as SurveyKo from 'survey-knockout'
import * as SurveyCreator from 'survey-creator'
import * as widgets from './widgets'
import 'survey-creator/survey-creator.css'

widgets.init(SurveyKo)

SurveyCreator.editorLocalization.currentLocale = 'zh-cn'
// 删掉编辑器survey中不需要的属性
SurveyKo.JsonObject.metaData.removeProperty('survey', 'locale')
SurveyKo.JsonObject.metaData.removeProperty('survey', 'cookieName')
SurveyKo.JsonObject.metaData.removeProperty('survey', 'mode')
SurveyKo.JsonObject.metaData.removeProperty('survey', 'calculatedValues')
SurveyKo.JsonObject.metaData.removeProperty('survey', 'triggers')
SurveyKo.JsonObject.metaData.removeProperty('survey', 'focusOnFirstError')
SurveyKo.JsonObject.metaData.removeProperty('survey', 'checkErrorsMode')
SurveyKo.JsonObject.metaData.removeProperty('survey', 'navigateToUrl')
SurveyKo.JsonObject.metaData.removeProperty('survey', 'showCompletedPage')
SurveyKo.JsonObject.metaData.removeProperty('survey', 'completedHtml')
SurveyKo.JsonObject.metaData.removeProperty('survey', 'navigateToUrlOnCondition')
SurveyKo.JsonObject.metaData.removeProperty('survey', 'completedHtmlOnCondition')
SurveyKo.JsonObject.metaData.removeProperty('survey', 'loadingHtml')
SurveyKo.JsonObject.metaData.removeProperty('survey', 'completedBeforeHtml')
SurveyKo.JsonObject.metaData.removeProperty('survey', 'maxTimeToFinish')
SurveyKo.JsonObject.metaData.removeProperty('survey', 'maxTimeToFinishPage')
SurveyKo.JsonObject.metaData.removeProperty('survey', 'showTimerPanel')
SurveyKo.JsonObject.metaData.removeProperty('survey', 'showTimerPanelMode')

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
    },
    jsonTab: {
      type: Boolean,
      default: function() {
        return false
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
        showEmbededSurveyTab: false,
        generateValidJSON: true,
        showJSONEditorTab: this.jsonTab
      }
      this.surveyCreator = new SurveyCreator.SurveyCreator('surveyCreatorContainer', options)
      this.surveyCreator.showToolbox = 'right'
      this.surveyCreator.showPropertyGrid = 'none'
      this.surveyCreator.haveCommercialLicense = true
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
