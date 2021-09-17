<template>
  <div class="components-container">
    <el-button type="primary" @click="save">保存</el-button>
    <div class="editor-content">
      <tinymce v-model="agreement.content" :height="300" />
    </div>
  </div>
</template>

<script>
  import Tinymce from '@/components/Tinymce'
  import { getAgreement, saveAgreement } from '../../api/AgreementService'
  export default {
    name: 'ProjectInformedConsent',
    components: { Tinymce },
    data() {
      const projectId = this.$route.params.projectId
      return {
        projectId: projectId,
        agreement: {
          id: '',
          projectId: '',
          content: ''
        }
      }
    },
    created() {
      this.loadAll()
    },
    methods: {
      loadAll() {
        getAgreement(this.projectId).then((res) => {
          this.agreement.content = res.data.content
          this.agreement.id = res.data.id
          this.agreement.projectId = res.data.projectId
        })
      },
      save() {
        saveAgreement(this.agreement).then(() => {
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
