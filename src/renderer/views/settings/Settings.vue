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
							<el-form-item label="用户名">
								<el-input size="small"
										  style="width:80%"
										  :disabled="true"
										  v-model="settingsAccount.login"></el-input>
							</el-form-item>
						</el-col>
						<el-col :span="12">
							<el-form-item label="电子邮件"
										  prop="email">
								<el-input size="small"
										  style="width:80%"
										  v-model="settingsAccount.email"></el-input>
							</el-form-item>
						</el-col>
					</el-row>
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
					<el-button size="small"
							   type="primary"
							   @click="save('ruleMessageForm')">保存
					</el-button>
				</el-form>
			</template>
        </el-card>
		  <el-card class="box-card">
			  <div slot="header"
				   class="clearfix">
				  <span>绑定手机号</span>
			  </div>
			  <template>
				  <el-form :model="settingsAccount"
						   status-icon
						   :rules="mobileRules"
						   ref="mobileForm"
						   label-width="100px"
						   class="demo-ruleForm">
					  <el-form-item label="手机号"
									prop="mobile">
						  <el-input v-model="settingsAccount.mobile"
									autocomplete="off"></el-input>
					  </el-form-item>

					  <el-form-item>
						  <el-button type="primary"
									 @click="save('mobileForm')">绑定</el-button>
					  </el-form-item>
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
                <el-button type="primary" :disabled="isSubmitting"
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
import { saveAvatar, changePassword } from '@/api/SettingsService'
import { mapGetters } from 'vuex'
import UserAvatar from '../../components/avatar/userAvatar'
import { getAccount, saveAccount } from '../../api/AccountService'

export default {
  name: 'Setting',
  components: {
    UserAvatar
  },
  computed: {
    ...mapGetters([
      'avatar',
      'name'
    ])
  },
  data() {
    const validatePass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入密码'))
      } else {
        if (this.rulePassForm.checkPass !== '') {
          this.$refs.ruleForm.validateField('checkPass')
        }
        callback()
      }
    }
    const validateNewPass = (rule, value, callback) => {
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
      mobileRules: {
        mobile: [
          { required: true, message: '请输入手机号', trigger: 'blur' },
          { pattern: /^(1(3|4|5|6|7|8|9)\d{9})$/, message: '手机号码有误，请重填', trigger: 'change' }
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
      },
      isSubmitting: false
    }
  },
  mounted() {
    this.OnInit()
  },
  methods: {
    async OnInit() {
      this.fileReader = new FileReader()
      this.imageUrl = this.avatar
      await getAccount().then((res) => {
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
          image: base64Str.split(',')[1],
          imageContentType: file.type,
          url: file.name,
          username: this.name
        }
        saveAvatar(data).then((res) => {
          this.imageUrl = base64Str
        })
      }
    },
    handleAvatarSuccess(res, file) {
      this.imageUrl = URL.createObjectURL(file.raw)
    },
    beforeAvatarUpload(file) {
      const isJPG = file.type === 'image/jpeg'
      const isLt2M = file.size / 1024 < 500
      if (!isJPG) {
        this.$message.error('上传头像图片只能是 JPG 格式!')
      }
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 500K!')
      }
      return isJPG && isLt2M
    },
    async save(formName) {
      this.$refs[formName].validate(async(valid) => {
        if (valid) {
          await saveAccount(this.settingsAccount).then((res) => {
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
          this.isSubmitting = true
          changePassword(this.rulePassForm.checkPass).then((res) => {
            this.isSubmitting = false
            this.$notify({
              title: '成功',
              message: '密码重置成功,请重新登录',
              type: 'success',
              duration: 1500
            })
            setTimeout(() => {
              this.logout()
            }, 1500)
          }, () => {
            this.isSubmitting = false
            this.$notify({
              title: '失败',
              message: '密码重置失败，请重试',
              type: 'error',
              duration: 2000
            })
          })
        }
      })
    },
    logout() {
      this.$store.dispatch('LogOut').then(() => {
        location.reload() // 为了重新实例化vue-router对象 避免bug
      })
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
