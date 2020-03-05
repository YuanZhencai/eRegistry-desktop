<template>
    <div>
        <el-row>
            <el-form :inline="true" :model="form" size="mini">
                <el-form-item label="">
                    <el-input v-model="form.input" placeholder="搜索患者姓名"></el-input>
                </el-form-item>
                <el-form-item label="入组时间">
                    <el-col :span="11">
                        <el-date-picker type="date" placeholder="开始时间" v-model="form.startDate" style="width: 100%;"></el-date-picker>
                    </el-col>
                    <el-col class="text-center" :span="2">至</el-col>
                    <el-col :span="11">
                        <el-date-picker type="date" placeholder="结束时间" v-model="form.endDate" style="width: 100%;"></el-date-picker>
                    </el-col>
                </el-form-item>
            </el-form>
        </el-row>
        <el-row>
            <el-button type="primary" size="mini" icon="el-icon-download">导出</el-button>
            <el-button type="primary" size="mini" icon="el-icon-plus" @click="newPatient">新建患者</el-button>
        </el-row>
        <el-row>
            <el-table v-loading="loading" :data="patients.slice((currentPage-1)*pageSize, currentPage*pageSize)"
                      :default-sort="{prop: 'id', order: 'descending'}" style="width: 100%">
                <el-table-column prop="id" label="ID" sortable></el-table-column>
                <el-table-column prop="name" label="姓名" sortable></el-table-column>
                <el-table-column prop="sex" label="性别" sortable></el-table-column>
                <el-table-column prop="age" label="年龄" sortable></el-table-column>
                <el-table-column label="就诊日期" sortable>
                    <template slot-scope="scope">{{scope.row.visitDate | formatDate('YYYY-MM-DD')}}</template>
                </el-table-column>
                <el-table-column label="更新时间" sortable>
                    <template slot-scope="scope">{{scope.row.lastModifiedDate | formatDate('YYYY-MM-DD')}}</template>
                </el-table-column>
                <el-table-column prop="createdBy" label="录入人" sortable></el-table-column>
                <el-table-column prop="caseCount" label="病例数"></el-table-column>
                <el-table-column prop="followCount" label="随访数"></el-table-column>
                <el-table-column align="center">
                    <template slot="header" slot-scope="scope">
                        <span>操作</span>
                    </template>
                    <template slot-scope="scope">
                        <el-button type="text" @click="edit(scope.row)">编辑</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </el-row>
        <el-row>
            <el-pagination background layout="prev, pager, next, jumper"
                           :total="total" :page-size="pageSize" :current-page="currentPage"
                           @current-change="currentChange" @size-change="sizeChange" class="pagination">
            </el-pagination>
        </el-row>
        <patient-dialog-component v-if="editDialogVisible" :visible="editDialogVisible" :patient-id="selectedPatient.id"
            @closeDialog="closeDialog"></patient-dialog-component>
    </div>
</template>

<script>
  import { getProjectPatients, exportPatients } from '@/api/PatientService'
  import PatientDialogComponent from '../patient/PatientDialogComponent'
  export default {
    name: 'ProjectPatient',
    components: { PatientDialogComponent },
    data() {
      const projectId = this.$route.params.projectId
      return {
        loading: true,
        total: 0,
        pageSize: 10, // 单页数据量
        currentPage: 1, // 默认开始页面
        form: {
          input: '',
          startDate: '',
          endDate: ''
        },
        selectedPatient: null,
        patients: [],
        projectId,
        editDialogVisible: false
      }
    },
    created() {
      this.getPatients()
    },
    methods: {
      currentChange: function(currentPage) {
        this.currentPage = currentPage
      },
      sizeChange: function(val) {
        this.pageSize = val
      },
      getPatients() {
        getProjectPatients(this.projectId, { page: this.currentPage - 1, size: this.pageSize }).then(res => {
          this.patients = res.data
          this.loading = false
          this.total = this.patients.length
        })
      },
      edit(patient) {
        this.selectedPatient = patient
        this.editDialogVisible = true
      },
      newPatient() {
        this.selectedPatient = { id: null, name: '' }
        this.editDialogVisible = true
      },
      export() {
        exportPatients(this.projectId, 'csv')
      },
      closeDialog(val) {
        this.editDialogVisible = false
        if (val.type === 'confirm') {
          this.loading = true
          this.getPatients()
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
