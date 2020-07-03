<template>
    <div id="surveyCreatorContainer"></div>
</template>

<script>
import uuidv1 from 'uuid/v1'
import * as SurveyKo from 'survey-knockout'
import * as SurveyCreator from 'survey-creator'
import * as widgets from './widgets'
import * as screen from '../screen/screen'
import { SurveyZhCnModel } from './survey-zh-cn.model'

widgets.init(SurveyKo)
const _local = new SurveyZhCnModel().zhcnStrings
SurveyCreator.editorLocalization.locales['zh-cn'] = _local
SurveyCreator.editorLocalization.currentLocale = 'zh-cn'
// 删掉编辑器survey中不需要的属性
SurveyKo.Serializer.removeProperty('survey', 'locale')
SurveyKo.Serializer.removeProperty('survey', 'cookieName')
SurveyKo.Serializer.findProperty('survey', 'mode').showMode = 'edit'
SurveyKo.Serializer.removeProperty('survey', 'calculatedValues')
SurveyKo.Serializer.removeProperty('survey', 'triggers')
SurveyKo.Serializer.removeProperty('survey', 'focusOnFirstError')
SurveyKo.Serializer.removeProperty('survey', 'checkErrorsMode')
SurveyKo.Serializer.removeProperty('survey', 'navigateToUrl')
const showCompletedPageSetter = Object.getOwnPropertyDescriptor(SurveyKo.SurveyModel.prototype, 'showCompletedPage').set
Object.defineProperty(SurveyKo.SurveyModel.prototype, 'showCompletedPage', {
  get: function() {
    return this.getPropertyValue('showCompletedPage', false)
  },
  set: function(value) {
    showCompletedPageSetter.call(this, value)
  },
  enumerable: true,
  configurable: true
})
SurveyKo.JsonObject.metaData.findProperty('survey', 'showCompletedPage').defaultValue = false
SurveyKo.Serializer.removeProperty('survey', 'showCompletedPage')
SurveyKo.Serializer.removeProperty('survey', 'completedHtml')
SurveyKo.Serializer.removeProperty('survey', 'navigateToUrlOnCondition')
SurveyKo.Serializer.removeProperty('survey', 'completedHtmlOnCondition')
SurveyKo.Serializer.removeProperty('survey', 'loadingHtml')
SurveyKo.Serializer.removeProperty('survey', 'completedBeforeHtml')
SurveyKo.Serializer.removeProperty('survey', 'maxTimeToFinish')
SurveyKo.Serializer.removeProperty('survey', 'maxTimeToFinishPage')
SurveyKo.Serializer.removeProperty('survey', 'showTimerPanel')
SurveyKo.Serializer.removeProperty('survey', 'showTimerPanelMode')

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
    return {
      isSpreadShrink: false
    }
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
      this.surveyCreator.surveyLiveTester.simulatorEnabled = false
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
    },
    screen(type) {
      const element = document.getElementById('surveyCreatorContainer')// 设置后就是容器全屏
      this.isSpreadShrink = !this.isSpreadShrink
      screen.screen(element, type)
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
@import "~survey-knockout/survey.css";
@import "~survey-creator/survey-creator.css";
    #surveyCreatorContainer{
        width: 100%;
        height: 100%;
    }
</style>
