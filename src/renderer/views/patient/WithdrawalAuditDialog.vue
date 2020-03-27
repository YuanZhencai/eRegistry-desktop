<template>
    <el-dialog width="500px"
            title="撤回审核"
            :visible.sync="dialogVisible"
            :before-close="handleClose">
        <div>确定撤回审核吗</div>
        <span slot="footer" class="dialog-footer">
            <el-button size="mini" @click="handleClose">取 消</el-button>
            <el-button size="mini" type="primary" @click="confirm">确 定</el-button>
        </span>
    </el-dialog>
</template>

<script>
  import { withdrawalAudit } from '@/api/AuditService'
  export default {
    name: 'WithdrawalAuditDialog',
    props: {
      dialogVisible: {
        type: Boolean
      },
      audit: {
        type: Object
      }
    },
    data() {
      return {}
    },
    methods: {
      handleClose(type, audit) {
        this.$emit('closeDialog', { page: 'withdrawalAudit', type, audit })
      },
      cancel() {
        this.handleClose('cancel')
      },
      confirm() {
        withdrawalAudit(this.audit).then(res => {
          this.handleClose('confirm', res.data)
        })
      }
    }
  }
</script>

<style scoped>

</style>
