<template>
  <div id="form_crf">
    <survey :key="key"
            v-if="survey"
            :survey="survey"></survey>
  </div>
</template>

<script>
import * as SurveyVue from 'survey-vue'
import * as widgets from './widgets'
import * as screen from '../screen/screen'

const Survey = SurveyVue.Survey
SurveyVue.StylesManager.applyTheme('winterstone')
SurveyVue.surveyLocalization.locales['zh-cn'] = {
  pagePrevText: '上一页',
  pageNextText: '下一页',
  completeText: '提交',
  startSurveyText: '开始',
  otherItemText: '填写其他问题',
  noneItemText: '无',
  selectAllItemText: '选择全部',
  progressText: '第 {0} 页, 共 {1} 页',
  questionsProgressText: '第 {0}/{1} 题',
  emptySurvey: '问卷中没有问题或页面',
  completingSurveyBefore: '你已完成问卷.',
  completingSurvey: '感谢您的参与!',
  loadingSurvey: '问卷正在加载中...',
  optionsCaption: '请选择...',
  value: '值',
  requiredError: '请填写此问题',
  requiredErrorInPanel: '至少回答一题.',
  requiredInAllRowsError: '请填写所有行中问题',
  numericError: '答案必须是个数字',
  textMinLength: '答案长度至少 {0} 个字符',
  textMaxLength: '答案长度不能超过 {0} 个字符',
  textMinMaxLength: '答案长度必须在 {0} - {1} 个字符之间',
  minRowCountError: '最少需要填写 {0} 行答案',
  minSelectError: '最少需要选择 {0} 项答案',
  maxSelectError: '最多只能选择 {0} 项答案',
  numericMinMax: "答案 '{0}' 必须大于等于 {1} 且小于等于 {2}",
  numericMin: "答案 '{0}' 必须大于等于 {1}",
  numericMax: "答案 '{0}' 必须小于等于 {1}",
  invalidEmail: '请输入有效的 Email 地址',
  invalidExpression: '公式: {0} 无效.',
  urlRequestError: "载入选项时发生错误 '{0}': {1}",
  urlGetChoicesError: '未能载入有效的选项或请求参数路径有误',
  exceedMaxSize: '文件大小不能超过 {0}',
  otherRequiredError: '请完成其他问题',
  uploadingFile: '文件上传中... 请耐心等待几秒后重试',
  loadingFile: '加载...',
  chooseFile: '选择文件...',
  noFileChosen: '未选择文件',
  confirmDelete: '删除记录?',
  keyDuplicationError: '主键不能重复',
  addColumn: '添加列',
  addRow: '添加行',
  removeRow: '删除',
  addPanel: '新增',
  removePanel: '删除',
  choices_Item: '选项',
  matrix_column: '列',
  matrix_row: '行',
  savingData: '正在将结果保存到服务器...',
  savingDataError: '在保存结果过程中发生了错误，结果未能保存',
  savingDataSuccess: '结果保存成功!',
  saveAgainButton: '请重试',
  timerMin: '分',
  timerSec: '秒',
  timerSpentAll: '本页用时 {0} 总计用时{1} .',
  timerSpentPage: '本页用时{0} .',
  timerSpentSurvey: '总计用时 {0} .',
  timerLimitAll: '本页用时 {0} 共 {1}， 总计用时 {2} 共 {3} .',
  timerLimitPage: '本页用时 {0} 共 {1} .',
  timerLimitSurvey: '总计用时 {0} 共 {1}.',
  cleanCaption: '清理',
  clearCaption: '清除',
  removeFileCaption: '移除文件'
}

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
    },
    fullScreenSetting: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      survey: null,
      key: null,
      isSpreadShrink: false
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
            saveButton.setAttribute('value', '保存')
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
      screen.screen(element, this.isSpreadShrink)
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
