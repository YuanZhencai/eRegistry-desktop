<template>
  <div>
    <survey :survey="survey"></survey>
  </div>
</template>

<script>
  import * as SurveyVue from 'survey-vue'

  const Survey = SurveyVue.Survey
  Survey.cssType = 'bootstrap'

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
        survey: new SurveyVue.Model(this.info.survey)
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
          this.render()
        }
      }
    },
    methods: {
      render() {
        const surveyModel = new SurveyVue.Model(this.info.survey)
        surveyModel.locale = 'zh-cn'
        surveyModel.data = this.info.data
        surveyModel.onComplete.add(this.complete)
        surveyModel.onValueChanged.add(this.onValueChanged)
        this.survey = surveyModel
      },
      complete(survey) {
        this.$emit('dataChange', survey.data)
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
