<template>
    <div class="login-container">
        <el-row>
            <el-col :span="16" :offset="4" class="text-center">
                <h1 jhiTranslate="activate.title">启用</h1>

                <div class="alert alert-success" v-if="success">
                    <span><strong>您的账号已启用.</strong> 请 </span>
                    <router-link :to="{ path: '/login' }">登录</router-link>.
                </div>

                <div class="alert alert-danger" v-if="error">
                    <strong>您的账号无法启用.</strong> 请重新<router-link :to="{ path: '/register' }">注册</router-link>.
                </div>
            </el-col>
        </el-row>
    </div>
</template>

<script>
  import { activateAccount } from '@/api/AccountService'
  export default {
    name: 'activate',
    data() {
      const key = this.$route.params.key
      return {
        success: null,
        error: null,
        key
      }
    },
    created() {
      activateAccount({ key: this.key }).then(() => {
        this.error = null
        this.success = 'OK'
      }, () => {
        this.success = null
        this.error = 'ERROR'
      })
    }
  }
</script>

<style scoped>

</style>
