<template>
	<el-dialog
			:title="'修改密码'"
			:visible.sync="display">
		<el-form
				ref="passwordForm"
				:model="user"
				:rules="rules"
				label-position="left"
				label-width="100px"
				style="width: 400px; margin-left:50px;"
		>
			<el-form-item
					label="用户名"
					prop="login"
			>
				<el-input :disabled="true" v-model="user.login"/>
			</el-form-item>
			<el-form-item
					prop="email"
					label="邮箱"
			>
				<el-input :disabled="true" v-model="user.email"/>
			</el-form-item>
			<el-form-item
					prop="password"
					label="密码">
				<el-input
						ref="password"
						v-model="user.password"
						:type="'password'"
						name="password"/>
			</el-form-item>
		</el-form>
		<div slot="footer" class="dialog-footer">
			<el-button size="mini" @click="cancel">取 消</el-button>
			<el-button size="mini" type="primary" :disabled="isSaving" @click="save('passwordForm')">保存</el-button>
		</div>
	</el-dialog>
</template>

<script>
	import { changePassword } from '../../api/ManagementService'

	export default {
	  name: 'ChangePasswordDialog',
	  data() {
	    return {
	      user: {
	        id: null,
	        authorities: [],
	        activated: true
	      },
	      display: false,
	      resolve: null,
	      reject: null,
	      isSaving: false,
	      rules: {
	        password: [
	          { required: true, message: '密码不能为空!', trigger: 'change' },
	          { min: 6, message: '密码长度至少6位!', trigger: 'change' }
	        ]
	      }
	    }
	  },
	  methods: {
	    show(user) {
	      this.$nextTick(() => {
	        if (this.$refs['passwordForm'] !== undefined) {
	          this.$refs['passwordForm'].resetFields()
	        }
	      })
	      this.user = Object.assign(user)
	      this.display = true
	      return new Promise((resolve, reject) => {
	        this.resolve = resolve
	        this.reject = reject
	      })
	    },
	    close() {
	      this.display = false
	      this.reject('close')
	    },
	    cancel() {
	      this.display = false
	      this.reject('cancel')
	    },
	    save(formName) {
	      this.$refs[formName].validate((valid) => {
	        if (valid) {
	          this.isSaving = true
	          changePassword(this.user).then(res => {
	            this.isSaving = false
	            this.display = false
	            this.resolve(res.data)
	          }, () => {
	            this.isSaving = false
	          })
	        }
	      })
	    }
	  }
	}
</script>

<style scoped>

</style>
