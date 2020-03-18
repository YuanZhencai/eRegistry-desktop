<template>
    <el-dialog title="创建或编辑分中心" :visible.sync="visible" :before-close="cancel">
        <el-form label-width="80px" :model="center" :rules="rules" ref="centerForm" size="mini">
            <el-form-item label="名称" prop="name">
                <el-input v-model="center.name"></el-input>
            </el-form-item>
            <el-form-item label="电话" prop="telephone">
                <el-input v-model="center.telephone" :maxlength="11"></el-input>
            </el-form-item>
            <el-form-item label="编号" prop="no">
                <el-input v-model="center.no"></el-input>
            </el-form-item>
            <el-form-item label="负责人" prop="chargedBy">
                <el-input v-model="center.chargedBy"></el-input>
            </el-form-item>
            <el-form-item label="邮箱" >
                <el-input v-model="center.email"></el-input>
            </el-form-item>
            <el-form-item label="邮编">
                <el-input v-model="center.zipCode"></el-input>
            </el-form-item>
            <el-form-item label="地址">
                <el-input v-model="center.address"></el-input>
            </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
            <el-button size="mini" @click="cancel">取 消</el-button>
            <el-button size="mini" type="primary" @click="confirm('centerForm')">保存</el-button>
        </div>
    </el-dialog>
</template>

<script>
  import { getCenter, createCenter, updateCenter } from '@/api/CenterResource'
  export default {
    name: 'CenterDialogComponent',
    props: {
      visible: {
        type: Boolean
      },
      centerId: {
        type: Number
      }
    },
    data() {
      const projectId = this.$route.params.projectId
      return {
        projectId,
        center: {},
        rules: {
          name: [
            { required: true, message: '名称不能为空', trigger: 'blur' }
          ],
          telephone: [
            { required: true, message: '电话不能为空', trigger: 'blur' },
            { pattern: /^(1(3|4|5|6|7|8|9)\d{9})$/, message: '手机号码有误，请重填', trigger: 'blur' }
          ],
          no: [
            { required: true, message: '编号不能为空', trigger: 'blur' }
          ],
          chargedBy: [
            { required: true, message: '负责人不能为空', trigger: 'blur' }
          ]
        }
      }
    },
    created() {
      this.getCenter()
    },
    methods: {
      getCenter() {
        if (this.centerId) {
          getCenter(this.centerId).then(res => {
            this.center = res.data
          })
        } else {
          this.center = { name: '', telephone: '', no: '', chargedBy: '', projectId: this.projectId }
        }
      },
      cancel() {
        this.$emit('closeDialog', { page: 'centerDialog', type: 'cancel' })
      },
      closeDialog() {
        this.$emit('closeDialog', { page: 'centerDialog', type: 'confirm' })
      },
      confirm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            if (this.centerId) {
              updateCenter(this.center).then(res => {
                this.openMessage('中心更新成功', 'success')
                this.closeDialog()
              })
            } else {
              createCenter(this.center).then(res => {
                this.openMessage('中心创建成功', 'success')
                this.closeDialog()
              })
            }
          }
        })
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
