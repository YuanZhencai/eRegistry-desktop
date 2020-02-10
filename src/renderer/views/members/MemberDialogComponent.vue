<template>
    <el-dialog title="创建或编辑成员" :visible.sync="editDialogVisible" @closed="closeDialog">
        <el-row :gutter="8">
            <el-col :span="8">
                <div>
                    <el-input v-model="login" size="mini" placeholder="用户名" suffix-icon="el-icon-search" @change="findUsers(value)"></el-input>
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
                        <span class="user-name text-ellipsis">{{user.login}},{{user.selected}}</span>
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
                    <el-form :inline="true" :rules="rules" ref="ruleForm" class="demo-form-inline">
                        <el-form-item prop="email">
                            <el-input v-model="email" size="mini" placeholder="电子邮箱"></el-input>
                        </el-form-item>
                        <el-form-item>
                            <el-button type="primary" size="mini" @click="invite()">马上邀请好友</el-button>
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
            <el-button size="mini" @click="deditDialogVisible = false">取 消</el-button>
            <el-button size="mini" type="primary" @click="editDialogVisible = false">确 定</el-button>
        </div>
    </el-dialog>
</template>

<script>
  export default {
    name: 'MemberDialogComponent',
    props: ['editDialogVisible'],
    data() {
      return {
        dialogIsShow: this.editDialogVisible,
        login: '',
        email: '',
        rules: {
          email: [
            { required: true, message: '电子邮箱不能为空', triggle: 'blur' },
            { type: 'email', message: '请输入正确的邮箱地址' }
          ]
        },
        projects: [],
        users: [],
        members: {},
        selectedUsers: [],
        projectId: 20016
      }
    },
    created() {
      this.findMembers()
      this.findProjects()
    },
    methods: {
      findProjects() {
        // 查找当前用户所创建的项目
        const data = [
          { createdBy: 'cassie', id: 20016, name: 'test', open: false, reportId: 20042 },
          { createdBy: 'jiangyn', id: 20008, name: 'test', open: false, chargedBy: 'jiangyn', reportId: 20029 },
          { createdBy: 'user', id: 20002, name: 'ALK', open: false, chargedBy: 'user', reportId: 20000 }
        ]
        for (let i = 0; i < data.length; i++) {
          const project = data[i]
          if (this.projectId !== project.id) {
            this.projects.push(project) // 用户参与的其他项目
          }
        }
      },
      findProjectUsers(projectId) {
        // 根据项目ID查找项目成员
        this.users = [{
          id: 20002,
          login: 'cassie',
          email: 'cassiexue@yopmail.com',
          activated: true,
          authorities: ['ROLE_USER']
        }, {
          createdBy: 'cassie',
          id: 20003,
          login: 'user'
        }, { createdBy: 'user', id: 20031, login: 'jiangyn', task: 'PATIENT' }]
        // for(let i = 0; i < this.users.length; i++){
        //   if(this.users[i].selected){
        //     this.selectedUsers.push(this.users[i])
        //   }
        // }
      },
      findMembers() {
        // 查找当前项目的成员
        this.members = {
          20032: { createdBy: 'user', id: 20032, username: 'jiangyn', task: 'PATIENT' },
          20003: { createdBy: 'cassie', id: 20003, username: 'user' }
        }
      },
      invite() {
      },
      selectUser(user) {
        user.selected = !user.selected
        // if(user.selected){
        //   this.selectedUsers.push(user)
        // }
      },
      remove(user) {
        user.selected = false
      },
      closeDialog() {
        this.$refs.ruleForm.resetFields()
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
}
.list-group > .list-group-item{
  border: 1px solid rgba(0,0,0,.125);
  padding: .25em 1em;
  margin-bottom: 1em;
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
</style>
