<template>
  <div class="app-container">
    <el-card class="box-card">
      <el-button type="primary"
                 size="medium "
                 v-if="project && project.name"
                 v-download="{name: `${project.name}.zip`, url: `/api/projects/${projectId}/changes/data`}"
                 class="export">
        <span class="fa fa-download"></span>
        <span class="d-none d-md-inline">导出</span>
      </el-button>
      <el-form ref="form"
               :inline="true"
               label-width="120px"
               size="mini">
        <el-form-item label="按用户名筛选">
          <el-select v-model="userSelection.username"
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
    <el-pagination @size-change="sizeChange"
                   @current-change="currentChange"
                   :current-page="listQuery.page+1"
                   :page-size="listQuery.size"
                   layout="total, prev, pager, next, jumper"
                   :total="total"
                   background
                   class="pagination">
    </el-pagination>
  </div>
</template>
<script>
import { userFilter, changes } from '@/api/logService'
import { getProject } from '../../api/ProjectService'
export default {
  data() {
    const projectId = this.$route.params.projectId
    return {
      total: 0,
      listQuery: {
        page: 0,
        size: 10
      },
      members: [],
      form: {
        region: ''
      },
      userSelection: {
        username: ''
      },
      tableData: [],
      projectId,
      isAdmin: false,
      project: null
    }
  },
  mounted() {
    this.findProject()
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
        author: this.userSelection.username || '',
        page: this.listQuery.page || 0,
        size: this.listQuery.size || 10
      }
      await changes(data).then((res) => {
        this.tableData = res.data
        this.total = Number(res.headers['x-total-count'])
      })
    },
    // 获取用户名筛选并渲染
    async findMembers(id) {
      await userFilter(id).then((res) => {
        this.members = res.data
        this.isAdmin = this.$hasAnyAuthority([`PROJECT_ADMIN_${this.projectId}`])
      })
      if (!this.isAdmin && this.members.length > 0) {
        this.userSelection.username = this.members[0].username
        this.loadAll()
      }
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
.box-card {
  overflow: hidden;
}
.export {
  float: right;
}
</style>
