<template>
    <el-dialog width="500px"
            title="审核变更申请"
            :visible.sync="dialogVisible"
            :before-close="cancel">
        <div class="dialog-body">
            <el-form :model="audit" :rules="rules" label-width="70px" ref="auditForm">
                <el-form-item label="状态" prop="state">
                    <el-radio-group v-model="audit.state" size="mini">
                        <el-radio-button label="CHANGE_APPROVE">同意</el-radio-button>
                        <el-radio-button label="CHANGE_REFUSE">拒绝</el-radio-button>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="原因" prop="opinion" v-if="audit.state === 'CHANGE_REFUSE'">
                    <el-input type="textarea" v-model="audit.opinion"></el-input>
                </el-form-item>
            </el-form>
        </div>
        <span slot="footer" class="dialog-footer">
            <el-button size="mini" @click="cancel">取 消</el-button>
            <el-button size="mini" type="primary" :disabled="isSaving" @click="confirm('auditForm')">确 定</el-button>
        </span>
    </el-dialog>
</template>

<script>
  import { changeAudit } from '@/api/AuditService'
  export default {
    name: 'AuditChangeDialog',
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
        isSaving: false,
        map: {
          'CHANGE_APPROVE': '同意',
          'CHANGE_REFUSE': '拒绝'
        },
        rules: {
          state: [
            { required: true, message: '请先审核', trigger: 'change' }
          ],
          opinion: [
            { required: true, message: '请填写数据变更原因', trigger: 'change' }
          ]
        }
      }
    },
    methods: {
      handleClose(type, audit) {
        this.$emit('closeDialog', { page: 'auditChange', type, audit })
      },
      cancel() {
        this.handleClose('cancel')
      },
      confirm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.isSaving = true
            changeAudit(this.audit).then(res => {
              this.isSaving = false
              this.handleClose('confirm', res.data)
            }, () => {
              this.isSaving = false
            })
          }
        })
      }
    }
  }
</script>

<style scoped>

</style>
