<template>
    <el-col :span="24">
        <el-row>
            <h3 class="no-margin-top">
                {{patient.name}}<small style="margin-left: 10px;">{{patient.sex}}</small>
            </h3>
        </el-row>
        <el-row :gutter="10">
            <el-col :span="6"><span>出生日期:{{patient.birthday | formatDate('YYYY-MM-DD')}}</span></el-col>
            <el-col :span="6"><span>手机号:{{patient.telephone}}</span></el-col>
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
    }
  }
</script>

<style scoped>

</style>
