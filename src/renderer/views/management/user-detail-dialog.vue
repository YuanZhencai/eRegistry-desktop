<template>
	<el-dialog
			:title="'创建或添加用户'"
			:visible.sync="display">
		<el-form
				ref="userForm"
				:model="user"
				:rules="user.id ? {}: rules"
				label-position="left"
				label-width="100px"
				style="width: 400px; margin-left:50px;"
		>
			<el-form-item
					label="用户名"
					prop="login"
			>
				<el-input :disabled="user.id !== null" v-model="user.login"/>
			</el-form-item>
			<el-form-item
					prop="email"
					label="邮箱"
			>
				<el-input :disabled="user.id !== null" v-model="user.email"/>
			</el-form-item>
			<el-form-item label="激活">
				<el-checkbox v-model="user.activated"/>
			</el-form-item>
			<el-form-item
					label="权限"
					prop="authorities"
			>
				<el-checkbox-group v-model="user.authorities">
					<el-checkbox label="ROLE_USER"/>
					<el-checkbox label="ROLE_ADMIN"/>
				</el-checkbox-group>
			</el-form-item>
		</el-form>
		<div slot="footer" class="dialog-footer">
			<el-button size="mini" @click="cancel">取 消</el-button>
			<el-button size="mini" type="primary" :disabled="isSaving" @click="save('userForm')">保存</el-button>
		</div>
	</el-dialog>
</template>

<script>
	import { createUser, updateUser } from '../../api/ManagementService'

	export default {
	  name: 'UserDetailDialog',
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
	        login: [
	          { required: true, message: '用户名不能为空', trigger: 'change' }
	        ],
	        email: [
	          { required: true, message: '请输入邮箱地址', trigger: 'blur' },
	          { type: 'email', message: '请输入正确的邮箱地址', trigger: ['blur', 'change'] }
	        ]
	      }
	    }
	  },
	  methods: {
	    show(user) {
	      this.$nextTick(() => {
	        if (this.$refs['userForm'] !== undefined) {
	          this.$refs['userForm'].resetFields()
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
	          if (this.user.id) {
	            updateUser(this.user).then(res => {
	              this.isSaving = false
	              this.display = false
	              this.resolve(res.data)
	            }, () => {
	              this.isSaving = false
	            })
	          } else {
	            createUser(this.user).then(res => {
	              this.isSaving = false
	              this.display = false
	              this.resolve(res.data)
	            }, () => {
	              this.isSaving = false
	            })
	          }
	        }
	      })
	    }
	  }
	}
</script>

<style scoped>

</style>
