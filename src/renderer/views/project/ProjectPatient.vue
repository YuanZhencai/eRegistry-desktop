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
            <el-button type="primary" size="mini" icon="el-icon-download"
                       v-if="$hasAnyAuthority(['PROJECT_ADMIN_' + projectId, 'PROJECT_MASTER_' + projectId, 'PROJECT_VIEW_' + projectId])"
                       @click="exportPatient">导出</el-button>
            <el-button type="primary" size="mini" icon="el-icon-plus"
                       v-if="$hasAnyAuthority(['PROJECT_ADMIN_' + projectId, 'PROJECT_PATIENT_' + projectId])"
                       @click="newPatient">新建患者
                <template v-if="$hasAnyAuthority(['PROJECT_PATIENT_' + projectId])">
                    <el-popover
                            placement="bottom"
                            title="调查二维码"
                            width="200"
                            trigger="hover">
                        <el-image
                                style="width: 150px; height: 150px"
                                :src="`${baseApi}/api/qrcode?uri=/questionnaire/investigation-new`"
                                :fit="'fill'">
                        </el-image>
                        <el-button type="text" slot="reference">分享调查</el-button>
                    </el-popover>
                    <el-popover
                            placement="bottom"
                            title="添加患者二维码"
                            trigger="hover"
                            width="200"
                            v-if="task">
                        <el-image :src="`${baseApi}/api/qrcode?uri=/patient-task/${task.id}`"></el-image>
                        <el-button type="text" slot="reference"><i class="fa fa-qrcode"></i></el-button>
                    </el-popover>
                </template>
            </el-button>
        </el-row>
        <el-row>
            <el-table v-loading="loading" :data="patients"
                      @sort-change="changeOrder" style="width: 100%">
                <el-table-column prop="id" label="ID" sortable="custom">
                    <template slot-scope="scope">
                        <router-link :to="{name: 'patientDetail', params: { patientId: scope.row.id}}" class="linka">{{scope.row.id}}</router-link>
                    </template>
                </el-table-column>
                <el-table-column prop="name" label="姓名" sortable="custom">
                    <template slot-scope="scope">
                        <router-link :to="{name: 'patientDetail', params: { patientId: scope.row.id}}" class="linka">{{scope.row.name}}</router-link>
                    </template>
                </el-table-column>
                <el-table-column prop="sex" label="性别" sortable="custom"></el-table-column>
                <el-table-column prop="age" label="年龄"></el-table-column>
                <el-table-column prop="visitDate" label="就诊日期" sortable="custom">
                    <template slot-scope="scope">{{scope.row.visitDate | formatDate('YYYY-MM-DD')}}</template>
                </el-table-column>
                <el-table-column prop="lastModifiedDate" label="更新时间" sortable="custom">
                    <template slot-scope="scope">{{scope.row.lastModifiedDate | formatDate('YYYY-MM-DD')}}</template>
                </el-table-column>
                <el-table-column prop="createdBy" label="录入人" sortable="custom"></el-table-column>
                <el-table-column prop="caseCount" label="病例数"></el-table-column>
                <el-table-column prop="followCount" label="随访数"></el-table-column>
                <el-table-column align="center">
                    <template slot="header" slot-scope="scope">
                        <span>操作</span>
                    </template>
                    <template slot-scope="scope" v-if="$hasAnyAuthority(['PROJECT_ADMIN_' + projectId, 'PROJECT_PATIENT_' + projectId])">
                        <el-button type="text" @click="edit(scope.row)">编辑</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </el-row>
        <el-row>
            <el-pagination background
                           :current-page="currentPage"
                           :page-sizes="[10, 20, 30, 40]"
                           :page-size="pageSize"
                           layout="total, sizes, prev, pager, next, jumper"
                           :total="total"
                           @current-change="currentChange"
                           @size-change="sizeChange" class="pagination">
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
  import { getCurrentProjectMemberTask } from '@/api/TaskService'
  export default {
    name: 'ProjectPatient',
    components: { PatientDialogComponent },
    data() {
      const projectId = this.$route.params.projectId
      return {
        loading: true,
        predicate: 'id',
        order: 'ascending',
        total: 0,
        pageSize: 10, // 单页数据量
        currentPage: 1, // 默认开始页面
        previousPage: 1,
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
      this.getPatients()
      this.findCurrentMemberTask()
    },
    methods: {
      sort() {
        return (this.predicate && this.order) ? this.predicate + ',' + (this.order === 'ascending' ? 'asc' : 'desc') : null
      },
      changeOrder(sort) {
        this.predicate = sort.prop
        this.order = sort.order
        this.getPatients()
      },
      currentChange: function(currentPage) {
        this.currentPage = currentPage
        this.getPatients()
      },
      sizeChange: function(val) {
        this.pageSize = val
        this.getPatients()
      },
      getPatients() {
        const vm = this
        vm.loading = true
        getProjectPatients(this.projectId, {
          page: this.currentPage - 1,
          size: this.pageSize,
          sort: this.sort(),
          'EQ_patient.name': this.form.queryString,
          'GT_patient.visitDate': this.form.startDate,
          'LT_patient.visitDate': this.form.endDate
        }).then((res) => {
          vm.patients = res.data
          vm.loading = false
          vm.total = Number(res.headers['x-total-count'])
        })
      },
      searchPatient() {
        if (this.form.queryString === '') {
          this.form.queryString = null
        }
        this.getPatients()
      },
      findCurrentMemberTask() {
        if (this.$hasAnyAuthority([`PROJECT_PATIENT_${this.projectId}`])) {
          getCurrentProjectMemberTask(this.projectId).then(res => {
            this.task = res.data
          })
        }
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
            this.getPatients()
          }
        } else {
          this.exportDialogVisible = false
        }
      }
    }
  }
</script>

<style scoped>
.el-image.active{
    background-color: #d1eeff;
}

</style>
