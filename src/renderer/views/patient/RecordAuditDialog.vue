<template>
    <el-dialog width="500px"
            :visible.sync="dialogVisible"
            :before-close="cancel">
        <div slot="title" class="dialog-header">
            <h4>
                <span v-if="audit">{{map[audit.type]}}</span>
            </h4>
        </div>
        <div class="dialog-body">
            <el-form :model="audit" :rules="rules" label-width="70px" ref="auditForm">
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
            <el-button size="mini" @click="cancel">取 消</el-button>
            <el-button size="mini" type="primary" @click="confirm('auditForm')">确 定</el-button>
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
        map: {
          'PATIENT_CASE': '审核病例',
          'FOLLOW': '审核随访',
          'APPROVE': '通过',
          'REFUSE': '拒绝'
        },
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
      handleClose(type, audit) {
        this.$emit('closeDialog', { page: 'recordAudit', type, audit })
      },
      cancel() {
        this.handleClose('cancel')
      },
      confirm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            recordAudit(this.audit).then(res => {
              this.handleClose('confirm', res.data)
            })
          }
        })
      }
    }
  }
</script>

<style scoped>

</style>
