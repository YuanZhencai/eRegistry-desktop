<template>
  <div class="app-container">
    <h1>随访日历</h1>
    <el-calendar v-model="value">
    </el-calendar>
  </div>
</template>
<script>
export default {
  data() {
    return {
      value: new Date()
    }
  }
}
</script>