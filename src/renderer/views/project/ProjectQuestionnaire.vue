<template>
	<div>
		<el-row>
			<el-col :span="12">
				<div class="grid-content bg-purple-dark">
					<span style="border: 1px solid #409EFF"></span>
					<span style="margin-left: 5px;">问卷名称</span>
					<el-select v-model="questionnaireId" placeholder="请选择">
						<el-option
								v-for="questionnaire in questionnaires"
								:key="questionnaire.id"
								:label="questionnaire.reportName"
								:value="questionnaire.id">
						</el-option>
					</el-select>
				</div>
			</el-col>
			<el-col :span="12">
				<div style="display: flex;justify-content: flex-end;">
					<el-button type="primary" v-if="$hasAnyAuthority(['PROJECT_ADMIN_' + projectId, 'PROJECT_MASTER_' + projectId, 'PROJECT_PATIENT_' + projectId])" @click="newQuestionnaire">创建问卷</el-button>
					<el-button type="primary" @click="manage">查看问卷</el-button>
				</div>
			</el-col>
		</el-row>
		<el-divider></el-divider>
		<investigation :project-id="projectId"
					   :questionnaire-id="questionnaireId"></investigation>
	</div>
</template>

<script>
	import { getProjectQuestionnaires } from '../../api/QuestionnaireService'
	import Investigation from '../investigation/Investigation'

	export default {
	  name: 'ProjectQuestionnaire',
	  components: { Investigation },
	  data() {
	    return {
	      projectId: this.$route.params.projectId,
	      questionnaires: [],
	      questionnaireId: null
	    }
	  },
	  mounted() {
	    this.getQuestionnaires()
	  },
	  methods: {
	    formatter(row, column) {
	      return row.address
	    },
	    manage() {
	      this.$router.push({
	        path: `/project/${this.projectId}/questionnaire/manage`
	      })
	    },
	    newQuestionnaire() {
	      this.$router.push({
	        path: `/project/${this.projectId}/questionnaire-new`
	      })
	    },
	    getQuestionnaires() {
	      getProjectQuestionnaires(this.projectId).then(response => {
	        this.questionnaires = response.data
	        if (this.questionnaires.length > 0) {
	          this.questionnaireId = this.questionnaires[0].id
	        }
	      })
	    }
	  }
	}
</script>

<style scoped>

</style>
