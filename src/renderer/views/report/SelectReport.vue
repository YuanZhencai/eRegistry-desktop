<template>
    <el-dialog
            title="选择问卷"
            :visible.sync="display"
            width="500"
            :before-close="close">
        <el-form ref="form" :model="form" label-width="80px">
            <el-form-item label="CRF模版">
                <el-select style="width: 100%" placeholder="选择已经发布的CRF模版" v-model="reportId">
                    <el-option v-for="report in reports" :key="report.id"
                               :label="report.title"
                               :value="report.id">
                    </el-option>
                </el-select>
            </el-form-item>
        </el-form>
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