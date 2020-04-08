<template>
  <div class="content">
    <i class="fa fa-arrows-alt fa-2x full"
       aria-hidden="true"
       @click="screen">+++dasdas</i>
    <survey id='con_lf_top_div'
            :key="key"
            v-if="survey"
            :survey="survey"></survey>
  </div>
</template>

<script>
import * as SurveyVue from 'survey-vue'
import * as widgets from './widgets'

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
      key: null,
      fullscreen: false
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
    },
    screen() {
      // const element = document.documentElement// 设置后就是我们平时的整个页面全屏效果
      const element = document.getElementById('con_lf_top_div')// 设置后就是   id==con_lf_top_div 的容器全屏
      if (this.fullscreen) {
        if (document.exitFullscreen) {
          document.exitFullscreen()
        } else if (document.webkitCancelFullScreen) {
          document.webkitCancelFullScreen()
        } else if (document.mozCancelFullScreen) {
          document.mozCancelFullScreen()
        } else if (document.msExitFullscreen) {
          document.msExitFullscreen()
        }
      } else {
        if (element.requestFullscreen) {
          element.requestFullscreen()
        } else if (element.webkitRequestFullScreen) {
          element.webkitRequestFullScreen()
        } else if (element.mozRequestFullScreen) {
          element.mozRequestFullScreen()
        } else if (element.msRequestFullscreen) {
          // IE11
          element.msRequestFullscreen()
        }
      }
      this.fullscreen = !this.fullscreen
    }

  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
@import "~survey-vue/survey.css";
@import "~survey-vue/modern.css";
.content {
  position: relative;
}
.full {
  position: absolute;
  right: 35px;
  top: 20px;
  z-index: 10;
}
#con_lf_top_div {
  overflow: auto;
}
</style>
