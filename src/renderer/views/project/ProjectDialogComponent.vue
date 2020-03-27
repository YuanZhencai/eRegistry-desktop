<template>
    <el-dialog title="创建或编辑项目" width="500px"
               :visible.sync="display"
               :before-close="close">
        <el-form label-width="80px" size="mini" ref="projectForm" :model="project" :rules="rules">
            <el-form-item label="项目名称" prop="name">
                <el-input v-model="project.name"></el-input>
            </el-form-item>
            <el-form-item label="CRF模版">
                <el-select placeholder="选择已经发布的CRF模版" v-model="project.reportId" style="width: 100%">
                    <el-option v-for="report in reports" :key="report.id"
                               :label="report.title"
                               :value="report.id">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-row>
                <el-col :span="12">
                    <el-form-item label="开始时间" prop="beginDate">
                        <el-date-picker v-model="project.beginDate"
                                        :picker-options="beginDateOptions"
                                        type="date"
                                        placeholder="请选择日期"
                                        style="width: 100%"></el-date-picker>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="结束时间">
                        <el-date-picker v-model="endDate"
                                        :picker-options="endDateOptions"
                                        type="date"
                                        placeholder="请选择日期"
                                        style="width: 100%"></el-date-picker>
                    </el-form-item>
                </el-col>
            </el-row>

            <el-form-item label="项目简介">
                <el-input type="textarea" :rows="2" placeholder="请输入内容" v-model="project.introduction"></el-input>
            </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
            <el-button size="mini" @click="cancel">取 消</el-button>
            <el-button size="mini" type="primary" @click="confirm('projectForm')">确 定</el-button>
        </div>
    </el-dialog>
</template>

<script>
  import { mapGetters } from 'vuex'
  import { getMineReports } from '@/api/ReportService'
  import { getProject, createProject, updateProject } from '@/api/ProjectService'
  import store from '../../store'
export default {
    name: 'ProjectDialogComponent',
    computed: {
      ...mapGetters([
        'name'
      ])
    },
    data() {
      return {
        projectId: null,
        project: {},
        endDate: null,
        reports: [],
        rules: {
          name: [
            { required: true, message: '请输入项目名称', trigger: 'blur' },
            { min: 1, max: 50, message: '长度在 1 到 50 个字符', trigger: 'blur' }
          ],
          beginDate: [
            { required: true, message: '选择开始时间', trigger: 'blur' }
          ]
        },
        beginDateOptions: {
          disabledDate: (date) => {
            return this.disableBeginDate(date)
          }
        },
        endDateOptions: {
          disabledDate: (date) => {
            return this.disableEndDate(date)
          }
        },
        options: null,
        display: false,
        resolve: null,
        reject: null
      }
    },
    created() {
      this.getReports()
    },
    methods: {
      show(projectId) {
        this.projectId = projectId
        if (this.projectId) {
          this.getProject()
        } else {
          this.project = { name: '', beginDate: '' }
          this.endDate = null
        }
        this.display = true
        return new Promise((resolve, reject) => {
          this.resolve = resolve
          this.reject = reject
        })
      },
      cancel() {
        this.display = false
        this.reject('cancel')
      },
      close() {
        this.display = false
        this.reject('close')
      },
      getProject() {
        getProject(this.projectId).then(res => {
          this.project = res.data
          this.endDate = this.project.endDate
        })
      },
      getReports() {
        getMineReports().then(res => {
          this.reports = res.data
        })
      },
      confirm(formName) {
        this.project.chargedBy = this.name
        this.project.endDate = this.endDate
        this.$refs[formName].validate((valid) => {
          if (valid) {
            if (this.projectId) {
              updateProject(this.project).then((res) => {
                this.findUserRoles(() => {
                  this.display = false
                  this.resolve(res.data)
                })
              })
            } else {
              createProject(this.project).then((res) => {
                this.findUserRoles(() => {
                  this.display = false
                  this.resolve(res.data)
                })
              })
            }
          }
        })
      },
      disableBeginDate(beginDate) {
        if (!beginDate || !this.endDate) {
          return false
        } else if (this.endDate) {
          return beginDate.getTime() >= new Date(this.endDate).getTime()
        }
      },
      disableEndDate(endDate) {
        if (!endDate || !this.project.beginDate) {
          return false
        } else if (this.project.beginDate) {
          return endDate.getTime() <= new Date(this.project.beginDate).getTime()
        }
      },
      findUserRoles(callback) {
        store.dispatch('GetInfo').then(res => { // 拉取用户信息
          callback()
        })
      }
    }
  }
</script>

<style scoped>

</style>
