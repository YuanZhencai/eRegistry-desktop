<template>
    <div class="survey-container contentcontainer codecontainer" id='surveyElement'>
        <survey :survey='survey'></survey>
    </div>
</template>

<script>
  import { getSurveyInvestigation } from '@/api/questionnaire'
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
      // const surveyJson = {
      //   title: 'Product Feedback Survey Example',
      //   showProgressBar: 'top',
      //   pages: [
      //     {
      //       questions: [
      //         {
      //           type: 'radiogroup',
      //           name: 'price to competitors',
      //           title: 'Compared to our competitors, do you feel the Product is',
      //           choices: [
      //             'Less expensive',
      //             'Priced about the same',
      //             'More expensive',
      //             'Not sure'
      //           ]
      //         },
      //         {
      //           type: 'radiogroup',
      //           name: 'price',
      //           title: 'Do you feel our current price is merited by our product?',
      //           choices: [
      //             'correct|Yes, the price is about right',
      //             'low|No, the price is too low for your product',
      //             'high|No, the price is too high for your product'
      //           ]
      //         }
      //       ]
      //     },
      //     {
      //       questions: [
      //         {
      //           type: 'text',
      //           name: 'email',
      //           title:
      //             "Thank you for taking our survey. Please enter your email address, then press the 'Submit' button."
      //         }
      //       ]
      //     }
      //   ]
      // }
      // var model = new SurveyVue.Model(surveyJson)
      return {
        survey: null,
        json: null
      }
    },
    created() {
      this.getInvestigation()
    },
    methods: {
      getInvestigation() {
        getSurveyInvestigation(this.$route.params.id).then(response => {
          console.log(response.data)
          const jsonModel = JSON.parse(response.data.survey)
          this.survey = new SurveyVue.Model(jsonModel)
          this.survey.locale = 'zh-cn'
          this.survey.onComplete.add(this.complete)
          this.survey.onValueChanged.add(this.valueChanged)
        }).catch(error => {
          console.log(error)
        })
      },
      complete() {},
      valueChanged() {}
    }
  }
</script>

<style scoped>

</style>
