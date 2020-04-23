<template>
  <div>
    <el-row :gutter="20">
      <el-col :span="12"
              :offset="6">
        <div class="text-center">
          <h2>
            用户设置
          </h2>
        </div>
        <el-card class="box-card">
          <div slot="header"
               class="clearfix">
            <span>个人信息</span>
          </div>
          <template>
            <el-form label-width="80px"
                     label-position="top"
                     :model="settingsAccount"
                     :rules="rules"
                     ref="ruleMessageForm">
              <el-form-item label="用户头像:"
                            inline="false">
                <el-upload class="avatar-uploader"
                           action=""
                           :auto-upload="true"
                           :show-file-list="false"
                           :on-success="handleAvatarSuccess"
                           :before-upload="beforeAvatarUpload"
                           :http-request="httpRequest">
                  <img v-if="imageUrl"
                       :src="imageUrl"
                       class="avatar">
                  <i v-else
                     class="el-icon-plus avatar-uploader-icon">
                  </i>
                </el-upload>
              </el-form-item>
              <el-row>
                <el-col :span="12">
                  <el-form-item label="名字"
                                prop="firstName">
                    <el-input size="small"
                              style="width:80%"
                              v-model="settingsAccount.firstName"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="姓氏"
                                prop="lastName">
                    <el-input style="width:80%"
                              size="small"
                              v-model="settingsAccount.lastName"></el-input>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-form-item label="电子邮件"
                            prop="email">
                <el-input size="small"
                          style="width:90%"
                          v-model="settingsAccount.email"></el-input>
              </el-form-item>
              <el-button size="small"
                         type="primary"
                         @click="save('ruleMessageForm')">保存</el-button>
            </el-form>
          </template>
        </el-card>
        <el-card class="box-card">
          <div slot="header"
               class="clearfix">
            <span>重置密码</span>
          </div>
          <template>
            <el-form :model="rulePassForm"
                     status-icon
                     :rules="rulesPassword"
                     ref="ruleForm"
                     label-width="100px"
                     class="demo-ruleForm">
              <el-form-item label="密码"
                            prop="pass">
                <el-input type="password"
                          v-model="rulePassForm.pass"
                          autocomplete="off"></el-input>
              </el-form-item>
              <el-form-item label="确认密码"
                            prop="checkPass">
                <el-input type="password"
                          v-model="rulePassForm.checkPass"
                          autocomplete="off"></el-input>
              </el-form-item>
              <el-form-item>
                <el-button type="primary"
                           @click="submitForm('ruleForm')">提交</el-button>
              </el-form-item>
            </el-form>
          </template>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>
<script>
import { getsettings, createSettings, upload, changePassword } from '@/api/SettingsService'
import { Base64 } from 'js-base64'
import { mapGetters } from 'vuex'
export default {
  data() {
    var validatePass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入密码'))
      } else {
        if (this.rulePassForm.checkPass !== '') {
          this.$refs.ruleForm.validateField('checkPass')
        }
        callback()
      }
    }
    var validateNewPass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入密码'))
      } else if (value !== this.rulePassForm.pass) {
        callback(new Error('两次输入密码不一致!'))
      } else {
        callback()
      }
    }
    return {
      fileReader: '',
      imageUrl: '',
      settingsAccount: {},
      rules: {
        firstName: [
          { required: true, message: '请填写名字', trigger: 'change' }
        ],
        lastName: [
          { required: true, message: '请填写姓氏', trigger: 'change' }
        ],
        email: [
          { required: true, message: '请输入邮箱地址', trigger: 'blur' },
          { type: 'email', message: '请输入正确的邮箱地址', trigger: ['change', 'blur'] }
        ]
      },
      rulePassForm: {
        pass: '',
        checkPass: ''
      },
      rulesPassword: {
        pass: [
          { validator: validatePass, trigger: 'change' }
        ],
        checkPass: [
          { validator: validateNewPass, trigger: 'change' }
        ]
      }
    }
  },
  computed: {
    ...mapGetters(['avatar'])
  },
  mounted() {
    this.OnInit()
  },
  methods: {
    async OnInit() {
      this.fileReader = new FileReader()
      this.imageUrl = this.avatar
      await getsettings().then((res) => {
        this.settingsAccount = res.data
      })
    },
    httpRequest(options) {
      const file = options.file
      if (file) {
        this.fileReader.readAsDataURL(file)
      }
      this.fileReader.onload = () => {
        const base64Str = this.fileReader.result
        const data = {
          blob: base64Str.split(',')[1],
          type: 'avatar'
        }
        upload(data).then((res) => {
          this.imageUrl = base64Str
        })
      }
    },
    handleAvatarSuccess(res, file) {
      this.imageUrl = URL.createObjectURL(file.raw)
    },
    beforeAvatarUpload(file) {
      const isJPG = file.type === 'image/jpeg'
      const isLt2M = file.size / 1024 / 1024 < 20
      if (!isJPG) {
        this.$message.error('上传头像图片只能是 JPG 格式!')
      }
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 20MB!')
      }
      return isJPG && isLt2M
    },
    async progress(event, file, fileList) {
      this.BaseUrl = Base64.encode(file.raw)
      const data = {
        blob: this.BaseUrl,
        type: 'avatar'
      }
      await upload(data).then((res) => { })
    },
    async save(formName) {
      this.$refs[formName].validate(async(valid) => {
        if (valid) {
          const data = {
            activated: this.settingsAccount.activated,
            email: this.settingsAccount.email,
            firstName: this.settingsAccount.firstName,
            langKey: this.settingsAccount.langKey,
            lastName: this.settingsAccount.lastName,
            login: this.settingsAccount.login,
            imageUrl: ''
          }
          await createSettings(data).then((res) => {
            this.$nextTick(() => {
              this.$notify({
                title: '成功',
                message: '编辑成功',
                type: 'success',
                duration: 2000
              })
            })
          })
          this.OnInit()
        }
      })
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          changePassword(this.rulePassForm.checkPass).then((res) => { })
          this.$nextTick(() => {
            this.$notify({
              title: '成功',
              message: '重置成功',
              type: 'success',
              duration: 2000
            })
          })
        }
      })
      this.OnInit()
    }
  }
}
</script>
<style scope>
.box-card {
  margin: 0 0 20px;
}
.clearfix:before,
.clearfix:after {
  display: table;
  content: "";
}
.clearfix:after {
  clear: both;
}
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  margin: 0 0 30px 30px;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 128px;
  height: 128px;
  line-height: 128px;
  text-align: center;
}
.avatar {
  width: 128px;
  height: 128px;
  display: block;
}
.el-input {
  width: 210px;
}
.login-container .el-form-item {
  background: #ffffff;
}
.login-container .el-input input {
  background-color: #fff;
  background-image: none;
  border-radius: 4px;
  border: 1px solid #dcdfe6;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  color: #606266;
  display: inline-block;
  font-size: inherit;
  height: 40px;
  line-height: 40px;
  outline: 0;
  padding: 0 15px;
}
</style>
