<template>
  <div class="components-container">
    <el-button type="primary" @click="save">保存</el-button>
    <div class="editor-content">
      <tinymce v-model="content" :height="300" />
    </div>
    <div class="editor-content" v-html="content" />
  </div>
</template>

<script>
  import Tinymce from '@/components/Tinymce'
  import { getAgreement, saveAgreements } from '../../api/AttachmentService'
  export default {
    name: 'ProjectInformedConsent',
    components: { Tinymce },

    data() {
      const projectId = this.$route.params.projectId
      return {
        projectId: projectId,
        agreementId: '',
        content: ``
      }
    },
    created() {
      this.loadAll()
    },
    methods: {
      loadAll() {
        getAgreement(this.projectId).then((res) => {
          this.content = res.data.content
          this.agreementId = res.data.id
        })
      },
      save() {
        saveAgreements({
          id: this.agreementId,
          projectId: this.projectId,
          content: this.content
        }).then(() => {
          this.$router.push({
            path: `/project/${this.projectId}/home`
          })
        })
      }
    }
  }
</script>
<style scoped>
  .editor-content{
    margin-top: 20px;
  }
</style>
