<template>
    <div class="login-container" :style="{background: 'url(' + bg_img + ') 50% no-repeat'}">
        <el-card class="box-card mt-100">
            <div slot="header" class="row-flex justify-center">
                <img src="../../assets/logo-pdas.png"><h5>激活</h5>
            </div>
            <div class="item">
                <el-form autoComplete="on"
                         :model="activeForm"
                         :rules="activeRules"
                         ref="activeForm"
                         label-position="left">
                    <el-form-item prop="email" class="imputStyle">
                        <span class="svg-container svg-container_login"><svg-icon icon-class="email-fill" /></span>
                        <el-input name="email"
                                  type="email"
                                  v-model="activeForm.email"
                                  autoComplete="on"
                                  placeholder="电子邮箱" />
                    </el-form-item>
                    <el-form-item prop="username" class="imputStyle">
                        <span class="svg-container svg-container_login"><svg-icon icon-class="user" /></span>
                        <el-input name="username"
                                  type="text"
                                  v-model="activeForm.username"
                                  autoComplete="on"
                                  placeholder="用户名" />
                    </el-form-item>
                    <el-form-item prop="password" class="imputStyle">
                        <span class="svg-container"><svg-icon icon-class="password"></svg-icon></span>
                        <el-input name="password"
                                  :type="pwdType"
                                  v-model="activeForm.password"
                                  autoComplete="on"
                                  placeholder="密码"></el-input>
                        <span class="show-pwd" @click="showPwd"><svg-icon icon-class="eye" /></span>
                    </el-form-item>
                    <el-form-item prop="checkPass" class="imputStyle">
                        <span class="svg-container"><svg-icon icon-class="password"></svg-icon></span>
                        <el-input name="checkPass"
                                  :type="pwdType"
                                  v-model="activeForm.checkPass"
                                  autoComplete="on"
                                  placeholder="确认密码"></el-input>
                        <span class="show-pwd"><svg-icon icon-class="eye" /></span>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary"
                                   style="width:100%;"
                                   :disabled="isSaving"
                                   @click.native.prevent="handleActive">
                            激活
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
  import { activeInvitation, getInvitation } from '@/api/InvitationService'
  import bg_img from '@/assets/bg1.jpg'
  import { checkEmail } from '../../utils/validate'
  export default {
    name: 'invitation',
    data() {
      const validatePass = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入密码'))
        } else {
          if (value.length < 5) {
            callback(new Error('密码不能小于5位'))
          } else {
            if (this.activeForm.checkPass !== '') {
              this.$refs.activeForm.validateField('checkPass')
            }
            callback()
          }
        }
      }
      const validatePass2 = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请再次输入密码'))
        } else if (value !== this.activeForm.password) {
          callback(new Error('两次输入密码不一致'))
        } else {
          callback()
        }
      }
      const key = this.$route.params.key || '12844791923021679613'
      return {
        bg_img,
        key: key,
        invitation: {},
        activeForm: {
          username: '',
          password: '',
          email: '',
          checkPass: ''
        },
        activeRules: {
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
    created() {
      this.findInvitation()
    },
    methods: {
      showPwd() {
        if (this.pwdType === 'password') {
          this.pwdType = ''
        } else {
          this.pwdType = 'password'
        }
      },
      findInvitation() {
        getInvitation(this.key).then((res) => {
          this.invitation = res.data
          this.$set(this.activeForm, 'email', this.invitation.email)
        })
      },
      handleActive() {
        this.$refs.activeForm.validate(valid => {
          if (valid) {
            this.isSaving = true
            activeInvitation({
              invitationKey: this.invitation.key,
              login: this.activeForm.username,
              email: this.activeForm.email,
              password: this.activeForm.password
            }).then(() => {
              this.isSaving = false
              this.$store.dispatch('Login', {
                username: this.activeForm.username,
                password: this.activeForm.password
              }).then(() => {
                this.$router.push({ path: '/' })
              }).catch(() => {
                this.$router.push({ path: '/login' })
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
