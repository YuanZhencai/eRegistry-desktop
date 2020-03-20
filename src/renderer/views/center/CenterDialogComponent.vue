<template>
    <el-dialog title="创建或编辑分中心" :visible.sync="display" :before-close="close">
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
  import { getCenter, createCenter, updateCenter } from '@/api/CenterService'
  export default {
    name: 'CenterDialogComponent',
    data() {
      const projectId = this.$route.params.projectId
      return {
        centerId: null,
        display: false,
        reject: null,
        resolve: null,
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
    methods: {
      show(centerId) {
        const that = this
        this.centerId = centerId
        this.display = true
        this.getCenter()
        return new Promise((resolve, reject) => {
          that.resolve = resolve
          that.reject = reject
        })
      },
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
        this.display = false
        this.reject('cancel')
      },
      close() {
        this.display = false
        this.reject('close')
      },
      confirm(formName) {
        const that = this
        this.$refs[formName].validate((valid) => {
          if (valid) {
            if (this.centerId) {
              updateCenter(this.center).then(res => {
                that.display = false
                that.resolve(res.data)
              })
            } else {
              createCenter(this.center).then(res => {
                that.display = false
                that.resolve(res.data)
              })
            }
          }
        })
      }
    }
  }
</script>

<style scoped>

</style>
