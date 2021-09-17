<template>
  <div class="components-container">
    <div class="editor-content">
      <tinymce v-if="agreement" v-model="agreement.content" :height="500" @save="save"/>
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
        agreement: null
      }
    },
    created() {
      this.loadAll()
    },
    methods: {
      loadAll() {
        getAgreement(this.projectId).then((res) => {
          this.agreement = res.data
          if (!this.agreement) {
            this.agreement = {
              projectId: this.projectId
            }
          }
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
