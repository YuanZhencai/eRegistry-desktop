<template>
<div class="login-container">
    <el-card class="box-card mt-100">
        <div slot="header" class="text-center">
            <img src="../../assets/logo-pdas.png">
        </div>
        <div class="item">
            <el-form autoComplete="on"
                     :model="registerForm"
                     :rules="registerRules"
                     ref="registerForm"
                     label-position="left">
                <el-form-item prop="username" class="imputStyle">
                    <span class="svg-container svg-container_login"><svg-icon icon-class="user" /></span>
                    <el-input name="username"
                              type="text"
                              v-model="registerForm.username"
                              autoComplete="on"
                              placeholder="用户名" />
                </el-form-item>
                <el-form-item prop="email" class="imputStyle">
                    <span class="svg-container svg-container_login"><svg-icon icon-class="email-fill" /></span>
                    <el-input name="email"
                              type="email"
                              v-model="registerForm.email"
                              autoComplete="on"
                              placeholder="电子邮箱" />
                </el-form-item>
                <el-form-item prop="password" class="imputStyle">
                    <span class="svg-container"><svg-icon icon-class="password"></svg-icon></span>
                    <el-input name="password"
                              :type="pwdType"
                              v-model="registerForm.password"
                              autoComplete="on"
                              placeholder="密码"></el-input>
                    <span class="show-pwd" @click="showPwd"><svg-icon icon-class="eye" /></span>
                </el-form-item>
                <el-form-item prop="checkPass" class="imputStyle">
                    <span class="svg-container"><svg-icon icon-class="password"></svg-icon></span>
                    <el-input name="checkPass"
                              :type="pwdType"
                              v-model="registerForm.checkPass"
                              autoComplete="on"
                              placeholder="确认密码"></el-input>
                    <span class="show-pwd"><svg-icon icon-class="eye" /></span>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary"
                               style="width:100%;"
                               :disabled="isSaving"
                               @click.native.prevent="handleRegister">
                        注册
                    </el-button>
                </el-form-item>
                <el-form-item class="text-center">
                    <el-button type="text">
                        <span style="color: #303133;">已有账号？</span><router-link :to="{path: '/login'}">马上登录</router-link>
                    </el-button>
                </el-form-item>
            </el-form>
        </div>
    </el-card>
</div>
</template>

<script>
  // import bg_image from '@/assets/bg1.jpg'
  import { registerAccount } from '@/api/AccountService'
  export default {
    name: 'Register',
    data() {
      const checkEmail = (rule, value, callback) => {
        const mailReg = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])+/
        if (value === '') {
          return callback(new Error('邮箱不能为空'))
        }
        setTimeout(() => {
          if (mailReg.test(value)) {
            callback()
          } else {
            callback(new Error('请输入正确的邮箱格式'))
          }
        }, 100)
      }
      const validatePass = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入密码'))
        } else {
          if (value.length < 5) {
            callback(new Error('密码不能小于5位'))
          } else {
            if (this.registerForm.checkPass !== '') {
              this.$refs.registerForm.validateField('checkPass')
            }
            callback()
          }
        }
      }
      const validatePass2 = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请再次输入密码'))
        } else if (value !== this.registerForm.password) {
          callback(new Error('两次输入密码不一致'))
        } else {
          callback()
        }
      }
      return {
        registerForm: {
          username: '',
          password: '',
          email: '',
          checkPass: ''
        },
        registerRules: {
          username: [{ required: true, message: '请填写用户名', trigger: 'change' }],
          email: [{ validator: checkEmail, trigger: 'change' }],
          password: [{ validator: validatePass, trigger: 'change' }],
          checkPass: [{ validator: validatePass2, trigger: 'change' }]
        },
        errorTitle: false,
        pwdType: 'password',
        isSaving: false
      }
    },
    methods: {
      showPwd() {
        if (this.pwdType === 'password') {
          this.pwdType = ''
        } else {
          this.pwdType = 'password'
        }
      },
      handleRegister() {
        this.$refs.registerForm.validate(valid => {
          if (valid) {
            this.isSaving = true
            registerAccount({
              login: this.registerForm.username,
              email: this.registerForm.email,
              password: this.registerForm.password
            }).then(() => {
              this.isSaving = false
              this.$message({
                message: '注册成功，稍后会发送激活邮件到您的注册邮箱，请前往去激活账号.',
                type: 'success'
              })
            })
          } else {
            this.isSaving = false
          }
        })
      }
    }
  }
</script>

<style scoped>

</style>
