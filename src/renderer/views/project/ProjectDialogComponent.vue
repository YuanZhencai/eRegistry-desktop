<template>
    <el-dialog title="创建或编辑项目" :visible.sync="visible" :before-close="closeDialog">
        <el-form label-width="75px">
            <el-form-item label="项目名称">
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
            <el-form-item label="开始时间">
                <el-col :span="10">
                    <el-date-picker v-model="project.beginDate" type="date" placeholder="请选择日期"
                                    style="width: 100%"></el-date-picker>
                </el-col>
                <el-col :span="4" class="text-center">结束时间</el-col>
                <el-col :span="10">
                    <el-date-picker v-model="project.endDate" type="date" placeholder="请选择日期"
                                    style="width: 100%"></el-date-picker>
                </el-col>
            </el-form-item>

            <el-form-item label="项目简介">
                <el-input type="textarea" :rows="2" placeholder="请输入内容" v-model="project.introduction"></el-input>
            </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
            <el-button size="mini" @click="closeDialog">取 消</el-button>
            <el-button size="mini" type="primary" @click="confirm">确 定</el-button>
        </div>
    </el-dialog>
</template>

<script>
  import { getMineReports } from '@/api/ReportService'
  import { getProject } from '@/api/ProjectResource'
  export default {
    name: 'ProjectDialogComponent',
    props: {
      visible: { type: Boolean },
      projectId: { type: Number }
    },
    data() {
      return {
        project: null,
        reports: []
      }
    },
    created() {
      if (this.projectId) {
        this.getProject()
      } else {
        this.project = { name: '', beginDate: '', endDate: '' }
      }
      this.getReports()
    },
    methods: {
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
      closeDialog() {
        this.$emit('closeDialog', { type: 'newDialog' })
      },
      confirm() {}
    }
  }
</script>

<style scoped>

</style>
