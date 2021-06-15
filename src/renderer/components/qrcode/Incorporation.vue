<template>
    <el-popover
            placement="right-end"
            title="入组二维码"
            trigger="hover"
            width="200">
        <el-image :src="imageUrl"></el-image>
		<el-button type="text"
				   v-download="{'url': url, 'name': '入组二维码.png'}"
				   icon="el-icon-download">
			保存二维码
		</el-button>
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
        const url = `api/qrcode/incorporation`
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
      },
      imageUrl: function() {
        return `${SERVER_API_URL}${this.url}`
      }
    }
  }
</script>

<style scoped>

</style>
