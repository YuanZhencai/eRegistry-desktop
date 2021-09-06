<template>
	<el-dialog title="设置病例附件类型" width="500px" :visible.sync="display" :before-close="close">
		<el-form label-width="75px" size="mini" :model="attachmentSetting" :rules="rules" ref="form">
			<el-form-item label="名称" prop="title">
				<el-input v-model="attachmentSetting.title"></el-input>
			</el-form-item>
			<el-form-item label="类型" prop="type">
				<el-select placeholder="选择类型"
						   v-model="attachmentSetting.type">
					<el-option label="病例" value="PATIENT_CASE"></el-option>
					<el-option label="随访" value="PLAN"></el-option>
				</el-select>
			</el-form-item>
			<el-form-item label="示例" prop="sampleUrl">
				<el-input v-model="attachmentSetting.sampleUrl"></el-input>
				<el-image style="width: 100px; height: 100px; margin-top: 5px"
						  :src="attachmentSetting.sampleUrl"
						  :preview-src-list="[attachmentSetting.sampleUrl]">
					<div slot="error" class="image-slot">
						<i class="el-icon-picture-outline"></i>
					</div>
				</el-image>
			</el-form-item>
		</el-form>
		<div slot="footer" class="dialog-footer">
			<el-button size="mini" @click="cancel">取 消</el-button>
			<el-button size="mini" type="primary" :disabled="isSaving" @click="confirm">保 存</el-button>
		</div>
	</el-dialog>
</template>

<script>
	import { getAttachmentSetting, saveAttachmentSetting } from '../../api/AttachmentService'

	export default {
	  name: 'AttachmentSettingDialog',
	  data() {
	    return {
	      attachmentSettingId: null,
	      display: false,
	      resolve: null,
	      reject: null,
	      rules: {
	        title: [
	          { required: true, message: '请输入名称', trigger: 'change' }
	        ],
	        type: [
	          { required: true, message: '请输入类型', trigger: 'change' }
	        ],
	        sampleUrl: [
	          { max: 500, message: '长度最大为500个字符', trigger: 'change' }
	        ]
	      },
	      attachmentSetting: { title: null },
	      isSaving: false
	    }
	  },
	  methods: {
	    show(attachmentSettingId) {
	      this.display = true
	      this.attachmentSettingId = attachmentSettingId
	      this.getSetting()
	      return new Promise((resolve, reject) => {
	        this.resolve = resolve
	        this.reject = reject
	      })
	    },
	    getSetting() {
	      if (this.attachmentSettingId) {
	        getAttachmentSetting(this.attachmentSettingId).then((res) => {
	          this.attachmentSetting = res.data
	        })
	      } else {
	        this.attachmentSetting = {
	          title: null,
	          projectId: this.$route.params.projectId
	        }
	      }
	    },
	    clearValidate() {
	      this.$nextTick(() => {
	        this.$refs['form'].clearValidate() // 只清除清除验证
	      })
	    },
	    cancel() {
	      this.display = false
	      this.clearValidate()
	      this.reject('cancel')
	    },
	    close() {
	      this.display = false
	      this.clearValidate()
	      this.reject('close')
	    },
	    confirm() {
	      this.$refs['form'].validate((valid) => {
	        if (valid) {
	          saveAttachmentSetting(this.attachmentSetting).then((res) => {
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
