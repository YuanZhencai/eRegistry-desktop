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
		<el-row>
			<el-table v-loading="loading" stripe :data='events' @sort-change="changeOrder" style='width: 100%'>
				<el-table-column prop='id' label='事件ID' sortable="custom"></el-table-column>
				<el-table-column prop='title' label='标题' sortable="custom"></el-table-column>
				<el-table-column prop='content' label='告警内容' sortable="custom"></el-table-column>
				<el-table-column prop='submitter' label='填写人'>
					<template slot-scope="scope">
						<span v-if="scope.row.patientName">{{scope.row.patientName}}</span>
						<span v-if="!scope.row.patientName">{{scope.row.submitter}}</span>
					</template>
				</el-table-column>
				<el-table-column prop='date' label='填表时间' sortable="custom">
					<template slot-scope="scope">{{scope.row.date | formatDate('YYYY-MM-DD HH:mm')}}</template>
				</el-table-column>
				<el-table-column prop='handleDesc' label='处理描述' sortable="custom"></el-table-column>
				<el-table-column prop='handleDate' label='处理时间' sortable="custom">
					<template slot-scope="scope">{{scope.row.handleDate | formatDate('YYYY-MM-DD HH:mm')}}</template>
				</el-table-column>
				<el-table-column label="操作">
					<template slot-scope="scope">
						<el-button type="text" @click="view(scope.row)">查看</el-button>
					</template>
				</el-table-column>
			</el-table>
		</el-row>

		<el-row>
			<el-pagination background
						   layout="total, prev, pager, next, jumper"
						   :total="total"
						   :page-size="pageSize"
						   :current-page="currentPage"
						   @current-change="currentChange"
						   class="pagination">
			</el-pagination>
		</el-row>
	</div>
</template>

<script>
	import {
	  getProjectAlertEvents,
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
	      },
	      loading: false,
	      isSaving: false,
	      predicate: '',
	      order: '',
	      events: [],
	      total: 0,
	      pageSize: 10, // 单页数据量
	      currentPage: 1 // 默认开始页面
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
	      console.info('enabledSetting', this.rules)
	    },
	    getSetting() {
	      if (this.questionnaireId) {
	        getQuestionnaireAlertSetting(this.questionnaireId).then(res => {
	          this.setting = res.data
	          this.getEvents()
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
	            })
	          }
	        })
	      } else {
	        saveQuestionnaireAlertSetting(this.setting).then(res => {
	          this.setting = res.data
	        })
	      }
	    },
	    cancel() {
	      this.$router.push({
	        path: `/project/${this.projectId}/questionnaire`
	      })
	    },
	    getEvents() {
	      if (this.projectId && this.setting && this.setting.settingId) {
	        this.loading = true
	        getProjectAlertEvents(this.projectId, {
	          'EQ_alertEvent.settingId': this.setting.settingId,
	          page: this.currentPage - 1,
	          size: this.pageSize,
	          sort: this.sort()
	        }).then((response) => {
	          this.loading = false
	          this.events = response.data
	          this.total = Number(response.headers['x-total-count'])
	        })
	      }
	    },
	    sort() {
	      return (this.predicate && this.order) ? `alertEvent.${this.predicate}` + ',' + (this.order === 'ascending' ? 'asc' : 'desc') : null
	    },
	    changeOrder(sort) {
	      this.predicate = sort.prop
	      this.order = sort.order
	      this.getEvents()
	    },
	    currentChange: function(currentPage) {
	      this.currentPage = currentPage
	      this.getEvents()
	    },
	    view(event) {
	      this.$router.push({
	        path: `/project/${this.projectId}/event/${event.id}`
	      })
	    }
	  }
	}
</script>

<style scoped>

</style>
