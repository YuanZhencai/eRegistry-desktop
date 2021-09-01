<template>
	<el-dialog title="患者病例附件" :visible.sync="display" :before-close="close" :fullscreen="true">
		<div class="demo-image__lazy">
			<div v-if="!attachments || attachments.length === 0">
				没有病例附件
			</div>
			<div v-else v-for="attachment in attachments">
				<div v-if="attachment.title">{{attachment.title}}</div>
				<el-image :key="attachment.id"
						  :src="attachment.id | attachmentUrl"
						  lazy
						  :preview-src-list="urls">
				</el-image>
			</div>
		</div>
		<div slot="footer" class="dialog-footer">
			<el-button size="mini" @click="cancel">取 消</el-button>
			<el-button size="mini" type="primary" @click="confirm">确 定</el-button>
		</div>
	</el-dialog>
</template>

<script>
	import { formatAttachmentUrl, getAttachments } from '../../api/AttachmentService'

	export default {
	  name: 'PatientAttachmentDialog',
	  data() {
	    return {
	      display: false,
	      resolve: null,
	      reject: null,
	      urls: [],
	      attachments: []
	    }
	  },
	  methods: {
	    show(projectId, patientId, planId) {
	      this.display = true
	      this.getAttachments(projectId, patientId, planId)
	      return new Promise((resolve, reject) => {
	        this.resolve = resolve
	        this.reject = reject
	      })
	    },
	    clear() {
	      this.attachments = []
	      this.urls = []
	    },
	    cancel() {
	      this.display = false
	      this.reject('cancel')
	      this.clear()
	    },
	    close() {
	      this.display = false
	      this.reject('close')
	      this.clear()
	    },
	    confirm() {
	      this.display = false
	      this.resolve('confirm')
	      this.clear()
	    },
	    getAttachments(projectId, patientId, planId) {
	      let params = {
	        'EQ_attachment.projectId': projectId
	      }
	      if (planId) {
	        params['EQ_attachment.planId'] = planId
	      } else if (patientId) {
	        params['EQ_attachment.patientId'] = patientId
	      }
	      getAttachments(params).then(res => {
	        let titles = {}
	        this.attachments = res.data.sort(function(x, y) {
	          if (x.settingId < y.settingId) {
	            return -1
	          }
	          if (x.settingId > y.settingId) {
	            return 1
	          }
	          return 0
	        }).map(attachment => {
	          if (titles[attachment.title]) {
	            attachment.title = null
	          } else {
	            titles[attachment.title] = attachment.title
	          }
	          return attachment
	        })
	        this.urls = this.attachments.map(attachment => {
	          return formatAttachmentUrl(attachment.id)
	        })
	      })
	    }
	  }
	}
</script>

<style scoped>
	.demo-image__lazy {
		text-align: center;
	}
</style>
