<template>
    <el-dialog
            title="撤回审核"
            width="30%"
            :visible.sync="dialogVisible"
            :before-close="handleClose">
        <div>确定撤回审核吗</div>
        <span slot="footer" class="dialog-footer">
            <el-button @click="handleClose">取 消</el-button>
            <el-button type="primary" @click="confirm">确 定</el-button>
        </span>
    </el-dialog>
</template>

<script>
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
      handleClose() {
        this.$emit('closeDialog', { page: 'withdrawalAudit' })
      },
      confirm() {}
    }
  }
</script>

<style scoped>

</style>
