<template>
    <el-dialog
            title="申请数据变更"
            width="30%"
            :visible.sync="dialogVisible"
            :before-close="handleClose">
        <div slot="title" class="dialog-header">
            <h4>
                <span v-if="audit.type === 'PATIENT_CASE'">审核病例</span>
                <span v-if="audit.type === 'FOLLOW'">审核随访</span>
            </h4>
        </div>
        <div class="dialog-body">
            <el-form :model="audit" :rules="rules" label-width="70px">
                <el-form-item label="状态" prop="state">
                    <el-radio-group v-model="audit.state" size="mini">
                        <el-radio-button label="APPROVE">同意</el-radio-button>
                        <el-radio-button label="REFUSE">拒绝</el-radio-button>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="原因" prop="opinion" v-if="audit.state === 'REFUSE'">
                    <el-input type="textarea" v-model="audit.opinion"></el-input>
                </el-form-item>
            </el-form>
        </div>
        <span slot="footer" class="dialog-footer">
            <el-button @click="handleClose">取 消</el-button>
            <el-button type="primary" @click="confirm">确 定</el-button>
        </span>
    </el-dialog>
</template>

<script>
  import { recordAudit } from '@/api/AuditService'
  export default {
    name: 'RecordAuditDialog',
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
        form: {},
        rules: {
          state: [
            { required: true, message: '请先审核', trigger: 'blur' }
          ],
          opinion: [
            { required: true, message: '请填写拒绝原因', trigger: 'blur' }
          ]
        }
      }
    },
    methods: {
      handleClose() {
        this.$emit('closeDialog', { page: 'recordAudit' })
      },
      confirm() {
        recordAudit(this.audit).then(res => {
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
