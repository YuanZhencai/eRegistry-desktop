<template>
	<div class="app-container">
		<div style="text-align: center">
			<h2>入组确认</h2>
		</div>
		<el-form v-if="patient" label-width="75px" size="mini" :model="patient" :rules="rules" ref="patientForm">
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
				<el-button type="primary" @click="incorporationPatient('patientForm')">确定</el-button>
			</el-form-item>
		</el-form>
	</div>
</template>

<script>
	import { getIncorporationPatient, incorporationPatient } from '../../api/IncorporationService'

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
	          { pattern: /^(1(3|4|5|6|7|8|9)\d{9})$/, message: '手机号码有误，请重填', trigger: 'change' }
	        ]
	      },
	      patient: null,
	      provinceCity: [],
	      options: [],
	      isSaving: false
	    }
	  },
	  mounted() {
	    this.options = JSON.parse(JSON.stringify(codes))
	    this.getIncorporationPatient()
	  },
	  methods: {
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
	    }
	  }
	}
</script>

<style scoped>

</style>
