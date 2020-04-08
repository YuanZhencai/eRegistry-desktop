<template>
  <div>
    <el-tooltip popper-class="item" effect="dark" :content="text" placement="top">
      <div class="textOverFlow">{{text}}</div>
    </el-tooltip>


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

<style>
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
.item{
  width: 400px;
}
.active {
  width: auto;
  overflow: auto;
  white-space: normal;
  text-overflow: clip;
}
</style>
