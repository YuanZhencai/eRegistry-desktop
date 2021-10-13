<template>
  <el-dialog title="创建或编辑角色"
             width="500px"
             :visible.sync="display"
             :before-close="close">
    <el-form label-width="80px"
             size="mini">
      <el-form-item label="成员">
		  {{nickname || member.username}}
      </el-form-item>
      <el-form-item label="角色">
        <el-select placeholder="选择角色"
                   v-model="memberTask.type">
          <el-option v-for="task in tasks"
                     :key="task.value"
                     :label="task.label"
                     :value="task.value">
          </el-option>
        </el-select>
      </el-form-item>
    </el-form>
    <div slot="footer"
         class="dialog-footer">
      <el-button size="mini"
                 @click="cancel">取 消</el-button>
      <el-button size="mini"
                 type="primary"
                 :disabled="isSaving"
                 @click="confirm">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { createMemberTask, updateMemberTask, getTaskByMemberId } from '@/api/MemberTaskService'
import { getMember } from '@/api/MemberService'
export default {
  name: 'AssignTaskDialog',
  data() {
    return {
      memberTask: { type: null },
      member: { username: null },
      tasks: [
        { label: '管理', value: 'MASTER' },
        { label: '录入', value: 'PATIENT' },
        { label: '审核', value: 'AUDIT' },
        { label: '查看', value: 'VIEW' },
        { label: '主任', value: 'DIRECTOR' },
        { label: '医生', value: 'DOCTOR' },
        { label: '随访专员', value: 'FOLLOWER' }
      ],
      display: false,
      reject: null,
      resolve: null,
      memberId: null,
      nickname: null,
      isSaving: false
    }
  },
  methods: {
    show(member) {
      this.memberId = member.id
      this.nickname = member.nickname
      this.display = true
      this.findMember()
      this.findMemberTask()
      return new Promise((resolve, reject) => {
        this.resolve = resolve
        this.reject = reject
      })
    },
    findMember() {
      getMember(this.memberId).then(res => {
        this.member = res.data
      })
    },
    findMemberTask() {
      getTaskByMemberId(this.memberId).then(res => {
        this.memberTask = res.data
        if (!this.memberTask || !this.memberTask.type) {
          this.memberTask = { type: null }
        }
      })
    },
    cancel() {
      this.display = false
      this.reject('cancel')
    },
    close() {
      this.display = false
      this.reject('close')
    },
    confirm() {
      this.memberTask.memberId = this.member.id
      this.memberTask.projectId = this.member.projectId
      this.isSaving = true
      if (this.memberTask.id !== undefined) {
        updateMemberTask(this.memberTask).then(response => {
          this.isSaving = false
          this.memberTask = response.data
          this.display = false
          this.resolve(response.data)
        }, () => {
          this.isSaving = false
        })
      } else {
        createMemberTask(this.memberTask).then(response => {
          this.isSaving = false
          this.memberTask = response.data
          this.display = false
          this.resolve(response.data)
        }, () => {
          this.isSaving = false
        })
      }
    }
  }
}
</script>

<style scoped>
</style>
