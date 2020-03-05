<template>
    <div>
        <el-row>
            <el-form :inline="true" :model="form" size="mini">
                <el-form-item label="">
                    <el-input v-model="form.queryString" placeholder="搜索患者姓名" size="mini" suffix-icon="el-icon-search"
                              @change="searchPatient"></el-input>
                </el-form-item>
                <el-form-item label="入组时间">
                    <el-col :span="11">
                        <el-date-picker type="date" v-model="form.startDate" placeholder="开始时间" style="width: 100%;"
                                        clearable @change="searchPatient"></el-date-picker>
                    </el-col>
                    <el-col class="text-center" :span="2">至</el-col>
                    <el-col :span="11">
                        <el-date-picker type="date" v-model="form.endDate" placeholder="结束时间" style="width: 100%;"
                                        clearable @change="searchPatient"></el-date-picker>
                    </el-col>
                </el-form-item>
            </el-form>
        </el-row>
        <el-row>
            <el-button type="primary" size="mini" icon="el-icon-download" @click="exportPatient">导出</el-button>
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
        <el-dialog v-if="exportDialogVisible" title="导出"
                   :visible.sync="exportDialogVisible" :before-close="closeDialog">
            <div>选择导出文件类型</div>
            <div class="text-center">
                <el-image style="width: 100px; height: 100px; margin-right: 50px;"
                          :class="{'active': exportType === 'EXCEL'}"
                        :src="img_excel" fit="fit" @click="exportType = 'EXCEL'"></el-image>
                <el-image style="width: 100px; height: 100px"
                          :class="{'active': exportType === 'CSV'}"
                          :src="img_csv" fit="fit" @click="exportType = 'CSV'"></el-image>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="exportDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="confirmExport">导 出</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
  import { getProjectPatients, exportPatients } from '@/api/PatientService'
  import PatientDialogComponent from '../patient/PatientDialogComponent'
  import img_excel from '@/assets/excel.png'
  import img_csv from '@/assets/csv.png'
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
          queryString: null,
          startDate: null,
          endDate: null
        },
        selectedPatient: null,
        patients: [],
        projectId,
        editDialogVisible: false,
        exportDialogVisible: false,
        img_excel,
        img_csv,
        exportType: ''
      }
    },
    created() {
      this.getPatients({ page: this.currentPage - 1, size: this.pageSize })
    },
    methods: {
      currentChange: function(currentPage) {
        this.currentPage = currentPage
      },
      sizeChange: function(val) {
        this.pageSize = val
      },
      getPatients(params) {
        getProjectPatients(this.projectId, params).then(res => {
          this.patients = res.data
          this.loading = false
          this.total = this.patients.length
        })
      },
      searchPatient() {
        if (this.form.queryString === '') {
          this.form.queryString = null
        }
        this.getPatients({
          'EQ_patient.name': this.form.queryString,
          'GT_patient.visitDate': this.form.startDate,
          'LT_patient.visitDate': this.form.endDate,
          page: this.currentPage - 1,
          size: this.pageSize
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
      exportPatient() {
        this.exportDialogVisible = true
      },
      confirmExport() {
        exportPatients(this.projectId, { type: this.exportType })
      },
      closeDialog(val) {
        if (val.page === 'editDialog') {
          this.editDialogVisible = false
          if (val.type === 'confirm') {
            this.loading = true
            this.getPatients()
          }
        } else {
          this.exportDialogVisible = false
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
.el-image.active{
    background-color: #d1eeff;
}
</style>
