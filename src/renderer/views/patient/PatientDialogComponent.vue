<template>
    <el-dialog title="创建或编辑患者" width="500px" :visible.sync="display" :before-close="close">
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
                <el-date-picker type="date" placeholder="请填写出生日期" v-model="patient.birthday" style="width: 100%;"></el-date-picker>
            </el-form-item>
            <el-form-item label="就诊日期">
                <el-date-picker type="date" placeholder="请填写就诊日期" v-model="patient.visitDate" style="width: 100%;"></el-date-picker>
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
        </el-form>
        <div slot="footer" class="dialog-footer">
            <el-button size="mini" @click="cancel">取 消</el-button>
            <el-button size="mini" type="primary" :disabled="isSaving" @click="confirm('patientForm')">保 存</el-button>
        </div>
    </el-dialog>
</template>

<script>
  import { getPatient, createPatient, updatePatient } from '@/api/PatientService'
  const codes = require('./pca-code.json')
  export default {
    name: 'PatientDialogComponent',
    data() {
      return {
        patientId: null,
        display: false,
        resolve: null,
        reject: null,
        rules: {
          name: [
            { required: true, message: '请输入患者姓名', trigger: 'blur' }
          ],
          telephone: [
            { pattern: /^(1(3|4|5|6|7|8|9)\d{9})$/, message: '手机号码有误，请重填', trigger: 'blur' }
          ]
        },
        patient: { name: '' },
        provinceCity: [],
        options: [],
        isSaving: false
      }
    },
    methods: {
      show(patientId) {
        this.patient = { name: '' }
        this.provinceCity = []
        this.options = JSON.parse(JSON.stringify(codes))
        this.display = true
        this.patientId = patientId
        this.findPatient()
        return new Promise((resolve, reject) => {
          this.resolve = resolve
          this.reject = reject
        })
      },
      findPatient() {
        if (this.patientId) {
          getPatient(this.patientId).then(res => {
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
        }
      },
      handleChange(value) {
        this.patient.province = value[0]
        this.patient.city = value[1]
        this.patient.area = value[2]
      },
      cancel() {
        this.display = false
        this.reject('cancel')
      },
      close() {
        this.display = false
        this.reject('close')
      },
      confirm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.isSaving = true
            if (this.patientId) {
              updatePatient(this.patient).then(res => {
                this.isSaving = false
                this.display = false
                this.resolve(res.data)
              }, () => {
                this.isSaving = false
              })
            } else {
              this.patient.projectId = this.$route.params.projectId
              createPatient(this.patient).then(res => {
                this.isSaving = false
                this.display = false
                this.resolve(res.data)
              }, () => {
                this.isSaving = false
              })
            }
          }
        })
      }
    }
  }
</script>

<style scoped>

</style>
