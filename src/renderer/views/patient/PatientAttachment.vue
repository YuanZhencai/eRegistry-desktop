<template>
  <div class="demo-image__lazy">
    <div class="title" v-if="!attachments || attachments.length === 0">
      没有病例附件
    </div>
    <div v-else v-for="attachment in attachments">
      <div class="title" v-if="attachment.title">{{attachment.title}}</div>
      <el-image :key="attachment.id"
                :src="attachment.id | attachmentUrl"
                lazy
                :preview-src-list="urls">
      </el-image>
    </div>
  </div>
</template>
<script>
  import { formatAttachmentUrl, getPatientAttachments } from '../../api/AttachmentService'
  export default {
    name: 'PatientAttachment',
    data() {
      return {
        patientId: this.$route.query.patientId,
        caseId: this.$route.query.caseId,
        followId: this.$route.query.followId,
        urls: [],
        attachments: []
      }
    },
    mounted() {
      this.getAttachments(this.patientId, this.caseId, this.followId)
    },
    methods: {
      getAttachments(patientId, caseId, followId) {
        getPatientAttachments(patientId, caseId, followId).then(res => {
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
  .title{
    margin-top: 50px;
    font-size: 20px;
  }
</style>
