<template>
    <div>
        <el-row>
            <el-form :inline="true" :model="form" size="mini">
                <el-form-item label="">
                    <el-input v-model="form.queryString" placeholder="搜索患者姓名" size="mini" suffix-icon="el-icon-search"
                              @change="searchPatient"></el-input>
                </el-form-item>
                <el-form-item label="入组日期">
                    <el-col :span="11">
                        <el-date-picker type="date" v-model="form.startDate" placeholder="开始日期" style="width: 100%;"
                                        clearable @change="searchPatient"></el-date-picker>
                    </el-col>
                    <el-col class="text-center" :span="2">至</el-col>
                    <el-col :span="11">
                        <el-date-picker type="date" v-model="form.endDate" placeholder="结束日期" style="width: 100%;"
                                        clearable @change="searchPatient"></el-date-picker>
                    </el-col>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" size="mini" icon="el-icon-download"
                               v-if="$hasAnyAuthority(['PROJECT_ADMIN_' + projectId, 'PROJECT_MASTER_' + projectId, 'PROJECT_VIEW_' + projectId])"
                               @click="exportPatient">导出
                    </el-button>
                    <el-button type="primary" size="mini" icon="el-icon-plus"
                               v-if="$hasAnyAuthority(['PROJECT_ADMIN_' + projectId, 'PROJECT_DOCTOR_' + projectId, 'PROJECT_PATIENT_' + projectId, 'PROJECT_FOLLOWER_' + projectId])"
                               @click="newPatient">新建患者
						<incorporation :project-id="projectId"></incorporation>
                    </el-button>
                </el-form-item>
            </el-form>
        </el-row>
        <el-row>
            <el-table v-loading="loading" :data="patients"
                      @sort-change="changeOrder" style="width: 100%">
                <el-table-column prop="id" label="ID" sortable="custom">
                    <template slot-scope="scope">
                        <router-link :to="{name: 'patientDetail', params: { patientId: scope.row.id}}" class="linka">
                            {{scope.row.id}}
                        </router-link>
                    </template>
                </el-table-column>
                <el-table-column prop="name" label="姓名" sortable="custom">
                    <template slot-scope="scope">
                        <router-link :to="{name: 'patientDetail', params: { patientId: scope.row.id}}" class="linka">
                            {{scope.row.name}}
                        </router-link>
                    </template>
                </el-table-column>
                <el-table-column prop="sex" label="性别" sortable="custom"></el-table-column>
                <el-table-column prop="age" label="年龄"></el-table-column>
                <el-table-column prop="visitDate" label="入组日期" sortable="custom">
                    <template slot-scope="scope">{{scope.row.visitDate | formatDate('YYYY-MM-DD')}}</template>
                </el-table-column>
                <el-table-column prop="lastModifiedDate" label="更新时间" sortable="custom">
                    <template slot-scope="scope">{{scope.row.lastModifiedDate | formatDate('YYYY-MM-DD')}}</template>
                </el-table-column>
                <el-table-column prop="chargedBy" label="负责人" sortable="custom">
					<template slot-scope="scope">{{scope.row.chargedName || scope.row.chargedBy}}</template>
				</el-table-column>
                <el-table-column prop="followCount" label="随访数"></el-table-column>
                <el-table-column align="center" style="width: 100px;">
                    <template slot="header" slot-scope="scope">
                        <span>操作</span>
                    </template>
                    <template slot-scope="scope"
                              v-if="$hasAnyAuthority(['PROJECT_ADMIN_' + projectId, 'PROJECT_DOCTOR_' + projectId, 'PROJECT_PATIENT_' + projectId])">
                        <el-button type="text" @click="edit(scope.row)">编辑</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </el-row>
        <el-row>
            <el-pagination background
                           :current-page="currentPage"
                           :page-size="pageSize"
                           layout="total, prev, pager, next, jumper"
                           :total="total"
                           @current-change="currentChange"
                           class="pagination">
            </el-pagination>
        </el-row>
        <patient-dialog-component ref="patient-dialog"></patient-dialog-component>
        <el-dialog v-if="exportDialogVisible" title="导出" width="500px"
                   :visible.sync="exportDialogVisible" :before-close="closeDialog">
            <div class="text-center" v-if="project">
                <el-image v-if="project.name"
                        v-download="{url: `api/projects/${projectId}/patients/data?type=EXCEL`, name: `${project.name}.zip`}"
                        style="width: 100px; height: 100px; margin-right: 50px;"
                        :src="img_excel" fit="fit">

                </el-image>
                <el-image v-if="project.name"
                        v-download="{url: `api/projects/${projectId}/patients/data?type=CSV`, name: `${project.name}.zip`}"
                        style="width: 100px; height: 100px"
                        :src="img_csv" fit="fit">

                </el-image>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="exportDialogVisible = false">取 消</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
  import { SERVER_API_URL } from '@/constants'
  import { getProjectPatients } from '@/api/PatientService'
  import PatientDialogComponent from '../patient/PatientDialogComponent'
  import img_excel from '@/assets/excel.png'
  import img_csv from '@/assets/csv.png'
  import { getProject } from '../../api/ProjectService'
  import Incorporation from '../../components/qrcode/Incorporation'
export default {
    name: 'ProjectPatient',
    components: { Incorporation, PatientDialogComponent },
    data() {
      const projectId = this.$route.params.projectId
      return {
        BASE_API: SERVER_API_URL,
        loading: false,
        predicate: '',
        order: '',
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
        exportDialogVisible: false,
        img_excel,
        img_csv,
        exportType: '',
        project: null
      }
    },
    created() {
      this.findProject()
      this.getPatients()
    },
    mounted() {
      this.$on('patientCaseListModification', function() {
        this.currentPage = 1
        this.patients = []
        this.getPatients()
      })
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
      getPatients() {
        this.loading = true
        getProjectPatients(this.projectId, {
          page: this.currentPage - 1,
          size: this.pageSize,
          sort: this.sort(),
          'LIKE_patient.name': (this.form.queryString ? `%${this.form.queryString}%` : null),
          'GT_patient.visitDate': this.form.startDate,
          'LT_patient.visitDate': this.form.endDate
        }).then((res) => {
          this.patients = res.data
          this.loading = false
          this.total = Number(res.headers['x-total-count'])
        })
      },
      searchPatient() {
        if (this.form.queryString === '') {
          this.form.queryString = null
        }
        this.getPatients()
      },
      edit(patient) {
        this.selectedPatient = patient
        this.$refs['patient-dialog'].show(this.projectId, this.selectedPatient.id).then((res) => {
          this.getPatients()
        }, () => {})
      },
      newPatient() {
        this.selectedPatient = { id: null, name: '' }
        this.$refs['patient-dialog'].show().then((res) => {
          this.getPatients()
        }, () => {})
      },
      exportPatient() {
        this.exportDialogVisible = true
      },
      closeDialog() {
        this.exportDialogVisible = false
      },
      findProject() {
        getProject(this.projectId).then((res) => {
          this.project = res.data
        })
      }
    }
  }
</script>

<style scoped>
    .el-image.active {
        background-color: #d1eeff;
    }

</style>
