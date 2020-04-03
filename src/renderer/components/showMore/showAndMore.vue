<template>
  <div>
    <div v-if="text.length<120">
      {{text}}
    </div>
    <div v-else
         style="overflow:hidden;">
      <div :class="isShowMore? 'textOverFlow':''">
        {{text}}
      </div>
      <span @click="showMoreToggle"
            class="unfold"
            v-if="isShowMore">展示更多</span>
      <span @click="showMoreToggle"
            class="unfold"
            v-else>收起</span>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    text: {
      type: String,
      defalut: ''
    }
  },
  name: 'showAndMore',
  data() {
    return {
      isShowMore: true
    }
  },
  methods: {
    showMoreToggle() {
      this.isShowMore = !this.isShowMore
    }
  }

}
</script>

<style scoped>
.unfold {
  float: right;
  color: #409eff;
  cursor: pointer;
}

.textOverFlow {
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
.active {
  width: auto;
  overflow: auto;
  white-space: normal;
  text-overflow: clip;
}
</style>
