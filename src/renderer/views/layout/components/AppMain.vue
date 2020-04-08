<template>
  <section class="app-main">
    <router-view></router-view>
  </section>
</template>

<script>
export default {
  name: 'AppMain'
}
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
.app-main {
  position: relative;
  height: 100vh;
  padding-top: 50px;
  overflow: auto
}
</style>
