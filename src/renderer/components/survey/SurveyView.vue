<template>
  <div>
    <survey :key="key" v-if="survey" :survey="survey"></survey>
  </div>
</template>

<script>
  import * as SurveyVue from 'survey-vue'
  import * as widgets from './widgets'
  import 'survey-vue/survey.css'
  import 'survey-vue/modern.css'

  const Survey = SurveyVue.Survey
  SurveyVue.StylesManager.applyTheme('winterstone')

  widgets.init(SurveyVue)

  export default {
    name: 'survey-view',
    components: {
      Survey
    },
    props: {
      info: {
        type: Object,
        default: function() {
          return {
            survey: {
              locale: 'zh-cn',
              pages: []
            },
            data: {},
            mode: 'edit'
          }
        }
      }
    },
    data() {
      return {
        survey: null,
        key: null
      }
    },
    created() {
    },
    mounted() {
    },
    watch: {
      info: {
        deep: true,
        handler(newValue, oldValue) {
          this.key = Math.round(Math.random() * 1000)
          this.render()
        }
      }
    },
    methods: {
      save(survey, options) {
        this.$emit('dataChange', survey.data, 'SAVED')
      },
      addSaveButton(survey, options) {
        const element = options.htmlElement
        if (element) {
          const footer = element.querySelector('.sv_nav')
          if (footer) {
            let saveButton = footer.querySelector('#save-button')
            if (saveButton) {
              saveButton.remove()
            }
            if (survey.mode === 'edit') {
              saveButton = document.createElement('input')
              saveButton.setAttribute('id', 'save-button')
              saveButton.setAttribute('type', 'button')
              saveButton.setAttribute('value', '保存问卷')
              saveButton.onclick = () => {
                this.save(survey, options)
              }
              footer.appendChild(saveButton)
            }
          }
        }
      },
      render() {
        this.survey = null
        const surveyModel = new SurveyVue.Model(this.info.survey)
        surveyModel.locale = 'zh-cn'
        surveyModel.onComplete.add(this.complete)
        surveyModel.onValueChanged.add(this.onValueChanged)
        if (this.info.mode === 'share') {
          surveyModel.mode = 'edit'
        } else {
          surveyModel.mode = this.info.mode
          surveyModel.onAfterRenderSurvey.add(this.addSaveButton)
        }
        surveyModel.data = this.info.data
        this.survey = surveyModel
      },
      complete(survey) {
        this.$emit('dataChange', survey.data, 'SUBMITTED')
      },
      onValueChanged(survey, options) {
        this.$emit('valueChange', survey.data)
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
