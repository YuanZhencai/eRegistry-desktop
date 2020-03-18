<template>
    <el-dialog title="创建或编辑任务" :visible.sync="visible" :before-close="cancel">
        <el-form label-width="80px" size="mini">
            <el-form-item label="成员">
                <el-input v-model="member.username" :disabled="true"></el-input>
            </el-form-item>
            <el-form-item label="任务">
                <el-select placeholder="选择任务" v-model="memberTask.type">
                    <el-option v-for="task in tasks" :key="task.value"
                               :label="task.label"
                               :value="task.value">
                    </el-option>
                </el-select>
            </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
            <el-button size="mini" @click="cancel">取 消</el-button>
            <el-button size="mini" type="primary" @click="confirm">确 定</el-button>
        </div>
    </el-dialog>
</template>

<script>
  import { createMemberTask, updateMemberTask, getTaskByMemberId } from '@/api/MemberTaskResource'
  import { getMember } from '@/api/MemberResource'
  export default {
    name: 'AssignTaskDialog',
    props: {
      visible: {
        type: Boolean
      },
      memberId: {
        type: Number
      }
    },
    data() {
      return {
        memberTask: { type: null },
        member: { username: null },
        tasks: [
          { label: '管理', value: 'MASTER' },
          { label: '录入', value: 'PATIENT' },
          { label: '审核', value: 'AUDIT' },
          { label: '查看', value: 'VIEW' }
        ]
      }
    },
    created() {
      this.findMember()
      this.findMemberTask()
    },
    methods: {
      findMember() {
        getMember(this.memberId).then(res => {
          this.member = res.data
        })
      },
      findMemberTask() {
        const vm = this
        getTaskByMemberId(this.memberId).then(res => {
          vm.memberTask = res.data
          if (!vm.memberTask || !vm.memberTask.type) {
            vm.memberTask = { type: null }
          }
        })
      },
      cancel() {
        this.$emit('closeDialog', { page: 'assignTask', type: 'cancel' })
      },
      closeDialog() {
        this.$emit('closeDialog', { page: 'assignTask', type: 'confirm' })
      },
      confirm() {
        this.memberTask.memberId = this.member.id
        this.memberTask.projectId = this.member.projectId
        if (this.memberTask.id !== undefined) {
          updateMemberTask(this.memberTask).then(response => {
            this.memberTask = response.data
            this.openMessage('任务更新成功', 'success')
            this.closeDialog()
          })
        } else {
          createMemberTask(this.memberTask).then(response => {
            this.memberTask = response.data
            this.openMessage('分配任务成功', 'success')
            this.closeDialog()
          })
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
