<template>
    <el-card style="width: 100%">
        <div slot="header">
            <span>调查问卷</span>
        </div>
        <div class="card-content">
            <div id="surveyCreatorContainer"></div>
        </div>
    </el-card>
</template>

<script>
  import * as SurveyCreator from 'survey-creator'
  import 'survey-creator/survey-creator.css'
  import * as SurveyKo from 'survey-knockout'
  import { getQuestionnaireWithReport, saveWithReport } from '@/api/QuestionnaireService'

  // 只读，不能修改
  SurveyKo.JsonObject.metaData.findProperty('survey', 'locale').readOnly = true
  SurveyCreator.editorLocalization.currentLocale = 'zh-cn'
  // You may use any of these: "default", "bootstrap", "orange", "darkblue", "darkrose", "stone", "winter", "winterstone"
  SurveyCreator.StylesManager.applyTheme('bootstrap')
  const options = {
    showTestSurveyTab: true,
    showJSONEditorTab: false,
    showEmbededSurveyTab: false,
    generateValidJSON: true,
    showInvisibleElementsInTestSurveyTab: false,
    showPagesInTestSurveyTab: true
  }

  export default {
    name: 'QuestionnaireDetail',
    data() {
      return {
        questionnaireReport: null,
        surveyCreator: null
      }
    },
    mounted() {
      this.surveyCreator = new SurveyCreator.SurveyCreator(
        'surveyCreatorContainer',
        options
      )
      this.surveyCreator.showToolbox = 'left'
      this.surveyCreator.showPropertyGrid = 'left'
      this.surveyCreator.leftContainerActiveItem('toolbox')
      this.surveyCreator.haveCommercialLicense = true
      this.surveyCreator.saveSurveyFunc = this.saveMySurvey
      if (this.$route.params.id) {
        this.getSurvey(this.$route.params.id)
      }
    },
    methods: {
      initEditor() {
      },
      getSurvey(questionnaireId) {
        const _this = this
        getQuestionnaireWithReport(questionnaireId).then((response) => {
          _this.questionnaireReport = response.data
          if (_this.questionnaireReport.report && _this.questionnaireReport.report.survey) {
            this.$set(_this.surveyCreator, 'text', _this.questionnaireReport.report.survey)
          }
        }).catch((error) => {
          console.log(error)
        })
      },
      saveMySurvey() {
        const surveyText = this.surveyCreator.text
        console.log(surveyText)
        let isUpdate = false
        if (this.questionnaireReport) {
          this.questionnaireReport.report.survey = surveyText
          isUpdate = true
        } else {
          this.questionnaireReport = {
            questionnaire: { projectId: this.$route.params.projectId },
            report: {
              title: this.surveyCreator.JSON.title || '未命名表单',
              survey: this.surveyCreator.text
            }
          }
          isUpdate = false
        }
        saveWithReport(this.questionnaireReport).then(res => {
          const questionnaire = res.data
          this.getSurvey(questionnaire.id)
          if (isUpdate) {
            this.openMessage('问卷更新成功', 'success')
          } else {
            this.openMessage('问卷创建成功', 'success')
          }
        })
      },
      openMessage(message, type) {
        this.$message({
          message,
          type
        })
      }
    }
  }
</script>

<style scoped>

</style>
