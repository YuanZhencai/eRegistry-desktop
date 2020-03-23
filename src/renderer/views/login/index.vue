<template>
  <div class="login-container Grid">
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
            <el-form-item>
              <el-button type="primary"
                         style="width:100%;"
                         :loading="loading"
                         @click.native.prevent="handleLogin">
                登录
              </el-button>
            </el-form-item>
          </el-form>
        </div>
      </el-card>
    </div>
  </div>
</template>

<script>

export default {
  name: 'login',
  data() {
    const validatePass = (rule, value, callback) => {
      if (value.length < 3) {
        callback(new Error('密码不能小于5位'))
      } else {
        callback()
      }
    }
    return {
      loginForm: {
        username: '',
        password: ''
      },
      loginRules: {
        username: [{ required: true, message: '请填写用户名', trigger: 'blur' }],
        password: [{ required: true, trigger: 'blur', validator: validatePass }]
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

<style rel="stylesheet/scss" lang="scss">
$bg: #2d3a4b;
$light_gray: #606266;

/* reset element-ui css */
.login-container {
  .el-input {
    display: inline-block;
    height: 47px;
    width: 85%;
    input {
      background: transparent;
      border: 0px;
      -webkit-appearance: none;
      border-radius: 0px;
      padding: 12px 5px 12px 15px;
      color: $light_gray;
      height: 47px;
      &:-webkit-autofill {
        -webkit-box-shadow: 0 0 0px 1000px $bg inset !important;
        -webkit-text-fill-color: #fff !important;
      }
    }
  }
  .el-form-item {
    border: 1px solid rgba(255, 255, 255, 0.1);
    background: rgba(0, 0, 0, 0.1);
    border-radius: 5px;
    color: #454545;
  }
}

</style>

<style rel="stylesheet/scss" lang="scss" scoped>
$bg: #2d3a4b;
$dark_gray: #889aa4;
$light_gray: #eee;
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

.login-container {
  position: fixed;
  height: 100%;
  width: 100%;
  background: url(../../assets/bg1.jpg) 50% no-repeat;
  .login-form {
    position: absolute;
    left: 0;
    right: 0;
    width: 520px;
    padding: 35px 35px 15px 35px;
    margin: 120px auto;
  }
  .tips {
    font-size: 14px;
    color: #fff;
    margin-bottom: 10px;
    span {
      &:first-of-type {
        margin-right: 16px;
      }
    }
  }
  .svg-container {
    padding: 6px 5px 6px 15px;
    color: $dark_gray;
    vertical-align: middle;
    width: 30px;
    display: inline-block;
    &_login {
      font-size: 20px;
    }
  }
  .title {
    font-size: 26px;
    font-weight: 400;
    color: $light_gray;
    margin: 0px auto 40px auto;
    text-align: center;
    font-weight: bold;
  }
  .show-pwd {
    position: absolute;
    right: 10px;
    top: 7px;
    font-size: 16px;
    color: $dark_gray;
    cursor: pointer;
    user-select: none;
  }
  .text-box {
    margin-bottom: 20px;
  }
  .box-card {
    width: 320px;
    .item {
      margin-bottom: 18px;
      .errorTitle {
        color: #721c24;
        background-color: #f8d7da;
        border-radius: 5px;
        padding: 10px;
        margin-bottom: 15px;
        border-color: #f5c6cb;
      }
      .imputStyle {
        background: #fff;
        border: 1px solid #d9d9d9;
        border-radius: 5px;
        margin-bottom: 25px;
      }
    }
  }
}
</style>
