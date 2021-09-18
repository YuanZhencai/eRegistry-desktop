<template>
	<div class="app-container" style="padding-top: 0px">
		<div style="text-align: center">
			<h2>入组确认</h2>
		</div>
		<el-form v-if="patient" label-width="75px" size="mini" :model="patient" :rules="rules" ref="patientForm">
			<el-form-item label="项目名称">
				<el-input v-model="project.name" :disabled="true"></el-input>
			</el-form-item>
			<el-form-item label="姓名" prop="name">
				<el-input v-model="patient.name"></el-input>
			</el-form-item>
			<el-form-item label="性别">
				<el-radio-group v-model="patient.sex">
					<el-radio label="男"></el-radio>
					<el-radio label="女"></el-radio>
				</el-radio-group>
			</el-form-item>
			<el-form-item label="出生日期">
				<el-date-picker type="date" placeholder="请填写出生日期" v-model="patient.birthday"
								style="width: 100%;"></el-date-picker>
			</el-form-item>
			<el-form-item label="就诊日期">
				<el-date-picker type="date" placeholder="请填写就诊日期" v-model="patient.visitDate"
								style="width: 100%;"></el-date-picker>
			</el-form-item>
			<el-form-item label="电话" prop="telephone">
				<el-input v-model="patient.telephone" placeholder="请填写手机号码"></el-input>
			</el-form-item>
			<el-form-item label="备用电话">
				<el-input v-model="patient.reserveTelephone"></el-input>
			</el-form-item>
			<el-form-item label="地区">
				<el-cascader
						v-model="provinceCity"
						:options="options" :props="{value: 'label'}"
						@change="handleChange" style="width: 100%"></el-cascader>
			</el-form-item>
			<el-form-item label="地址">
				<el-input v-model="patient.address"></el-input>
			</el-form-item>
			<el-form-item>
				<el-checkbox v-if="agreement && agreement.content" v-model="checked">
          <el-button type="text" @click="dialogVisible = true">知情同意书</el-button>
				</el-checkbox>
			</el-form-item>
			<el-form-item>
				<el-button type="primary" v-if="!agreement" @click="incorporationPatient('patientForm')">确定</el-button>
				<el-button type="primary" v-if="agreement" :disabled="!checked" @click="incorporationPatient('patientForm')">确定</el-button>
			</el-form-item>
		</el-form>
    <el-dialog
      v-if="agreement && agreement.content"
      :visible.sync="dialogVisible"
      width="80%"
      class="dialogPadding"
      :before-close="handleClose">
      <div class="editor-content agreement-content" v-html="agreement.content" />
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialogVisible = false">确 认</el-button>
      </span>
    </el-dialog>
	</div>
</template>
<script>
	import { getIncorporationPatient, incorporationPatient } from '../../api/IncorporationService'
	import { getProject } from '@/api/ProjectService'
	import { getAgreement } from '../../api/AgreementService'
	import wx from 'weixin-js-sdk'

	const codes = require('../patient/pca-code.json')

	export default {
	  name: 'PatientIncorporation',
	  data() {
	    return {
	      projectId: this.$route.query.projectId,
	      chargedBy: this.$route.query.chargedBy,
	      patientId: null,
	      rules: {
	        name: [
	          { required: true, message: '请输入患者姓名', trigger: 'change' }
	        ],
	        telephone: [
	          { required: true, message: '请输入手机号', trigger: 'change' },
	          { pattern: /^(1(3|4|5|6|7|8|9)\d{9})$/, message: '手机号码有误，请重填', trigger: 'change' }
	        ]
	      },
	      patient: null,
	      provinceCity: [],
	      options: [],
	      isSaving: false,
	      project: {
	        name: null
	      },
	      agreement: null,
	      checked: true,
	      dialogVisible: true
	    }
	  },
	  mounted() {
	    this.options = JSON.parse(JSON.stringify(codes))
	    this.getIncorporationPatient()
	    this.getProject()
	    this.getAgreement()
	  },
	  methods: {
    getAgreement() {
	      getAgreement(this.projectId).then((res) => {
	        this.agreement = res.data
	      })
	    },
	    handleClose(done) {
	      done()
	    },
	    getProject() {
	      getProject(this.projectId).then(res => {
	        this.project = res.data
	        this.endDate = this.project.endDate
	      })
	    },
	    getIncorporationPatient() {
	      getIncorporationPatient(this.projectId).then(res => {
	        this.patient = res.data
	        const cityList = []
	        if (this.patient.province) {
	          cityList.push(this.patient.province)
	        }
	        if (this.patient.city) {
	          cityList.push(this.patient.city)
	        }
	        if (this.patient.area) {
	          cityList.push(this.patient.area)
	        }
	        this.provinceCity = cityList
	      })
	    },
	    incorporationPatient(formName) {
	      this.$refs[formName].validate((valid) => {
	        if (valid) {
	          this.patient.chargedBy = this.chargedBy
	          incorporationPatient(this.patient).then(res => {
	            this.isSaving = false
	            this.getIncorporationPatient()
	            this.ToHomePage()
	          }, () => {
	            this.isSaving = false
	          })
	        }
	      })
	    },
	    handleChange(value) {
	      this.patient.province = value[0]
	      this.patient.city = value[1]
	      this.patient.area = value[2]
	    },
	    ToHomePage() {
	      wx.miniProgram.switchTab({
	        url: '/pages/template/home/overview'
	      })
	    }
	  }
	}
</script>

<style>
  .dialogPadding .el-dialog__body{
    padding: 0 10px!important;
  }
  .agreement-content {
    max-height: 300px;
    overflow-y: scroll;
  }
</style>
