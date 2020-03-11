<template>
  <div class="app-container">
    <el-button type="primary">
      <router-link :to="'/report/new'">
        创建CRF
      </router-link>
    </el-button>
    <el-table
        :data="reports"
        stripe
        @sort-change="changeOrder"
        style="width: 100%">
      <el-table-column
          prop="title"
          sortable="custom"
          label="标题">
      </el-table-column>
      <el-table-column
          prop="lastModifiedDate"
          sortable="custom"
          label="更新时间"
          width="180">
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button type="text">
            <router-link :to="`/report/${scope.row.id}`">
              查看
            </router-link>
          </el-button>
          <el-divider direction="vertical"></el-divider>
          <el-button type="text" @click="openRemoveDialog(scope.row)">删除</el-button>
          <el-divider direction="vertical"></el-divider>
          <el-button type="text" @click="openCopyDialog(scope.row)">复制</el-button>
          <el-divider direction="vertical"></el-divider>
          <el-button type="text" @click="openShareDialog(scope.row)">分享</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
        @size-change="sizeChange"
        @current-change="loadPage"
        :current-page="page"
        :page-sizes="[10, 20, 30, 40]"
        :page-size="size"
        layout="total, sizes, prev, pager, next, jumper"
        :total="totalItems">
    </el-pagination>
    <el-dialog
            title="删除问卷"
            :visible.sync="removeDialog">
      <span>确定要删除 {{remove.title}} 吗?</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="removeDialog = false">取 消</el-button>
        <el-button type="primary" @click="removeReport">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog
            title="复制问卷"
            :visible.sync="copyDialog">
      <el-form label-width="75px" :model="copy" ref="copyForm">
        <el-form-item label="名称" prop="title" :rules="[{required: true, message: '名称不能为空'}]">
          <el-input v-model="copy.title"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="copyDialog = false">取 消</el-button>
        <el-button type="primary" @click="copyReport('copyForm')">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog
            title="分享问卷"
            :visible.sync="shareDialog">
      <el-form label-width="75px" :model="share" ref="shareForm">
        <el-form-item label="CRF">
          <el-input v-model="share.report.title" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="用户" prop="username" :rules="[{required: true, message: '用户不能为空'}]">
          <el-select
                  v-model="share.username"
                  filterable
                  remote
                  reserve-keyword
                  placeholder="搜索用户"
                  :remote-method="findUsers"
                  :loading="loading">
            <el-option
                    v-for="user in users"
                    :key="user.login"
                    :label="user.login"
                    :value="user.login">
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="shareDialog = false">取 消</el-button>
        <el-button type="primary" @click="shareReport('shareForm')">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  import { copyReport, deleteReport, getReports, shareReport } from '../../api/ReportService'
  import { getUsersByLoginStartingWith } from '../../api/UserResource'

export default {
    name: 'Report',
    data() {
      return {
        reports: [],
        page: 1,
        previousPage: 1,
        size: 10,
        predicate: 'id',
        order: 'ascending',
        totalItems: null,
        queryCount: null,
        login: this.$store.getters.name,
        removeDialog: false,
        remove: {},
        copyDialog: false,
        copy: {},
        shareDialog: false,
        share: {
          report: {
            title: null
          },
          username: null
        },
        loading: false,
        users: []
      }
    },
    mounted() {
      this.loadAll()
    },
    methods: {
      sort() {
        return (this.predicate && this.order) ? [this.predicate + ',' + (this.order === 'ascending' ? 'asc' : 'desc')] : []
      },
      loadAll() {
        getReports({
          page: this.page - 1,
          size: this.size,
          sort: this.sort(),
          'EQ_report.createdBy': this.login,
          'EQ_report.deleted': false
        }).then((res) => {
          this.reports = res.data
          this.totalItems = Number(res.headers['x-total-count'])
          this.queryCount = this.totalItems
        })
      },
      transition() {
        this.loadAll()
      },
      loadPage(page) {
        if (page !== this.previousPage) {
          this.previousPage = page
          this.transition()
        }
      },
      changeOrder(sort) {
        console.info(sort)
        this.predicate = sort.prop
        this.order = sort.order
        this.transition()
      },
      sizeChange(size) {
        this.size = size
        this.transition()
      },
      openRemoveDialog(report) {
        this.remove = report
        this.removeDialog = true
      },
      removeReport() {
        deleteReport(this.remove.id).then(res => {
          this.removeDialog = false
          this.loadAll()
          this.remove = {}
        })
      },
      openCopyDialog(report) {
        this.copy = {
          reportId: report.id,
          title: report.title + '的副本'
        }
        this.copyDialog = true
      },
      copyReport(form) {
        this.$refs[form].validate((valid) => {
          if (valid) {
            copyReport(this.copy).then(res => {
              this.loadAll()
              this.copyDialog = false
              this.copy = {}
            })
          }
        })
      },
      openShareDialog(report) {
        this.share = {
          report: report,
          username: null
        }
        this.shareDialog = true
      },
      findUsers(login) {
        getUsersByLoginStartingWith(login).then(res => {
          this.users = res.data
        })
      },
      shareReport(form) {
        this.$refs[form].validate((valid) => {
          if (valid) {
            shareReport(this.share).then(res => {
              this.loadAll()
              this.shareDialog = false
              this.share = {
                report: {
                  title: null
                },
                username: null
              }
            })
          }
        })
      }
    }
  }
</script>

<style scoped>

</style>
