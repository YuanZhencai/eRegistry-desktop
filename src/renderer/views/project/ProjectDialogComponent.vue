<template>
    <el-dialog title="创建或编辑项目"
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
                        <el-date-picker v-model="project.beginDate" type="date" placeholder="请选择日期"
                                        style="width: 100%"></el-date-picker>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="结束时间" prop="endDate">
                        <el-date-picker v-model="project.endDate" type="date" placeholder="请选择日期"
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
  import moment from 'moment'
  import { mapGetters } from 'vuex'
  import { getMineReports } from '@/api/ReportService'
  import { getProject, createProject, updateProject } from '@/api/ProjectService'
  export default {
    name: 'ProjectDialogComponent',
    computed: {
      ...mapGetters([
        'name'
      ])
    },
    data() {
      const vm = this
      const validateEndDate = (rule, value, callback) => {
        if (moment(value).isBefore(vm.project.beginDate)) {
          callback(new Error('结束日期应该大于开始日期'))
        } else {
          callback()
        }
      }
      return {
        projectId: null,
        project: { name: null, beginDate: null, endDate: null },
        reports: [],
        rules: {
          name: [
            { required: true, message: '请输入项目名称', trigger: 'blur' }
          ],
          beginDate: [
            { required: true, message: '选择开始时间', trigger: 'blur' }
          ],
          endDate: [
            { required: true, message: '请选择结束日期', trigger: 'blur' },
            { validator: validateEndDate, trigger: 'blur' }
          ]
        },
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
        const that = this
        this.projectId = projectId
        if (this.projectId) {
          this.getProject()
        } else {
          this.project = { name: '', beginDate: '', endDate: '' }
        }
        this.display = true
        return new Promise((resolve, reject) => {
          that.resolve = resolve
          that.reject = reject
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
        })
      },
      getReports() {
        getMineReports().then(res => {
          this.reports = res.data
        })
      },
      confirm(formName) {
        const that = this
        this.project.chargedBy = this.name
        this.$refs[formName].validate((valid) => {
          if (valid) {
            if (this.projectId) {
              updateProject(this.project).then((res) => {
                that.display = false
                that.resolve(res.data)
              })
            } else {
              createProject(this.project).then((res) => {
                that.display = false
                that.resolve(res.data)
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
