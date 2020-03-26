<template>
    <el-dialog title="创建或编辑任务" width="500px" :visible.sync="display" :before-close="close">
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
          { label: '查看', value: 'VIEW' }
        ],
        display: false,
        reject: null,
        resolve: null,
        memberId: null
      }
    },
    methods: {
      show(memberId) {
        const that = this
        this.memberId = memberId
        this.display = true
        this.findMember()
        this.findMemberTask()
        return new Promise((resolve, reject) => {
          that.resolve = resolve
          that.reject = reject
        })
      },
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
        this.display = false
        this.reject('cancel')
      },
      close() {
        this.display = false
        this.reject('close')
      },
      confirm() {
        const that = this
        this.memberTask.memberId = this.member.id
        this.memberTask.projectId = this.member.projectId
        if (this.memberTask.id !== undefined) {
          updateMemberTask(this.memberTask).then(response => {
            this.memberTask = response.data
            that.display = false
            that.resolve(response.data)
          })
        } else {
          createMemberTask(this.memberTask).then(response => {
            this.memberTask = response.data
            that.display = false
            that.resolve(response.data)
          })
        }
      }
    }
  }
</script>

<style scoped>

</style>
