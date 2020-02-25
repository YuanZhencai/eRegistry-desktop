<template>
    <el-card>
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
  import { getQuestionnaireWithReport, saveWithReport } from '@/api/questionnaire'

  // 只读，不能修改
  SurveyKo.JsonObject.metaData.findProperty('survey', 'locale').readOnly = true
  SurveyCreator.editorLocalization.currentLocale = 'zh-cn'
  // You may use any of these: "default", "orange", "darkblue", "darkrose", "stone", "winter", "winterstone"
  SurveyCreator.StylesManager.applyTheme('bootstrap')
  const options = {
    showTestSurveyTab: true,
    showJSONEditorTab: false,
    showEmbededSurveyTab: false,
    generateValidJSON: true
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
      this.surveyCreator.toolbarItems.push({
        id: 'clear-survey',
        visible: true,
        title: 'Clear Survey',
        action: function() {
          // modal.open()
        }
      })
      this.surveyCreator.haveCommercialLicense = true
      this.surveyCreator.onModified.add(this.mySurveyModified)
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
      mySurveyModified() {},
      saveMySurvey() {
        const surveyJson = this.surveyCreator.text
        console.log(surveyJson)
        if (this.questionnaireReport) {
          this.questionnaireReport.report.survey = surveyJson
        } else {
          this.questionnaireReport = {
            questionnaire: { projectId: this.$route.params.projectId },
            report: {
              title: this.surveyCreator.JSON.title,
              survey: this.surveyCreator.text
            }
          }
        }
        saveWithReport(this.questionnaireReport).then(res => {
          const questionnaire = res.data
          this.getSurvey(questionnaire.id)
        })
      }
    }
  }
</script>

<style scoped>

</style>
