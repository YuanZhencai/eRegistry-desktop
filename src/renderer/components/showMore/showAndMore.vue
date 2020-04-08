<template>
  <div>
    <div v-if="text.length<numberLength">
      {{text}}
    </div>
    <el-popover v-else
            placement="top"
            width="400"
            trigger="hover"
            :content="text">
      <div slot="reference" class="textOverFlow">{{text}}</div>
    </el-popover>
  </div>
</template>
<script>
export default {
  props: {
    numberLength: {
      type: Number
    },
    text: {
      type: String,
      defalut: ''
    }
  },
  name: 'showAndMore',
  data() {
    return {
    }
  }
}
</script>

<style scoped>
.textOverFlow {
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
</style>
