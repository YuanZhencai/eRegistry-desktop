<template>
  <div class="login-container Grid" :style="{background: 'url(' + bg_img + ') 50% no-repeat'}">
    <div class="Grid-cell flex-right">
      <div>
        <div class="text-box">
          <h3>个性化定制的CRF设计工具</h3>
        </div>
        <div class="text-box">
          <h3>操作便捷的患者登记应用</h3>
        </div>
        <div class="text-box">
          <h3>高效管理临床研究项目</h3>
        </div>
        <div class="text-box">
          <h3>让随访工作变得井井有条</h3>
        </div>
      </div>
    </div>
    <div class="Grid-cell flex">
      <el-card class="box-card">
        <div slot="header"
             class="flex">
          <img src="../../assets/logo-pdas.png">
        </div>
        <div class="item">
          <div v-show="errorTitle"
               class="errorTitle"><strong>登录失败!</strong> 请检查您的登录信息, 并重试一次.</div>
          <el-form autoComplete="on"
                   :model="loginForm"
                   :rules="loginRules"
                   ref="loginForm"
                   label-position="left">
            <el-form-item prop="username"
                          class="imputStyle">
              <span class="svg-container svg-container_login">
                <svg-icon icon-class="user" />
              </span>
              <el-input name="username"
                        type="text"
                        v-model="loginForm.username"
                        autoComplete="on"
                        placeholder="用户名" />
            </el-form-item>
            <el-form-item prop="password"
                          class="imputStyle">
              <span class="svg-container">
                <svg-icon icon-class="password"></svg-icon>
              </span>
              <el-input name="password"
                        :type="pwdType"
                        @keyup.enter.native="handleLogin"
                        v-model="loginForm.password"
                        autoComplete="on"
                        placeholder="密码"></el-input>
              <span class="show-pwd"
                    @click="showPwd">
                <svg-icon icon-class="eye" /></span>
            </el-form-item>
            <el-form-item class="text-right">
              <el-button type="text" style="color: #333;">
                <router-link :to="{path: '/reset/request'}">忘记密码?</router-link></el-button>
            </el-form-item>
            <el-form-item>
              <el-button type="primary"
                         style="width:100%;"
                         :loading="loading"
                         @click.native.prevent="handleLogin">
                登录
              </el-button>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" style="width:100%;">
                <router-link :to="{path: '/register'}">注册一个新账号</router-link>
              </el-button>
            </el-form-item>
          </el-form>
        </div>
      </el-card>
    </div>
  </div>
</template>

<script>
import bg_img from '@/assets/bg1.jpg'
export default {
  name: 'login',
  data() {
    const validatePass = (rule, value, callback) => {
      if (value.length < 5) {
        callback(new Error('密码不能小于5位'))
      } else {
        callback()
      }
    }
    return {
      bg_img,
      loginForm: {
        username: '',
        password: ''
      },
      loginRules: {
        username: [{ required: true, message: '请填写用户名', trigger: 'change' }],
        password: [{ required: true, trigger: 'change', validator: validatePass }]
      },
      loading: false,
      errorTitle: false,
      pwdType: 'password'
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
    handleLogin() {
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          this.loading = true
          this.$store.dispatch('Login', this.loginForm).then(() => {
            this.loading = false
            this.$router.push({ path: '/' })
          }).catch(() => {
            this.errorTitle = true
            this.loading = false
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.Grid {
  display: flex;
  .flex-right {
    display: flex;
    justify-content: flex-end;
    align-items: center;
  }
}
.Grid-cell {
  flex: 1;
}
.flex {
  display: flex;
  justify-content: center;
  align-items: center;
}

</style>
