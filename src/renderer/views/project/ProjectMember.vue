<template>
    <div class='app-container'>
        <el-row>
            <el-col :span='24'>
                <el-button type='primary' class='float-right' @click="newMember()">添加成员</el-button>
            </el-col>
        </el-row>
        <el-row>
            <el-table stripe :data='members.slice((currentPage-1)*pageSize, currentPage*pageSize)'
                      :default-sort = "{prop: 'id', order: 'descending'}" style='width: 100%'>
                <el-table-column prop='id' label='ID' width='180' sortable></el-table-column>
                <el-table-column prop='username' label='用户名' width='180' sortable></el-table-column>
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
                        <el-button type="text" @click="deleteMemberDialogVisible=true">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <el-pagination background layout="total, sizes, prev, pager, next, jumper"
                           :total="total" :page-size="pageSize" :page-sizes="[10,20,30,40,50]" :current-page="currentPage"
                           @current-change="currentChange" @size-change="sizeChange" class="pagination">
            </el-pagination>
        </el-row>
        <el-dialog title="确认删除成员" :visible.sync="deleteMemberDialogVisible" :before-close="closeDialog">
            <span>是否确认删除成员？</span>
            <span slot="footer" class="dialog-footer">
                <el-button @click="deleteMemberDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="deleteMemberDialogVisible = false">确 定</el-button>
            </span>
        </el-dialog>
        <member-dialog-component :visible="newMemberDialogVisible" @closeDialog="closeDialog"></member-dialog-component>
        <assign-member-dialog v-if="assignCenterDialogVisible" :visible="assignCenterDialogVisible" :center-member="selectedMember"
                              @closeDialog="closeDialog"></assign-member-dialog>
        <assign-task-dialog v-if="assignTaskDialogVisible" :visible="assignTaskDialogVisible" :member="selectedMember"
                            @closeDialog="closeDialog"></assign-task-dialog>
    </div>
</template>

<script>
  // import axios from 'axios'
  import MemberDialogComponent from '../member/MemberDialogComponent'
  import AssignMemberDialog from '../center-member/AssignMemberDialog'
  import AssignTaskDialog from '../member-task/AssignTaskDialog'
  export default {
    components: { AssignTaskDialog, AssignMemberDialog, MemberDialogComponent },
    data() {
      return {
        members: [],
        selectedMember: null,
        project: { id: 20002, name: 'ALK', open: false, reportId: 20000 },
        total: null,
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
    },
    methods: {
      handleClose(done) {
        this.$confirm('确认关闭？')
          .then(_ => {
            done()
          })
          .catch(_ => {})
      },
      getMembers(id) {
        // axios.get(`https://192.168.3.247:20002/api/projects/${id}/members`)
        //   .then((response) => {
        //     console.log('success')
        //   }, (error) => {
        //     console.log(error)
        //   })
        this.members = [
          { id: 20032, username: 'jiangyn', task: 'PATIENT' },
          { id: 20032, username: 'user' }
        ]
        this.total = this.members.length
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
      closeDialog(val) {
        switch (val) {
          case 'memberDialog':
            this.newMemberDialogVisible = false
            break
          case 'assignMember':
            this.assignCenterDialogVisible = false
            break
          case 'assignTask':
            this.assignTaskDialogVisible = false
            break
          default:
            this.deleteMemberDialogVisible = false
            break
        }
      }
    }
  }
</script>

<style scoped>
    .float-right{
        float: right;
    }
    table th{
        background-color: #f2f2f2;
    }
    .pagination{
        margin-top: 10px;
        text-align: center;
    }
</style>

