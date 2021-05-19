<template>
	<investigation :project-id="projectId" :questionnaire-id="questionnaireId" :type="'questionnaire'"></investigation>
</template>

<script>
	import Investigation from '../investigation/Investigation'

	export default {
	  name: 'ProjectInvestigation',
	  components: { Investigation },
	  data() {
	    return {
	      projectId: this.$route.params.projectId,
	      questionnaireId: this.$route.params.questionnaireId
	    }
	  },
	  mounted() {
	  },
	  methods: {}
	}
</script>

<style scoped>
	.line {
		text-align: center;
	}
</style>
