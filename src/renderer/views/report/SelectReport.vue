<template>
    <el-dialog
            title="选择问卷"
            :visible.sync="display"
            width="30%"
            :before-close="close">
        <el-select placeholder="选择已经发布的CRF模版" v-model="reportId">
            <el-option v-for="report in reports" :key="report.id"
                       :label="report.title"
                       :value="report.id">
            </el-option>
        </el-select>
        <span slot="footer" class="dialog-footer">
            <el-button @click="cancel">取 消</el-button>
            <el-button type="primary" @click="ok">确 定</el-button>
          </span>
    </el-dialog>
</template>

<script>
    import { getMineReports } from '../../api/ReportService'

export default {
      name: 'SelectReport',
      data() {
        return {
          reports: [],
          reportId: null,
          display: false,
          resolve: null,
          reject: null
        }
      },
      methods: {
        findReports() {
          getMineReports().then(res => {
            this.reports = res.data
          })
        },
        show() {
          this.findReports()
          this.display = true
          return new Promise((resolve, reject) => {
            this.resolve = resolve
            this.reject = reject
          })
        },
        close() {
          this.display = false
          this.reject('close')
        },
        cancel() {
          this.display = false
          this.reject('cancel')
        },
        ok() {
          this.display = false
          this.reports.forEach((report) => {
            if (report.id === this.reportId) {
              this.resolve(report)
            }
          })
        }
      }
    }
</script>

<style scoped>

</style>