<template>
  <div>
    <div class="textOverFlow">
      {{text}}
      <div class="show">{{text}}</div>
      <el-tooltip class="item" effect="dark" content="Top Left 提示文字" placement="top-start">
        <el-button>上左</el-button>
      </el-tooltip>
    </div>
<!--    <div v-if="text.length<numberLength">-->
<!--      {{text}}-->
<!--    </div>-->
<!--    <div v-else-->
<!--         style="overflow:hidden;">-->
<!--      <div :class="isShowMore? 'textOverFlow':''">-->
<!--        {{text}}-->
<!--      </div>-->
<!--      <span @mouseover="showMoreToggle"-->
<!--            class="unfold"-->
<!--            v-if="isShowMore">展示更多</span>-->
<!--      <span @mouseout="showMoreToggle"-->
<!--            class="unfold"-->
<!--            v-else>收起</span>-->
<!--    </div>-->
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
      isShowMore: true,
      numberLength: 120
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
.show{
  border: 1px solid red;
  display: none;
}
.active {
  width: auto;
  overflow: auto;
  white-space: normal;
  text-overflow: clip;
}
</style>
