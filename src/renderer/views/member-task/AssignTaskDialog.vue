<template>
    <el-dialog title="创建或编辑任务" :visible.sync="visible" :before-close="closeDialog">
        <el-form label-width="80px">
            <el-form-item label="成员">
                <el-input v-model="member.username" :disabled="true"></el-input>
            </el-form-item>
            <el-form-item label="任务">
                <el-select placeholder="分配任务" v-model="memberTask.type">
                    <el-option v-for="task in tasks" :key="task.value"
                               :label="task.label"
                               :value="task.value">
                    </el-option>
                </el-select>
            </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
            <el-button size="mini" @click="closeDialog">取 消</el-button>
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
        memberTask: null,
        member: null,
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
        getTaskByMemberId(this.memberId).then(res => {
          this.memberTask = res.data
          if (this.memberTask == null) {
            this.memberTask = {}
          }
        })
      },
      closeDialog() {
        this.$emit('closeDialog', 'assignTask')
      },
      confirm() {
        this.memberTask.memberId = this.member.id
        this.memberTask.projectId = this.member.projectId
        if (this.memberTask.id !== undefined) {
          updateMemberTask(this.memberTask).then(response => {
            this.memberTask = response.data
            this.closeDialog()
          })
        } else {
          createMemberTask(this.memberTask).then(response => {
            this.memberTask = response.data
            this.closeDialog()
          })
        }
      }
    }
  }
</script>

<style scoped>

</style>
