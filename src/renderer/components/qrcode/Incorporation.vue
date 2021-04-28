<template>
    <el-popover
            placement="right-end"
            title="入组二维码"
            trigger="hover"
            width="200">
        <el-image :src="url"></el-image>
        <i class="fa fa-qrcode" slot="reference"></i>
    </el-popover>
</template>

<script>
  import { SERVER_API_URL } from '../../constants'
  import store from '@/store'

  export default {
    name: 'Incorporation',
    props: ['projectId'],
    computed: {
      url: function() {
        const name = store.getters && store.getters.name
        const url = `${SERVER_API_URL}api/qrcode/incorporation`
        const queries = []
        if (name) {
          queries.push(`chargedBy=${name}`)
        }
        if (this.projectId) {
          queries.push(`projectId=${this.projectId}`)
        }
        if (queries.length > 0) {
          return `${url}?${queries.join('&')} `
        } else {
          return url
        }
      }
    }
  }
</script>

<style scoped>

</style>
