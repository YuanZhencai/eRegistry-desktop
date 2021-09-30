<template>
	<div>
		<el-row>
			<el-col :span="12">
				<el-form ref="form" v-if="alertEvent" :model="alertEvent" :rules="rules" label-width="80px">
					<el-form-item label="标题">
						<span :class="alertEvent.type">{{alertEvent.title}}</span>
					</el-form-item>
					<el-form-item label="问题">
						<span>{{alertEvent.question}}</span>
					</el-form-item>
					<el-form-item label="告警内容">
						<span :class="alertEvent.type">{{alertEvent.content}}</span>
					</el-form-item>
					<el-form-item label="填写人">
						<el-button type="text" v-if="alertEvent.patientName" @click="viewPatient">
							{{alertEvent.patientName}}
						</el-button>
						<span v-if="!alertEvent.patientName">{{alertEvent.submitter}}</span>
					</el-form-item>
					<el-form-item label="填写内容">
						<el-button type="text" @click="viewInvestigation">详情</el-button>
					</el-form-item>
					<el-form-item label="填表时间">
						<span>{{alertEvent.date | formatDate('YYYY-MM-DD HH:mm')}}</span>
					</el-form-item>
					<el-form-item label="处理描述">
            <el-radio-group v-model="alertEvent.handleType">
              <el-radio label="无处理"></el-radio>
              <el-radio label="一般处理(注意膳食、运动、心情调节)"></el-radio>
              <el-radio label="医疗处理(门诊、住院)"></el-radio>
            </el-radio-group>
					</el-form-item>
          <el-form-item label="备注" prop="handleDesc">
              <el-input type="textarea" :autosize="{ minRows: 10}" v-model="alertEvent.handleDesc"></el-input>
          </el-form-item>
					<el-form-item label="处理时间" v-if="alertEvent.handleDate">
						<span>{{alertEvent.handleDate | formatDate('YYYY-MM-DD HH:mm')}}</span>
					</el-form-item>
					<el-form-item>
						<el-button type="primary" @click="handle('form')">处理</el-button>
						<el-button @click="cancel">取消</el-button>
					</el-form-item>
				</el-form>
			</el-col>
		</el-row>
	</div>
</template>

<script>
	import { getAlertEvent, handleAlertEvent } from '../../api/AlertService'
	import { getInvestigation } from '../../api/InvestigationService'

	export default {
	  name: 'AlertEvent',
	  data() {
	    const projectId = this.$route.params.projectId
	    const eventId = this.$route.params.eventId
	    return {
	      projectId: projectId,
	      eventId: eventId,
	      alertEvent: null,
	      rules: {
	        handleDesc: [
	          { max: 500, message: '不能超过 500 个字符', trigger: 'blur' }
	        ]
	      }
	    }
	  },
	  mounted() {
	    this.getEvent()
	  },
	  methods: {
	    getEvent() {
	      getAlertEvent(this.eventId).then(res => {
	        this.alertEvent = res.data
	      })
	    },
	    cancel() {
	      this.$router.push({
	        path: `/project/${this.projectId}/event`
	      })
	    },
	    handle(formName) {
	      this.$refs[formName].validate((valid) => {
	        if (valid) {
	          handleAlertEvent({
	            eventId: this.alertEvent.id,
	            desc: this.alertEvent.handleDesc,
	            type: this.alertEvent.handleType
	          }).then(res => {
	            this.cancel()
	            this.setting = res.data
	          })
	        }
	      })
	    },
	    viewPatient() {
	      if (this.alertEvent.patientId) {
	        this.$router.push({
	          path: `/project/${this.alertEvent.projectId}/patient/${this.alertEvent.patientId}`
	        })
	      }
	    },
	    viewInvestigation() {
	      if (this.alertEvent.investigationId) {
	        getInvestigation(this.alertEvent.investigationId).then(res => {
	          const investigation = res.data
	          if (investigation) {
	            this.$router.push({
	              path: `/project/${this.projectId}/questionnaire/${investigation.questionnaireId}/investigation/${investigation.id}`
	            })
	          }
	        })
	      }
	    }
	  }
	}
</script>

<style scoped>
</style>
