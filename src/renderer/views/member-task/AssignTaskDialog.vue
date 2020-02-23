<template>
    <el-dialog title="创建或编辑任务" :visible.sync="visible" :before-close="closeDialog">
        <el-form label-width="80px">
            <el-form-item label="成员">
                <el-input v-model="member.username" :disabled="true"></el-input>
            </el-form-item>
            <el-form-item label="任务">
                <el-select placeholder="分配任务" v-model="member.task">
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
  import { assignMemberTask, updateMemberTask } from '@/api/MemberTaskResource'
  export default {
    name: 'AssignTaskDialog',
    props: {
      visible: {
        type: Boolean
      },
      member: {
        type: Object
      }
    },
    data() {
      return {
        memberTask: null,
        tasks: [
          { label: '管理', value: 'MASTER' },
          { label: '录入', value: 'PATIENT' },
          { label: '审核', value: 'AUDIT' },
          { label: '查看', value: 'VIEW' }
        ]
      }
    },
    created() {
      this.memberTask = this.member.task
    },
    methods: {
      closeDialog() {
        this.$emit('closeDialog', 'assignTask')
      },
      confirm() {
        if (this.memberTask) {
          updateMemberTask(this.member).then(response => {})
        } else {
          assignMemberTask(this.member).then(response => {})
        }
      }
    }
  }
</script>

<style scoped>

</style>
