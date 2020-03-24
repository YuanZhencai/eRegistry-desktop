<template>
    <div class='app-container'>
        <el-row>
            <el-col :span='24'>
                <el-button type='primary' size="mini" class='float-right' @click="newProject()">创建项目</el-button>
            </el-col>
        </el-row>
        <el-row>
            <el-table v-loading="loading" stripe :data='projects' @sort-change="changeOrder"
                      style='width: 100%'>
                <el-table-column prop='name' label='项目名称' sortable="custom"></el-table-column>
                <el-table-column prop='beginDate' label='开始时间' sortable="custom">
                    <template slot-scope="scope">
                        {{scope.row.beginDate | formatDate('YYYY-MM-DD')}}
                    </template>
                </el-table-column>
                <el-table-column prop='endDate' label='结束时间' sortable="custom">
                    <template slot-scope="scope">
                        {{scope.row.endDate | formatDate('YYYY-MM-DD')}}
                    </template>
                </el-table-column>
                <el-table-column prop='chargedBy' label='负责人' sortable="custom"></el-table-column>
                <el-table-column label="操作">
                    <template slot-scope="scope">
                        <el-button type="text" @click="view(scope.row.id)">查看</el-button>
                        <template v-if="$hasAnyAuthority([`PROJECT_ADMIN_${scope.row.id}`, `PROJECT_MASTER_${scope.row.id}`])">
                            <el-divider direction="vertical"></el-divider>
                            <el-button type="text" @click="edit(scope.row)">编辑</el-button>
                            <el-divider direction="vertical"></el-divider>
                            <el-button type="text" @click="deleteProject(scope.row)">删除</el-button>
                        </template>
                        <template v-if="$hasAnyAuthority([`PROJECT_ADMIN_${scope.row.id}`, `PROJECT_PATIENT_${scope.row.id}`])">
                            <el-divider direction="vertical"></el-divider>
                            <el-button type="text" @click="report(scope.row.id)">CRF</el-button>
                        </template>
                    </template>
                </el-table-column>
            </el-table>
        </el-row>
        <el-row>
            <el-pagination background layout="total, sizes, prev, pager, next, jumper"
                           :total="total" :page-sizes="[10, 20, 30, 40]" :page-size="pageSize" :current-page="currentPage"
                           @current-change="currentChange" @size-change="sizeChange" class="pagination">
            </el-pagination>
        </el-row>
        <el-dialog v-if="deleteDialogVisible" title="确认删除项目" :visible.sync="deleteDialogVisible" :before-close="closeDialog">
            <span>是否确认删除项目 '{{this.selectedProject.name}}'？</span>
            <span slot="footer" class="dialog-footer">
                <el-button @click="deleteDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="confirmDelete">删 除</el-button>
            </span>
        </el-dialog>
        <project-dialog-component ref="project-dialog"></project-dialog-component>
    </div>
</template>

<script>
  import ProjectDialogComponent from './ProjectDialogComponent'
  import { deleteProject, getMineProjects } from '../../api/ProjectService'

export default {
    name: 'ProjectList',
    components: { ProjectDialogComponent },
    data() {
      return {
        loading: true,
        predicate: 'createdDate',
        order: 'desc',
        projects: [],
        selectedProject: { id: null },
        total: 0,
        pageSize: 10, // 单页数据量
        currentPage: 1, // 默认开始页面
        deleteDialogVisible: false
      }
    },
    created() {
      this.getProjects()
    },
    methods: {
      sort() {
        return (this.predicate && this.order) ? `project.${this.predicate}` + ',' + (this.order === 'ascending' ? 'asc' : 'desc') : null
      },
      changeOrder(sort) {
        this.predicate = sort.prop
        this.order = sort.order
        this.getProjects()
      },
      getProjects() {
        this.loading = true
        const req = {
          page: this.currentPage - 1,
          size: this.pageSize,
          sort: this.sort()
        }
        getMineProjects(req).then(res => {
          this.loading = false
          this.projects = res.data
          this.total = Number(res.headers['x-total-count'])
        })
      },
      currentChange: function(currentPage) {
        this.currentPage = currentPage
        this.getProjects()
      },
      sizeChange: function(val) {
        this.pageSize = val
        this.getProjects()
      },
      view(projectId) {
        this.$router.push({
          path: `/project/${projectId}/home`
        })
      },
      report(projectId) {
        this.$router.push({
          path: `/project/${projectId}/report`
        })
      },
      edit(project) {
        this.selectedProject = project
        this.$refs['project-dialog'].show(project.id).then((project) => {
          this.selectedProject = project
          this.loading = true
          this.getProjects()
        }, () => {})
      },
      newProject() {
        this.selectedProject = { id: null }
        this.$refs['project-dialog'].show().then((project) => {
          this.selectedProject = project
          this.loading = true
          this.getProjects()
        }, () => {})
      },
      deleteProject(project) {
        this.selectedProject = project
        this.deleteDialogVisible = true
      },
      confirmDelete() {
        deleteProject(this.selectedProject.id).then(res => {
          this.deleteDialogVisible = false
          this.loading = true
          this.getProjects()
        })
      },
      closeDialog() {
        this.deleteDialogVisible = false
      }
    }
  }
</script>

<style scoped>

</style>
