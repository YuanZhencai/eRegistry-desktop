<template>
	<el-col :span="24">
		<el-row>
			<h3 class="no-margin-top">
				{{patient.name}}<small style="margin-left: 10px;">{{patient.sex}}</small>
			</h3>
		</el-row>
		<el-row :gutter="10">
			<el-col :span="6"><span>出生日期:{{patient.birthday | formatDate('YYYY-MM-DD')}}</span></el-col>
			<el-col :span="6">
				<span>手机号:{{patient.telephone}}</span>
				<el-tooltip content="拨打电话" placement="top" v-if="$hasAnyAuthority(['PROJECT_ADMIN_' + patient.projectId, 'PROJECT_MASTER_' + patient.projectId, 'PROJECT_PATIENT_' + patient.projectId]) && patient.telephone">
					<el-button style="margin-left: 5px;"
							   type="primary"
							   icon="el-icon-phone"
							   @click="call"
							   circle>
					</el-button>
				</el-tooltip>
			</el-col>
			<el-col :span="6"><span>备用电话:{{patient.reserveTelephone}}</span></el-col>
			<el-col :span="6"><span>就诊时间:{{patient.visitDate | formatDate('YYYY-MM-DD')}}</span></el-col>
		</el-row>
		<el-row>
			<el-col :span="2">地址:</el-col>
			<el-col :span="22">{{patient.province}} {{patient.city}} {{patient.area}} {{patient.address}}</el-col>
		</el-row>
	</el-col>
</template>

<script>
	import { callPatient } from '../../api/CallCenterService'

	export default {
	  name: 'PatientInfo',
	  props: {
	    patient: {
	      type: Object,
	      default: function() {
	        return {
	          name: '',
	          sex: '',
	          birthday: null,
	          telephone: '',
	          reverseTelephone: '',
	          visitDate: null
	        }
	      }
	    }
	  },
	  methods: {
	    call() {
	      callPatient({
	        projectId: this.patient.projectId,
	        patientId: this.patient.id
	      }).then(res => {

	      })
	    }
	  }
	}
</script>

<style scoped>

</style>
