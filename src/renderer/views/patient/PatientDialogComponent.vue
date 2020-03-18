<template>
    <el-dialog title="创建或编辑患者" :visible.sync="visible" :before-close="cancel">
        <el-form label-width="75px" size="mini" :model="patient" :rules="rules" ref="patientForm">
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
                <el-date-picker type="date" placeholder="开始时间" v-model="patient.birthday" style="width: 100%;"></el-date-picker>
            </el-form-item>
            <el-form-item label="就诊日期">
                <el-date-picker type="date" placeholder="开始时间" v-model="patient.visitDate" style="width: 100%;"></el-date-picker>
            </el-form-item>
            <el-form-item label="电话">
                <el-input v-model="patient.telephone"></el-input>
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
        </el-form>
        <div slot="footer" class="dialog-footer">
            <el-button size="mini" @click="cancel">取 消</el-button>
            <el-button size="mini" type="primary" @click="confirm('patientForm')">保 存</el-button>
        </div>
    </el-dialog>
</template>

<script>
  import { getPatient, createPatient, updatePatient } from '@/api/PatientService'
  const Cascader = require('./pca-code.json')
  export default {
    name: 'PatientDialogComponent',
    props: {
      visible: { type: Boolean },
      patientId: { type: Number }
    },
    data() {
      return {
        rules: {
          name: [
            { required: true, message: '请输入患者姓名', trigger: 'blur' }
          ]
        },
        patient: { name: '' },
        provinceCity: [],
        options: Cascader
      }
    },
    created() {
      this.getPatient()
    },
    methods: {
      getPatient() {
        const vm = this
        if (vm.patientId) {
          getPatient(vm.patientId).then(res => {
            vm.patient = Object.assign({}, vm.patient, res.data)
            const cityList = []
            if (vm.patient.province) {
              vm.$set(cityList, 0, vm.patient.province)
            }
            if (vm.patient.city) {
              vm.$set(cityList, 1, vm.patient.city)
            }
            if (this.patient.area) {
              vm.$set(cityList, 2, vm.patient.area)
            }
            vm.provinceCity = cityList
          })
        }
      },
      handleChange(value) {
        this.$set(this.patient, 'province', value[0])
        this.$set(this.patient, 'city', value[1])
        this.$set(this.patient, 'area', value[2])
      },
      cancel() {
        this.$emit('closeDialog', { page: 'editDialog', type: 'cancel' })
      },
      confirm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            if (this.patientId) {
              updatePatient(this.patient).then(res => {
                this.patient = res.data
                this.openMessage('患者信息更新成功', 'success')
                this.$emit('closeDialog', { page: 'editDialog', type: 'confirm' })
              })
            } else {
              this.patient.projectId = this.$route.params.projectId
              createPatient(this.patient).then(res => {
                this.patient = res.data
                this.openMessage('患者创建成功', 'success')
                this.$emit('closeDialog', { page: 'editDialog', type: 'confirm' })
              })
            }
          }
        })
      },
      openMessage(message, type) {
        this.$message({
          message,
          type
        })
      }
    }
  }
</script>

<style scoped>

</style>
