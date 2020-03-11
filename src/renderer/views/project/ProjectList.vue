<template>
    <div class='app-container'>
        <el-row>
            <el-col :span='24'>
                <el-button type='primary' class='float-right' @click="newProject()">创建项目</el-button>
            </el-col>
        </el-row>
        <el-row>
            <el-table v-loading="loading" stripe :data='projects.slice((currentPage-1)*pageSize, currentPage*pageSize)'
                      :default-sort = "{prop: 'id', order: 'descending'}" style='width: 100%'>
                <el-table-column prop='name' label='项目名称' sortable></el-table-column>
                <el-table-column label='开始时间' sortable>
                    <template slot-scope="scope">
                        {{scope.row.beginDate | formatDate('YYYY-MM-DD')}}
                    </template>
                </el-table-column>
                <el-table-column label='结束时间' sortable>
                    <template slot-scope="scope">
                        {{scope.row.endDate | formatDate('YYYY-MM-DD')}}
                    </template>
                </el-table-column>
                <el-table-column prop='chargedBy' label='负责人' sortable></el-table-column>
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
            <el-pagination background layout="prev, pager, next, jumper"
                           :total="total" :page-size="pageSize" :current-page="currentPage"
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
        <project-dialog-component v-if="newDialogVisible" :visible="newDialogVisible" :project-id="selectedProject.id"
            @closeDialog="closeDialog"></project-dialog-component>
    </div>
</template>

<script>
  import { getMineProjects, deleteProject } from '@/api/ProjectResource'
  import ProjectDialogComponent from './ProjectDialogComponent'
  import VContainer from '../../components/container/VContainer'
export default {
    name: 'ProjectList',
    components: { VContainer, ProjectDialogComponent },
    data() {
      return {
        loading: true,
        projects: [],
        selectedProject: null,
        total: 0,
        pageSize: 10, // 单页数据量
        currentPage: 1, // 默认开始页面
        newDialogVisible: false,
        deleteDialogVisible: false
      }
    },
    created() {
      this.getProjects()
    },
    methods: {
      getProjects() {
        getMineProjects({ page: this.currentPage - 1, size: this.pageSize }).then(res => {
          this.loading = false
          this.projects = res.data
          this.total = this.projects.length
        })
      },
      currentChange: function(currentPage) {
        this.currentPage = currentPage
      },
      sizeChange: function(val) {
        this.pageSize = val
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
        this.newDialogVisible = true
      },
      deleteProject(project) {
        this.selectedProject = project
        this.deleteDialogVisible = true
      },
      newProject() {
        this.selectedProject = { id: null }
        this.newDialogVisible = true
      },
      confirmDelete() {
        deleteProject(this.selectedProject.id).then(res => {
          this.openMessage('项目删除成功', 'success')
          this.deleteDialogVisible = false
          this.loading = true
          this.getProjects()
        })
      },
      closeDialog(val) {
        this.newDialogVisible = false
        if (val.type === 'confirm') {
          this.loading = true
          this.getProjects()
        }
      },
      openMessage(message, type) {
        this.$message({
          message,
          type
        })
      }
    }
  }
</script>

<style scoped>

</style>
