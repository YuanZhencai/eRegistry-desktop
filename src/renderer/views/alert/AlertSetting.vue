<template>

	<div>
		<el-row>
			<el-col :span="12">
				<el-form ref="form" :model="setting" :rules="rules" label-width="80px">
					<el-form-item label="告警设置">
						<el-switch
								v-model="setting.enabled"
								@change="enabledSetting"
								active-text="开启"
								inactive-text="关闭">
						</el-switch>
					</el-form-item>
					<el-form-item label="告警标题" prop="title">
						<el-input v-model="setting.title" :validate-event="setting.enable"></el-input>
					</el-form-item>
					<el-form-item label="告警规则" prop="expression">
						<el-input type="textarea"
								  :autosize="{ minRows: 10, maxRows: 10}"
								  v-model="setting.expression">
						</el-input>
					</el-form-item>
					<el-form-item label="告警通知">
						<el-checkbox label="邮件" v-model="setting.email" :validate-event="setting.enable"></el-checkbox>
					</el-form-item>

					<el-form-item>
						<el-button type="primary" @click="save('form')">保存</el-button>
						<el-button @click="cancel">返回</el-button>
					</el-form-item>
				</el-form>
			</el-col>
		</el-row>
	</div>
</template>

<script>
	import {
	  getQuestionnaireAlertSetting,
	  saveQuestionnaireAlertSetting
	} from '../../api/AlertService'

	export default {
	  name: 'AlertSetting',
	  data() {
	    const projectId = this.$route.params.projectId
	    const questionnaireId = this.$route.params.questionnaireId
	    return {
	      projectId: projectId,
	      questionnaireId: questionnaireId,
	      enable: false,
	      email: false,
	      rules: null,
	      setting: {
	        enabled: false,
	        title: null,
	        expression: null,
	        email: null
	      }
	    }
	  },
	  mounted() {
	    this.getSetting()
	  },
	  methods: {
	    enabledSetting(enabled) {
	      if (enabled) {
	        this.rules = {
	          title: [
	            { required: true, message: '请输入标题', trigger: 'change' },
	            { max: 100, message: '不能超过 100 个字符', trigger: 'blur' }
	          ],
	          expression: [
	            { required: true, message: '请输入规则', trigger: 'change' }
	          ]
	        }
	      } else {
	        this.rules = {}
	      }
	      this.$nextTick(() => {
	        this.$refs['form'].clearValidate() // 只清除清除验证
	      })
	    },
	    getSetting() {
	      if (this.questionnaireId) {
	        getQuestionnaireAlertSetting(this.questionnaireId).then(res => {
	          this.setting = res.data
	        })
	      }
	    },
	    save(formName) {
	      this.setting.projectId = this.projectId
	      this.setting.questionnaireId = this.questionnaireId
	      if (this.setting.enabled) {
	        this.$refs[formName].validate((valid) => {
	          if (valid) {
	            saveQuestionnaireAlertSetting(this.setting).then(res => {
	              this.setting = res.data
	              this.cancel()
	            })
	          }
	        })
	      } else {
	        saveQuestionnaireAlertSetting(this.setting).then(res => {
	          this.setting = res.data
	          this.cancel()
	        })
	      }
	    },
	    cancel() {
	      this.$router.push({
	        path: `/project/${this.projectId}/questionnaire/manage`
	      })
	    }
	  }
	}
</script>

<style scoped>

</style>
