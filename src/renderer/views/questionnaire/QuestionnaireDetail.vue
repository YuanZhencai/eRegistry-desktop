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

  export default {
    name: 'QuestionnaireDetail',
    data() {
      return {
        questionnaireReport: null
      }
    },
    created() {
      if (this.$route.params.id) {
        getQuestionnaireWithReport(this.$route.params.id).then(response => {
          Object.assign({}, this.questionnaireReport, response.data)
        }).catch(error => {
          console.log(error)
        })
      } else {
        this.$set(this.questionnaireReport, 'questionnaire', { projectId: this.$route.params.projectId })
        this.$set(this.questionnaireReport, 'report', {})
      }
    },
    mounted() {
      SurveyCreator.editorLocalization.currentLocale = 'zh-cn'
      // You may use any of these: "default", "orange", "darkblue", "darkrose", "stone", "winter", "winterstone"
      SurveyCreator.StylesManager.applyTheme('bootstrap')
      const options = {
        showTestSurveyTab: true,
        showJSONEditorTab: false,
        showEmbededSurveyTab: false,
        generateValidJSON: true
      }
      this.surveyCreator = new SurveyCreator.SurveyCreator(
        'surveyCreatorContainer',
        options
      )
      this.surveyCreator.showToolbox = 'left'
      this.surveyCreator.showPropertyGrid = 'left'
      this.surveyCreator.leftContainerActiveItem('toolbox')
      this.surveyCreator.onModified.add(this.mySurveyModified)
      this.surveyCreator.saveSurveyFunc = this.saveMySurvey
      // this.surveyCreator.text = JSON.stringify(this.questionnaireReport.report.survey || {})
      // this.surveyCreator.text = "{ pages: [{ name:\'page1\', questions: [{ type: \'text\', name:\"q1\"}]}]}"
    },
    watch: {
      questionnaireReport: {
        handler(newVal, oldVal) {
          this.$set(this.surveyCreator, 'text', JSON.stringify(this.questionnaireReport.report.survey || {}))
          // this.surveyCreator.text = JSON.stringify(this.questionnaireReport.report.survey || {})
        }
      }
    },
    methods: {
      initEditor() {
      },
      mySurveyModified() {},
      saveMySurvey() {
        const surveyJson = this.surveyCreator.text
        saveWithReport(surveyJson)
        console.log(surveyJson)
      }
    }
  }
</script>

<style scoped>

</style>
