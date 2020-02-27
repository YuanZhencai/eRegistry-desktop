<template>
    <el-dialog title="创建或编辑分中心" :visible.sync="visible" :before-close="closeDialog">
        <el-form label-width="80px">
            <el-form-item label="名称" prop="name"
                          :rules="{ required: true, message: '名称不能为空', trigger: 'blur' }"
            >
                <el-input v-model="center.name"></el-input>
            </el-form-item>
            <el-form-item label="电话" prop="telephone"
                          :rules="[
                            { required: true, message: '电话不能为空', trigger: 'blur' },
                            { required: true, pattern: /^((13|14|15|16|17|18)[0-9]{1}\d{8})|([0-9]{1}\d{7})$/, message: '请输入正确的电话号码', trigger: ['blur', 'change'] }
                          ]"
            >
                <el-input v-model="center.telephone" :maxlength="11"></el-input>
            </el-form-item>
            <el-form-item label="编号" prop="no" :rules="{ required: true, message: '编号不能为空', trigger: 'blur' }">
                <el-input v-model="center.no"></el-input>
            </el-form-item>
            <el-form-item label="负责人" prop="chargedBy" :rules="{ required: true, message: '负责人不能为空', trigger: 'blur' }">
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
            <el-button size="mini" @click="closeDialog">取 消</el-button>
            <el-button size="mini" type="primary" @click="confirm">保存</el-button>
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
      return {
        center: null,
        formRules: {
          name: [{ required: true, message: '名称不能为空', trigger: 'blur' }],
          telephone: [
            { required: true, message: '电话不能为空', trigger: 'blur' },
            { type: 'tel', message: '请输入正确的电话号码', trigger: 'blur' }
          ],
          no: [{ required: true, message: '编号不能为空', trigger: 'blur' }],
          chargedBy: [{ required: true, message: '负责人不能为空', trigger: 'blur' }]
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
          this.center = { name: '', telephone: '', no: '', chargedBy: '', projectId: 20002 }
        }
      },
      closeDialog() {
        this.$emit('closeDialog', 'centerDialog')
      },
      confirm() {
        if (this.centerId) {
          updateCenter(this.center).then(res => {
            console.log(res.data)
            this.openMessage('中心更新成功', 'success')
            this.closeDialog()
          })
        } else {
          createCenter(this.center).then(res => {
            console.log(res.data)
            this.openMessage('中心创建成功', 'success')
            this.closeDialog()
          })
        }
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
