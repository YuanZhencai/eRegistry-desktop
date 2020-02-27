<template>
    <div id='surveyElement'>
        <survey :survey='survey'></survey>
    </div>
</template>

<script>
  import { getSurveyInvestigation } from '@/api/QuestionnaireService'
  import * as SurveyVue from 'survey-vue'
  import 'survey-vue/survey.css'
  import 'survey-vue/modern.css'
  SurveyVue.StylesManager.applyTheme('winterstone')
  var Survey = SurveyVue.Survey

  export default {
    name: 'PatientSurvey',
    components: {
      Survey
    },
    data() {
      // var json = {
      //   elements: [
      //     { type: 'text', name: 'customerName', title: 'What is your name?', isRequired: true }
      //   ]
      // }
      // var model = new SurveyVue.Model(json)
      return {
        survey: null,
        jsonModel: null
      }
    },
    mounted() {
      this.getInvestigation()
    },
    methods: {
      getInvestigation() {
        const _this = this
        getSurveyInvestigation(this.$route.params.id).then(response => {
          console.log(response.data)
          _this.jsonModel = JSON.parse(response.data.survey)
          _this.survey = new SurveyVue.Model(_this.jsonModel)
          _this.survey.locale = 'zh-cn'
          _this.survey.css = { matrix: {}, navigationButton: '' }
          _this.survey.onComplete.add(function(result) {
            console.log(result.data)
          })
          _this.survey.onValueChanged.add(function(result) {
            console.log(result.data)
          })
        }).catch(error => {
          console.log(error)
        })
      },
      complete(result) {},
      valueChanged() {}
    }
  }
</script>

<style scoped>

</style>
