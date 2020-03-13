<template>
  <div class="app-container">
    <div class="header">
      <div class="title">
        <h1>日志记录</h1>
        <p>此模块列出了对该项目所做的所有更改，包括数据导出、数据更改以及用户的创建或删除</p>
      </div>
      <el-button type="primary"
                 size="medium "
                 icon="el-icon-download"
                 class="export">导出</el-button>
    </div>
    <el-card class="box-card">
      <el-form ref="form"
               label-width="120px"
               size="mini">
        <el-form-item label="按用户名筛选">
          <el-select v-model="members.username"
                     :clearable="this.isAdmin"
                     placeholder="请选择用户名"
                     @change="loadAll()">
            <el-option v-for="item in members"
                       :key="item.username"
                       :label="item.username"
                       :value="item.username">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="根据事件过滤">
          <el-select v-model="form.region"
                     clearable
                     placeholder="请选择过滤事件"
                     @change="loadAll()">
            <el-option label="患者"
                       value="patient"></el-option>
            <el-option label="病例"
                       value="patient_case"></el-option>
            <el-option label="随访"
                       value="follow"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
    </el-card>
    <el-table :data="tableData"
              stripe
              style="width: 100%">
      <el-table-column prop="commitDate"
                       label="时间"
                       width="180">
        <template slot-scope="scope">
          <span>{{ scope.row.commitDate | formatDate('YYYY-MM-DD HH:mm:ss') }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="author"
                       label="用户名"
                       width="180">
      </el-table-column>
      <el-table-column prop="action"
                       label="行动">
      </el-table-column>
      <el-table-column prop="values"
                       label="导出的数据更改或字段列表">
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <el-pagination background
                   :page-size="listQuery.limit"
                   :current-page="listQuery.page+1"
                   @size-change="sizeChange"
                   @current-change="currentChange"
                   layout="prev, pager, next"
                   :total="total">
    </el-pagination>
  </div>
</template>
<script>
import { LOGGING } from '@/api/logging'
import { fetch } from '@/utils/request'
export default {
  data() {
    const projectId = this.$route.params.projectId
    return {
      total: 0,
      listQuery: {
        page: 0,
        size: 10,
        sort: '+id'
      },
      members: [],
      form: {
        region: ''
      },
      tableData: [],
      projectId,
      isAdmin: false
    }
  },
  mounted() {
    this.findMembers(this.projectId)
    this.loadAll(this.projectId)
  },
  methods: {
    sizeChange(size) {
      this.listQuery.size = size
      this.loadAll()
    },
    currentChange(page) {
      this.listQuery.page = page - 1
      this.loadAll()
    },
    // 渲染该项目所做的所有操作,根据渲染条件请求数据并且渲染
    async loadAll() {
      const data = {
        id: this.projectId,
        type: this.form.region || '',
        author: this.members.username || '',
        page: this.listQuery.page || 0,
        size: this.listQuery.size || 10
      }
      try {
        const { res, headers } = await fetch(LOGGING.changes(data))
        this.tableData = res
        this.total = Number(headers['x-total-count'])
      } catch (e) {
        console.log(e)
      }
    },
    // 获取用户名筛选并渲染
    async findMembers(id) {
      try {
        const res = await fetch(LOGGING.userFilter(id))
        this.members = res.res
        this.isAdmin = this.$hasAnyAuthority([`PROJECT_ADMIN_${this.projectId}`])
        if (!this.isAdmin && this.members.length > 0) {
          this.members.username = this.members[0].username
        }
      } catch (e) {
        console.log(e)
      }
    }
  }
}
</script>
<style scoped>
.header {
  overflow: hidden;
}
.header > .title {
  float: left;
}
.export {
  float: right;
}
</style>
