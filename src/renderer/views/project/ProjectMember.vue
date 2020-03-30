<template>
  <div>
    <el-row v-if="$hasAnyAuthority(['PROJECT_ADMIN_' + projectId, 'PROJECT_MASTER_' + projectId])">
      <el-col :span='24'>
        <el-button type='primary' class='float-right' size="mini" @click="newMember()">添加成员</el-button>
      </el-col>
    </el-row>
    <el-row>
      <el-table v-loading="loading" stripe
                :data='members'
                @sort-change="changeOrder" style='width: 100%'>
        <el-table-column prop='id' label='ID' sortable="custom" width="80"></el-table-column>
        <el-table-column prop="username" label='用户名' sortable="custom">
          <template slot-scope="scope">
            {{scope.row.username}}
            <span v-if="project && scope.row.username === project.chargedBy">(负责人)</span>
          </template>
        </el-table-column>
        <el-table-column prop='centerName' label='所属中心' sortable="custom"></el-table-column>
        <el-table-column label='任务'>
          <template slot-scope="scope">{{ taskType[scope.row.task] }}</template>
        </el-table-column>
        <el-table-column label="操作" v-if="$hasAnyAuthority(['PROJECT_ADMIN_' + projectId, 'PROJECT_MASTER_' + projectId])">
          <template slot-scope="scope" v-if="project && scope.row.username !== project.chargedBy && name !== scope.row.username">
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
      <el-pagination background layout="total, prev, pager, next, jumper"
                     :total="total" :page-size="pageSize" :current-page="currentPage"
                     @current-change="currentChange" class="pagination">
      </el-pagination>
    </el-row>
    <el-dialog v-if="deleteMemberDialogVisible" title="确认删除成员" width="500px"
               :visible.sync="deleteMemberDialogVisible" :before-close="cancelDelete">
      <span>是否确认删除成员 '{{this.selectedMember.username}}'？</span>
      <span slot="footer" class="dialog-footer">
                <el-button @click="cancelDelete">取 消</el-button>
                <el-button type="primary" :disabled="isSaving" @click="confirmDelete">删 除</el-button>
            </span>
    </el-dialog>
    <member-dialog-component ref="add-member-dialog"></member-dialog-component>
    <assign-member-dialog ref="assign-member-dialog"></assign-member-dialog>
    <assign-task-dialog ref="assign-task-dialog"></assign-task-dialog>
  </div>
</template>

<script>
  import { mapGetters } from 'vuex'
  import { getProjectMembers, deleteMember } from '@/api/MemberService'
  import { getProject } from '@/api/ProjectService'
  import MemberDialogComponent from '../member/MemberDialogComponent'
  import AssignMemberDialog from '../center-member/AssignMemberDialog'
  import AssignTaskDialog from '../member-task/AssignTaskDialog'

  export default {
    components: { AssignTaskDialog, AssignMemberDialog, MemberDialogComponent },
    computed: {
      ...mapGetters([
        'name'
      ])
    },
    data() {
      const projectId = this.$route.params.projectId
      return {
        loading: true,
        isSaving: false,
        predicate: '',
        order: '',
        sortPropMap: {
          id: 'm.id',
          username: 'm.username',
          centerName: 'center.name'
        },
        members: [],
        selectedMember: {},
        projectId,
        project: { id: projectId, name: null, open: null, reportId: null },
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
        deleteMemberDialogVisible: false
      }
    },
    created() {
      this.getMembers()
      this.findProject(this.projectId)
    },
    methods: {
      sort() {
        return (this.predicate && this.order) ? this.sortPropMap[this.predicate] + ',' + (this.order === 'ascending' ? 'asc' : 'desc') : null
      },
      changeOrder(sort) {
        this.predicate = sort.prop
        this.order = sort.order
        this.getMembers()
      },
      findProject(projectId) {
        getProject(projectId).then((response) => {
          this.project = response.data
        }, (error) => {
          console.log(error)
        })
      },
      getMembers() {
        this.loading = true
        getProjectMembers(this.projectId, {
          page: this.currentPage - 1,
          size: this.pageSize,
          sort: this.sort()
        }).then((response) => {
          this.loading = false
          this.members = response.data
          this.total = Number(response.headers['x-total-count'])
        })
      },
      currentChange: function(currentPage) {
        this.currentPage = currentPage
        this.getMembers()
      },
      newMember() {
        this.$refs['add-member-dialog'].show().then((res) => {
          this.loading = true
          this.getMembers()
        }, () => {})
      },
      assignCenter(member) {
        this.selectedMember = member
        this.$refs['assign-member-dialog'].show(this.selectedMember.id).then(() => {
          this.loading = true
          this.getMembers()
        }, () => {})
      },
      assignTask(member) {
        this.selectedMember = member
        this.$refs['assign-task-dialog'].show(this.selectedMember.id).then(() => {
          this.loading = true
          this.getMembers()
        }, () => {})
      },
      deleteMember(member) {
        this.selectedMember = member
        this.deleteMemberDialogVisible = true
      },
      confirmDelete() {
        this.isSaving = true
        deleteMember(this.selectedMember.id).then(response => {
          this.isSaving = false
          this.loading = true
          this.getMembers()
        }, () => {
          this.isSaving = false
        })
      },
      cancelDelete() {
        this.deleteMemberDialogVisible = false
      }
    }
  }
</script>

<style scoped>

</style>

