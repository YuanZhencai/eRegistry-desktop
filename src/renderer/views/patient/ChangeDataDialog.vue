<template>
    <el-dialog
            title="申请数据变更"
            :visible.sync="dialogVisible"
            :before-close="handleClose">
        <el-form :model="form" :rules="rules" label-width="70px">
            <el-form-item label="原因" prop="opinion">
                <el-input type="textarea" v-model="form.opinion"></el-input>
            </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
            <el-button @click="handleClose">取 消</el-button>
            <el-button type="primary" @click="confirm">确 定</el-button>
        </span>
    </el-dialog>
</template>

<script>
  import { changeAudit } from '@/api/AuditService'
  export default {
    name: 'ChangeDataDialog',
    props: {
      dialogVisible: {
        type: Boolean
      },
      audit: {
        type: Object
      }
    },
    data() {
      return {
        form: {
          opinion: ''
        },
        rules: {
          opinion: [
            { required: true, message: '请填写数据变更原因', trigger: 'blur' }
          ]
        }
      }
    },
    methods: {
      handleClose() {
        this.$emit('closeDialog', { page: 'changeData' })
      },
      confirm() {
        const audit = Object.assign({}, this.audit, this.form)
        changeAudit(audit).then(res => {
          console.log(res.data)
          this.$message({
            message: '申请数据变更成功',
            type: 'success'
          })
          this.handleClose()
        })
      }
    }
  }
</script>

<style scoped>

</style>
