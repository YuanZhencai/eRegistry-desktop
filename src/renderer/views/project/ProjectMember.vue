<template>
  <div class='app-container'>
    <el-row>
      <el-col :span='24'>
        <el-button type='primary' class='float-right' @click="newMember()">添加成员</el-button>
      </el-col>
    </el-row>
    <el-row>
      <el-table v-loading="loading" stripe
                :data='members.slice((currentPage-1)*pageSize, currentPage*pageSize)'
                :default-sort="{prop: 'id', order: 'descending'}" style='width: 100%'>
        <el-table-column prop='id' label='ID' width='180' sortable></el-table-column>
        <el-table-column label='用户名' width='180' sortable>
          <template slot-scope="scope">
            {{scope.row.username}}
            <span v-if="project && scope.row.username === project.chargedBy">(负责人)</span>
          </template>
        </el-table-column>
        <el-table-column prop='centerName' label='所属中心' sortable></el-table-column>
        <el-table-column label='任务'>
          <template slot-scope="scope">{{ taskType[scope.row.task] }}</template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button type="text" @click="assignCenter(scope.row)">分配中心</el-button>
            <el-divider direction="vertical"></el-divider>
            <el-button type="text" @click="assignTask(scope.row)">分配任务</el-button>
            <el-divider direction="vertical"></el-divider>
            <el-button type="text" @click="deleteMember(scope.row)">删除</el-button>
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
    <el-dialog v-if="deleteMemberDialogVisible" title="确认删除成员"
               :visible.sync="deleteMemberDialogVisible" :before-close="closeDialog">
      <span>是否确认删除成员 '{{this.selectedMember.username}}'？</span>
      <span slot="footer" class="dialog-footer">
                <el-button @click="deleteMemberDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="confirmDelete">删 除</el-button>
            </span>
    </el-dialog>
    <member-dialog-component :visible="newMemberDialogVisible"
                             @closeDialog="closeDialog"></member-dialog-component>
    <assign-member-dialog v-if="assignCenterDialogVisible" :visible="assignCenterDialogVisible"
                          :member-id="selectedMember.id"
                          @closeDialog="closeDialog"></assign-member-dialog>
    <assign-task-dialog v-if="assignTaskDialogVisible" :visible="assignTaskDialogVisible"
                        :member-id="selectedMember.id"
                        @closeDialog="closeDialog"></assign-task-dialog>
  </div>
</template>

<script>
  import { getProjectMembers, deleteMember } from '@/api/MemberResource'
  import { getProject } from '@/api/ProjectResource'
  import { isAuthenticated } from '@/api/AccountService'
  import MemberDialogComponent from '../member/MemberDialogComponent'
  import AssignMemberDialog from '../center-member/AssignMemberDialog'
  import AssignTaskDialog from '../member-task/AssignTaskDialog'

  export default {
    components: { AssignTaskDialog, AssignMemberDialog, MemberDialogComponent },
    data() {
      const projectId = this.$route.params.projectId
      return {
        loading: true,
        members: [],
        selectedMember: null,
        project: { id: projectId, name: null, open: null, reportId: null },
        currentAccount: { id: 4, login: 'user' },
        total: 0,
        pageSize: 10, // 单页数据量
        currentPage: 1, // 默认开始页面
        taskType: {
          null: '',
          PATIENT: '录入',
          MASTER: '管理',
          AUDIT: '审核',
          VIEW: '查看',
          ADMIN: '负责人'
        },
        deleteMemberDialogVisible: false,
        newMemberDialogVisible: false,
        assignCenterDialogVisible: false,
        assignTaskDialogVisible: false
      }
    },
    created() {
      this.getMembers(this.project.id)
      this.findProject(this.project.id)
      isAuthenticated().then(res => {
        console.log(res)
      })
    },
    methods: {
      findProject(projectId) {
        getProject(projectId).then((response) => {
          this.project = response.data
        }, (error) => {
          console.log(error)
        })
      },
      getMembers(projectId) {
        getProjectMembers(projectId, { page: this.currentPage - 1, size: this.pageSize }).then(
          (response) => {
            this.loading = false
            this.members = response.data
            this.total = this.members.length
          }, (error) => {
            this.loading = false
            console.log(error)
          })
      },
      currentChange: function(currentPage) {
        this.currentPage = currentPage
      },
      sizeChange: function(val) {
        this.pageSize = val
      },
      newMember() {
        this.newMemberDialogVisible = true
      },
      assignCenter(member) {
        this.selectedMember = member
        this.assignCenterDialogVisible = true
      },
      assignTask(member) {
        this.selectedMember = member
        this.assignTaskDialogVisible = true
      },
      deleteMember(member) {
        this.selectedMember = member
        this.deleteMemberDialogVisible = true
      },
      confirmDelete() {
        deleteMember(this.selectedMember.id).then(response => {
          this.openMessage('成员删除成功', 'success')
          this.closeDialog()
          this.loading = true
          this.getMembers(this.project.id)
        }, error => {
          console.log(error)
        })
      },
      closeDialog(val) {
        switch (val.page) {
          case 'memberDialog':
            this.newMemberDialogVisible = false
            break
          case 'assignMember':
            this.assignCenterDialogVisible = false
            if (val.type === 'confirm') {
              this.loading = true
              this.getMembers(this.project.id)
            }
            break
          case 'assignTask':
            this.assignTaskDialogVisible = false
            if (val.type === 'confirm') {
              this.loading = true
              this.getMembers(this.project.id)
            }
            break
          default:
            this.deleteMemberDialogVisible = false
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

