<template>
    <div class="login-container" :style="{background: 'url(' + bg_img + ') 50% no-repeat'}">
        <div class="alert alert-danger" v-if="errorEmailNotExists">
            <p>没有与该邮件地址关联的账号. 请使用其他邮件地址</p>
        </div>
        <div class="alert alert-success" v-if="success === 'OK'">
            <p>已将重置密码的操作说明发送到您的邮箱，请检查邮件.</p>
        </div>
        <el-card class="box-card mt-100">
            <div slot="header" class="row-flex justify-center">
                <img src="../../../assets/logo-pdas.png"><h5>忘记密码</h5>
            </div>
            <div class="item">
                <el-form autoComplete="on"
                         :model="resetForm"
                         :rules="resetRules"
                         ref="resetForm"
                         label-position="left">
                    <el-form-item prop="email" class="imputStyle">
                        <span class="svg-container svg-container_login"><svg-icon icon-class="email-fill" /></span>
                        <el-input name="email"
                                  type="email"
                                  v-model="resetForm.email"
                                  autoComplete="on"
                                  placeholder="注册邮箱" />
                    </el-form-item>

                    <el-form-item>
                        <el-row :gutter="20">
                            <el-col :span="12">
                                <el-button type="primary" style="width:100%;"
                                           :disabled="isSaving"
                                           @click.native.prevent="submit">
                                    提交
                                </el-button>
                            </el-col>
                            <el-col :span="12">
                                <el-button type="primary" style="width:100%;"
                                           @click.native.prevent="cancel">
                                    取消
                                </el-button>
                            </el-col>
                        </el-row>
                    </el-form-item>
                    <el-form-item>
                        <router-link :to="{path: '/reset/finish'}">finish</router-link>
                        <router-link :to="{path: '/activate'}">activate</router-link>
                        <router-link :to="{path: '/invitation'}">invitation</router-link>
                    </el-form-item>
                </el-form>
            </div>
        </el-card>
    </div>
</template>

<script>
  import { requestPasswordReset } from '@/api/AccountService'
  import bg_img from '@/assets/bg1.jpg'
  import { checkEmail } from '../../../utils/validate'
  export default {
    name: 'resetInit',
    data() {
      return {
        bg_img,
        isSaving: false,
        resetForm: {
          email: ''
        },
        resetRules: {
          email: [{ validator: checkEmail, trigger: 'change' }]
        },
        success: null,
        errorEmailNotExists: null
      }
    },
    methods: {
      submit() {
        this.$refs.resetForm.validate(valid => {
          if (valid) {
            this.isSaving = true
            requestPasswordReset(this.resetForm.email).then(() => {
              this.isSaving = false
              this.success = 'OK'
            }, (err) => {
              this.isSaving = false
              this.success = null
              if (err.response.status === 400 && err.response.data.errorKey === 'emailNotRegistered') {
                this.errorEmailNotExists = 'ERROR'
              }
            })
          }
        })
      },
      cancel() {
        this.$router.push({ path: '/login' })
      }
    }
  }
</script>

<style scoped>

</style>
