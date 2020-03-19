<template>
    <el-dialog title="创建或编辑成员" :visible.sync="visible" :before-close="cancel">
        <el-row :gutter="8">
            <el-col :span="8">
                <div>
                    <el-input v-model="login" size="mini" placeholder="用户名" suffix-icon="el-icon-search" @change="findUsers(login)"></el-input>
                    <!--用户参与的其他所有项目-->
                    <ul class="list-group">
                        <li class="list-group-item" v-for="project in projects" :key="project.id" @click="findProjectUsers(project.id)">
                            {{project.name}}
                        </li>
                    </ul>
                </div>
            </el-col>
            <el-col :span="16" v-if="users.length > 0" class="text-center">
                <el-row :gutter="8">
                    <el-col :span="12" v-for="user in users" :key="user.id" style="margin-bottom: 5px;">
                      <!-- 非本项目成员 -->
                      <div class="user-avatar" v-if="!members[user.id]" @click="selectUser(user)" style="cursor: pointer">
                        <el-avatar size="small" icon="el-icon-user-solid" @error="() => {return true}">
                          <img src="user.imageUrl">
                        </el-avatar>
                        <span class="user-name text-ellipsis">{{user.login}}</span>
                        <div class="triangle" v-if="user.selected">
                            <i class="el-icon-check user-check"></i>
                        </div>
                      </div>
                      <!-- 是本项目成员 -->
                      <div class="user-avatar" v-if="members[user.id]" style="cursor: not-allowed;">
                        <el-avatar size="small" icon="el-icon-user-solid" @error="() => {return true}">
                          <img src="user.imageUrl">
                        </el-avatar>
                        <span class="user-name text-ellipsis">{{user.login}}</span>
                        <div class="disabled-triangle">
                          <i class="el-icon-check user-check"></i>
                        </div>
                      </div>
                    </el-col>
                </el-row>
            </el-col>
            <el-col :span="16" v-if="users.length === 0" class="text-center">
                <el-row><span>还不是用户，马上邀请注册？</span></el-row>
                <el-row>
                    <el-form :inline="true" :model="ruleForm" :rules="rules" ref="ruleForm" class="demo-form-inline">
                        <el-form-item prop="email">
                            <el-input v-model="ruleForm.email" size="mini" placeholder="电子邮箱"></el-input>
                        </el-form-item>
                        <el-form-item>
                            <el-button type="primary" size="mini" @click="inviteMember('ruleForm')">马上邀请好友</el-button>
                        </el-form-item>
                    </el-form>
                </el-row>
            </el-col>
        </el-row>
        <el-row>
            <el-col :span="24">
                <span>已选成员：</span>
                <template v-if="(users.filter(item => item.selected)).length > 0">
                    <el-tag v-for="user in users.filter(item => item.selected)" :key="user.login" closable @close="remove(user)">{{user.login}}</el-tag>
                </template>
                <template v-else>
                  <span>尚未选择任何人员</span>
                </template>
            </el-col>
        </el-row>
        <div slot="footer" class="dialog-footer">
            <el-button size="mini" @click="cancel">取 消</el-button>
            <el-button size="mini" type="primary" @click="confirm">确 定</el-button>
        </div>
    </el-dialog>
</template>

<script>
  import { getMineProjects, getProjectUsers } from '@/api/ProjectService'
  import { createBatchMember } from '@/api/MemberService'
  import { getUsersByLoginStartingWith } from '@/api/UserService'
  import { createInvitation } from '@/api/InvitationService'

  export default {
    name: 'MemberDialogComponent',
    props: ['visible'],
    data() {
      const projectId = Number(this.$route.params.projectId)
      return {
        login: '',
        ruleForm: {
          email: null
        },
        rules: {
          email: [
            { type: 'email', message: '请输入正确的邮箱地址', trigger: 'blur' }
          ]
        },
        projects: [],
        users: [],
        members: {},
        selectedUsers: [],
        projectId
      }
    },
    created() {
      this.findProjectMembers()
      this.findProjects()
    },
    methods: {
      // 根据输入查找用户
      findUsers(login) {
        this.users = []
        getUsersByLoginStartingWith(login).then(response => {
          this.users = response.data
        })
      },
      findProjects() {
        const vm = this
        // 查找当前用户所创建的项目
        getMineProjects().then(response => {
          const data = response.data
          for (let i = 0; i < data.length; i++) {
            const project = data[i]
            if (vm.projectId !== project.id) {
              vm.projects.push(project) // 用户参与的其他项目
            }
          }
        })
      },
      findProjectUsers(projectId) {
        // 根据项目ID查找项目成员
        getProjectUsers(projectId).then(response => {
          this.users = response.data
        }, error => {
          console.log(error)
        })
      },
      findProjectMembers() {
        // 查找当前项目的成员
        const vm = this
        getProjectUsers(this.projectId).then(response => {
          response.data.forEach((member) => {
            // vm.members[member.id] = member
            this.$set(vm.members, member.id, member)
          })
        })
      },
      inviteMember(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            createInvitation({
              projectId: this.projectId,
              email: this.ruleForm.email
            }).then(() => {
              this.$message({
                message: '邀请已发送到对方邮箱中,请耐心等待对方回复',
                type: 'success'
              })
            })
          }
        })
      },
      selectUser(user) {
        this.$forceUpdate()
        if (user.selected) {
          this.$set(user, 'selected', false)
        } else {
          this.$set(user, 'selected', true)
        }
      },
      remove(user) {
        this.$set(user, 'selected', false)
      },
      cancel() {
        this.$emit('closeDialog', { page: 'memberDialog', type: 'cancel' })
      },
      closeDialog() {
        this.$emit('closeDialog', { page: 'memberDialog', type: 'confirm' })
      },
      confirm() {
        this.selectedUsers = this.users.filter(item => item.selected)
        const batchMember = {
          projectId: this.projectId,
          users: this.selectedUsers
        }
        createBatchMember(batchMember).then((response) => {
          this.$message({
            message: '成员添加成功',
            type: 'success'
          })
          this.closeDialog()
        }, () => {
          this.$message({
            message: '成员添加失败',
            type: 'error'
          })
        })
      }
    }
  }
</script>

<style scoped>
.text-center{
    text-align: center;
}
.el-dialog__header {
    border-bottom: 1px solid #e9ecef;
}
.list-group{
  list-style: none;
  padding: 0;
  margin-top: .5em
}
.list-group > .list-group-item{
  border: 1px solid rgba(0,0,0,.125);
  padding: .25em 1em;
  margin-bottom: .5em;
}
.user-avatar {
  position: relative;
  border: 1px dashed;
  text-align: left;
}
.user-avatar .user-name{
  display: inline-block;
  line-height: 28px;
  margin-left: 5px;
}
.text-ellipsis{
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.triangle, .disabled-triangle{
  float: right;
  width: 0;
  height: 0;
  border-style: solid;
  border-width: 0 26px 26px 0;
}
.disabled-triangle{
  border-color: transparent #d9d9d9 transparent transparent;
}
.triangle{
  border-color: transparent #a1cf64 transparent transparent;
}
.user-check{
  color: #fff;
  position: absolute;
  right: 2px;
  font-weight: 600;
}
.el-tag + .el-tag{
    margin-left: 10px;
}
</style>
