<template>
    <div id='surveyElement'>
      <div>进行调查</div>
      <survey-view></survey-view>
    </div>
</template>

<script>
  import SurveyCreator from '@/components/survey/SurveyCreator'
  import SurveyView from '@/components/survey/SurveyView'

  export default {
    name: 'PatientSurvey',
    components: {
      SurveyCreator,
      SurveyView
    },
    data() {
      return {}
    },
    mounted() {
    },
    methods: {
    }
  }
</script>

<style scoped>

</style>
