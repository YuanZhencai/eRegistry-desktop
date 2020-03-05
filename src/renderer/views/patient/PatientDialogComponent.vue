<template>
    <el-dialog title="创建或编辑患者" :visible.sync="visible" :before-close="cancel">
        <el-form label-width="75px">
            <el-form-item label="姓名">
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
                        :options="options"
                        @change="handleChange" style="width: 100%"></el-cascader>
            </el-form-item>
            <el-form-item label="地址">
                <el-input v-model="patient.address"></el-input>
            </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
            <el-button size="mini" @click="cancel">取 消</el-button>
            <el-button size="mini" type="primary" @click="confirm">保 存</el-button>
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
        const _this = this
        if (_this.patientId) {
          getPatient(_this.patientId).then(res => {
            _this.patient = Object.assign({}, _this.patient, res.data)
            const cityList = []
            if (_this.patient.province) {
              _this.$set(cityList, 0, _this.patient.province)
            }
            if (_this.patient.city) {
              _this.$set(cityList, 1, _this.patient.city)
            }
            if (this.patient.area) {
              _this.$set(cityList, 2, _this.patient.area)
            }
            _this.provinceCity = cityList
          })
        }
      },
      handleChange(value) {
        console.log(value)
        this.$set(this.patient, 'province', value[0])
        this.$set(this.patient, 'city', value[1])
        this.$set(this.patient, 'area', value[2])
      },
      cancel() {
        this.$emit('closeDialog', { page: 'editDialog', type: 'cancel' })
      },
      confirm() {
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
