<template>
    <div id="form_crf">
      <a-icon v-if="isSpreadShrink" class="full" @click="screen" type="fullscreen"  />
      <a-icon v-else class="full" @click="screen" type="fullscreen-exit" />
      <survey :key="key"
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
      fullscreen: false,
      isSpreadShrink: true
    }
  },
  created() {
  },
  mounted() {
    // 监听键盘按键事件 定义let self = this；否则直接调用methods的方法会报方法undifined的错误；
    const self = this
    this.$nextTick(function() {
      document.addEventListener('keyup', function(e) {
        if (e.keyCode === 27) {
          self.closeScreenFull()
        }
      })
    })
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
    // 按ESC退出全屏操作
    closeScreenFull() {
      if (!this.isSpreadShrink) {
        this.isSpreadShrink = true
      }
    },
    screen() {
      this.isSpreadShrink = !this.isSpreadShrink
      const element = document.getElementById('form_crf')// 设置后就是容器全屏
      if (element.requestFullscreen) {
        element.requestFullscreen()
      } else if (element.webkitRequestFullScreen) {
        element.webkitRequestFullScreen()
      } else if (element.mozRequestFullScreen) {
        element.mozRequestFullScreen()
      } else if (element.msRequestFullscreen) {
        element.msRequestFullscreen()
      }
      if (document.exitFullscreen) {
        document.exitFullscreen()
      } else if (document.webkitCancelFullScreen) {
        document.webkitCancelFullScreen()
      } else if (document.mozCancelFullScreen) {
        document.mozCancelFullScreen()
      } else if (document.msExitFullscreen) {
        document.msExitFullscreen()
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
#form_crf {
  position: relative;
  overflow: auto;
  height: 100%;
  width: 100%;
}
.full {
  font-size: 24px;
  position: absolute;
  right: 15px;
  top: 22px;
  z-index: 9;
}
</style>
